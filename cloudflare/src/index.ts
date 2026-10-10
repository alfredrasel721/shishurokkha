interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
}

interface FirebaseClaims {
  sub: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
  auth_time?: number;
  email?: string;
  email_verified?: boolean;
  firebase?: { sign_in_provider?: string };
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_TTL_SECONDS = 10 * 60;
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

let cachedJwks: { expiresAt: number; keys: JsonWebKey[] } | null = null;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "GET, POST, OPTIONS",
    },
  });
}

function base64UrlBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodePart(value: string): Record<string, unknown> {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(value)));
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function getJwks(): Promise<JsonWebKey[]> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) return cachedJwks.keys;

  const response = await fetch(JWKS_URL, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!response.ok) throw new Error("Unable to retrieve Firebase signing keys");
  const body = (await response.json()) as { keys?: JsonWebKey[] };
  if (!Array.isArray(body.keys)) throw new Error("Invalid Firebase signing-key response");

  cachedJwks = { keys: body.keys, expiresAt: now + 5 * 60 * 1000 };
  return body.keys;
}

async function verifyFirebaseToken(request: Request, env: Env): Promise<FirebaseClaims> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Response("Authentication required", { status: 401 });

  const token = match[1];
  const parts = token.split(".");
  if (parts.length !== 3) throw new Response("Invalid authentication token", { status: 401 });

  let headerPart: Record<string, unknown>;
  let claims: FirebaseClaims;
  try {
    headerPart = decodePart(parts[0]);
    claims = decodePart(parts[1]) as unknown as FirebaseClaims;
  } catch {
    throw new Response("Invalid authentication token", { status: 401 });
  }

  if (headerPart.alg !== "RS256" || typeof headerPart.kid !== "string") {
    throw new Response("Unsupported authentication token", { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    claims.aud !== env.FIREBASE_PROJECT_ID ||
    claims.iss !== `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}` ||
    typeof claims.sub !== "string" ||
    claims.sub.length < 1 ||
    claims.sub.length > 128 ||
    typeof claims.exp !== "number" ||
    claims.exp <= now ||
    typeof claims.iat !== "number" ||
    claims.iat > now + 60
  ) {
    throw new Response("Expired or invalid authentication token", { status: 401 });
  }

  const jwks = await getJwks();
  const jwk = jwks.find((key) => (key as JsonWebKey & { kid?: string }).kid === headerPart.kid);
  if (!jwk) {
    cachedJwks = null;
    throw new Response("Unrecognised authentication key; retry sign-in", { status: 401 });
  }

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    base64UrlBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new Response("Invalid authentication signature", { status: 401 });
  return claims;
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Response("Expected application/json", { status: 415 });
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 4096) throw new Response("Request body too large", { status: 413 });
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
    return body;
  } catch {
    throw new Response("Invalid JSON body", { status: 400 });
  }
}

async function rateLimit(
  env: Env,
  key: string,
  maxAttempts: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / windowSeconds);
  const rateKey = await sha256(`${key}:${bucket}`);
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now).run();
  const result = await env.DB.prepare(
    `INSERT INTO rate_limits(rate_key, attempts, expires_at)
     VALUES (?, 1, ?)
     ON CONFLICT(rate_key) DO UPDATE SET attempts = attempts + 1
     RETURNING attempts`,
  ).bind(rateKey, (bucket + 1) * windowSeconds).first<{ attempts: number }>();
  return (result?.attempts ?? maxAttempts + 1) <= maxAttempts;
}

function newPairingCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte & 31]).join("");
}

async function createPairing(request: Request, env: Env): Promise<Response> {
  const claims = await verifyFirebaseToken(request, env);
  if (claims.firebase?.sign_in_provider !== "password") {
    return json({ error: "A parent must sign in with an email/password account." }, 403);
  }
  if (!(await rateLimit(env, `create:${claims.sub}`, 5, 60 * 60))) {
    return json({ error: "Too many pairing codes requested. Try again later." }, 429);
  }

  const code = newPairingCode();
  const codeHash = await sha256(code);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO pairing_codes(code_hash, parent_uid, created_at, expires_at) VALUES (?, ?, ?, ?)",
  ).bind(codeHash, claims.sub, now, now + CODE_TTL_SECONDS).run();

  return json({
    code,
    expiresAt: new Date((now + CODE_TTL_SECONDS) * 1000).toISOString(),
    expiresInSeconds: CODE_TTL_SECONDS,
  }, 201);
}

