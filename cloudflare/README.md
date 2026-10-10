# ShishuRokkha secure pairing backend (Cloudflare)

This is a separate backend component. It does not change the Android APKs until the app is deliberately connected to a deployed Worker URL.

## What it is designed to do

- Verify Firebase Authentication ID-token signatures and required claims on the server.
- Allow signed-in email/password parent accounts to create short-lived, single-use pairing codes.
- Allow Firebase Anonymous Authentication child identities to redeem a code.
- Store only a SHA-256 hash of each pairing code.
- Limit code creation and redemption attempts.
- List active child links for the owning parent and support unlink/revocation.
- Keep family-link access scoped to the authenticated parent.

## Required free-tier services

- Cloudflare Workers Free
- Cloudflare D1 Free
- Existing Firebase Authentication project `shishurokkha`

Do not upgrade Firebase to Blaze for this service. Do not put Cloudflare API tokens, service-account private keys, or other secrets in this repository.

## Deployment is intentionally not automatic

A Cloudflare account and one-time setup are required before this backend can be used:

1. Create a D1 database named `shishurokkha-pairing` in Cloudflare.
2. Replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.toml` with the database ID shown by Cloudflare.
3. Apply `schema.sql` to that D1 database.
4. Deploy this Worker from the `cloudflare` folder using Cloudflare's dashboard or Wrangler.
5. Open the deployed `/health` endpoint and confirm it returns `{"ok":true,...}`.
6. Enable **Anonymous** sign-in in Firebase Authentication before testing the child app.

The app must not be considered paired until the deployed endpoint and both Android clients have been tested together.

## Endpoints

- `GET /health`: service health only.
- `POST /v1/pairing/create`: requires a Firebase ID token from an email/password parent. Returns a 10-minute code.
- `POST /v1/pairing/redeem`: requires a Firebase ID token from a Firebase Anonymous child account and JSON body `{"code":"..." }`.
- `GET /v1/children`: lists active child IDs for the authenticated parent.
- `POST /v1/children/unlink`: revokes a child link belonging to the authenticated parent; body `{"childUid":"..." }`.

All requests except `/health` require `Authorization: Bearer <Firebase ID token>`.

## Important current limitations

- This backend is an initial implementation and is not yet deployed or connected to the Android apps.
- It does not implement device usage reporting, app blocking, location sharing, push notifications, or a parent-facing pairing UI.
- Rate limits are database-backed best-effort limits, not a substitute for independent security review and production abuse testing.
- Before production use, test token rotation/key caching, simultaneous redemption, database failures, revocation, account deletion, and abuse cases. Review Cloudflare and Firebase quotas before inviting real families.
- Do not collect activity data until the child app has clear disclosure, appropriate guardian authorization, permission handling, and a documented retention/deletion policy.
