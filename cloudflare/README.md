# ShishuRokkha secure pairing backend (Cloudflare)

This backend is separate from the Android app. It does not change the APKs until it is deployed and the apps are deliberately connected to its URL.

## Why Cloudflare is here

Firebase Authentication stays in place for parent accounts. Cloudflare Worker is the trusted server that checks Firebase ID tokens and decides whether a pairing code can be used. D1 stores hashed temporary codes and family links. This avoids Firebase Blaze billing for the pairing service.

## What the initial backend implements

- Verify Firebase ID-token signatures and required claims on the server.
- Let an email/password parent create a random, 10-minute pairing code.
- Let a Firebase Anonymous child-device identity redeem a code once.
- Store only a SHA-256 hash of the pairing code.
- Rate-limit pairing creation and redemption attempts.
- List a parent's active child links and revoke/unlink a child.

## What is not active yet

- The Worker has not been deployed.
- The Android apps are not connected to it yet.
- The child app does not yet sign in anonymously or provide a pairing-code screen.
- No usage reports, app blocking, location sharing, or push alerts are implemented.
- This initial backend still needs end-to-end tests and independent security review before real families rely on it.

## Beginner setup, when ready

You need a Cloudflare account with the free Workers and D1 services. Do not upgrade Firebase to Blaze. Do not share Cloudflare API tokens or passwords in chat or commit them to GitHub.

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) and sign in or create an account.
2. Open **Workers & Pages** and find **D1 SQL Database** (the menu label may vary).
3. Create a database named `shishurokkha-pairing`.
4. Copy the database ID shown in the database's details. The ID is not a password or API token, but share only that ID when asked.
5. Before deployment, replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.toml` with the database ID. The assistant can help update this file.
6. Apply `schema.sql` to the new database and deploy the Worker. We will do this step-by-step after the database exists.
7. Enable **Anonymous** sign-in in Firebase Console under **Authentication → Sign-in method** when preparing the child app.
8. Check the deployed `/health` endpoint. Only after it responds successfully should we connect the Android apps and test pairing.

No billing should be enabled or paid services deployed without your explicit approval. The Worker must not be treated as operational until the deployed endpoint and both Android apps have been tested together.

## API endpoints

- `GET /health`: service health only.
- `POST /v1/pairing/create`: Firebase email/password parent token required; returns a 10-minute code.
- `POST /v1/pairing/redeem`: Firebase Anonymous child token required; JSON body `{"code":"..."}`.
- `GET /v1/children`: lists active child IDs for the authenticated parent.
- `POST /v1/children/unlink`: revokes an active child link belonging to the authenticated parent; JSON body `{"childUid":"..."}`.

All endpoints except `/health` require `Authorization: Bearer <Firebase ID token>`.

## Before production

Test token validation and key rotation, concurrent code redemption, expiry, replay attempts, rate limiting, database failures, revocation, account deletion, and abuse cases. Review Cloudflare/Firebase quotas and add consent, clear child-device disclosure, data minimization, retention/deletion, and appropriate guardian authorization before collecting any child activity data.