async function redeemPairing(request: Request, env: Env): Promise<Response> {
  const claims = await verifyFirebaseToken(request, env);
  if (claims.firebase?.sign_in_provider !== "anonymous") {
    return json({ error: "The child device must use its child-device sign-in." }, 403);
  }

  const body = await readJson(request);
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/.test(code)) {
    return json({ error: "Invalid or expired pairing code." }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const ipBucket = Math.floor(Date.now() / 1000 / (15 * 60));
  if (!(await rateLimit(env, `redeem-ip:${ip}`, 10, 15 * 60)) ||
      !(await rateLimit(env, `redeem-child:${claims.sub}`, 10, 15 * 60))) {
    return json({ error: "Too many attempts. Wait before trying again." }, 429);
  }

  const now = Math.floor(Date.now() / 1000);
  const codeHash = await sha256(code);
  const results = await env.DB.batch([
    env.DB.prepare(
      `UPDATE pairing_codes
       SET consumed_at = ?, consumed_by_child_uid = ?
       WHERE code_hash = ? AND consumed_at IS NULL AND expires_at > ?
       AND NOT EXISTS (
         SELECT 1 FROM family_links WHERE child_uid = ? AND revoked_at IS NULL
       )`,
    ).bind(now, claims.sub, codeHash, now, claims.sub),
    env.DB.prepare(
      `INSERT INTO family_links(child_uid, parent_uid, linked_at, revoked_at)
       SELECT ?, parent_uid, ?, NULL FROM pairing_codes
       WHERE code_hash = ? AND consumed_by_child_uid = ? AND consumed_at = ?
       ON CONFLICT(child_uid) DO UPDATE SET
         parent_uid = excluded.parent_uid, linked_at = excluded.linked_at, revoked_at = NULL
       WHERE family_links.revoked_at IS NOT NULL`,
    ).bind(claims.sub, now, codeHash, claims.sub, now),
  ]);

  const changed = Number(results[0]?.meta?.changes ?? 0);
  const linked = Number(results[1]?.meta?.changes ?? 0);
  if (changed !== 1 || linked !== 1) {
    return json({ error: "Invalid, expired, already-used code, or child device already linked." }, 400);
  }

  const link = await env.DB.prepare(
    "SELECT parent_uid, linked_at FROM family_links WHERE child_uid = ? AND revoked_at IS NULL",
  ).bind(claims.sub).first<{ parent_uid: string; linked_at: number }>();

  return json({ linked: true, linkedAt: link?.linked_at ?? now });
}

async function listChildren(request: Request, env: Env): Promise<Response> {
  const claims = await verifyFirebaseToken(request, env);
  if (claims.firebase?.sign_in_provider !== "password") {
    return json({ error: "Parent account required." }, 403);
  }
  const result = await env.DB.prepare(
    "SELECT child_uid, linked_at FROM family_links WHERE parent_uid = ? AND revoked_at IS NULL ORDER BY linked_at DESC",
  ).bind(claims.sub).all();
  return json({ children: result.results ?? [] });
}

async function unlinkChild(request: Request, env: Env): Promise<Response> {
  const claims = await verifyFirebaseToken(request, env);
  if (claims.firebase?.sign_in_provider !== "password") {
    return json({ error: "Parent account required." }, 403);
  }
  const body = await readJson(request);
  const childUid = typeof body.childUid === "string" ? body.childUid : "";
  if (!/^[A-Za-z0-9:_-]{1,128}$/.test(childUid)) {
    return json({ error: "Invalid child device identifier." }, 400);
  }
  const result = await env.DB.prepare(
    "UPDATE family_links SET revoked_at = ? WHERE parent_uid = ? AND child_uid = ? AND revoked_at IS NULL",
  ).bind(Math.floor(Date.now() / 1000), claims.sub, childUid).run();
  if (Number(result.meta.changes ?? 0) !== 1) {
    return json({ error: "Active child link not found." }, 404);
  }
  return json({ unlinked: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return json({ ok: true });
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return json({ ok: true, service: "shishurokkha-pairing-api" });
      }
      if (request.method === "POST" && url.pathname === "/v1/pairing/create") {
        return await createPairing(request, env);
      }
      if (request.method === "POST" && url.pathname === "/v1/pairing/redeem") {
        return await redeemPairing(request, env);
      }
      if (request.method === "GET" && url.pathname === "/v1/children") {
        return await listChildren(request, env);
      }
      if (request.method === "POST" && url.pathname === "/v1/children/unlink") {
        return await unlinkChild(request, env);
      }
      return json({ error: "Not found." }, 404);
    } catch (error) {
      if (error instanceof Response) return json({ error: await error.text() }, error.status);
      return json({ error: "Internal server error." }, 500);
    }
  },
};
