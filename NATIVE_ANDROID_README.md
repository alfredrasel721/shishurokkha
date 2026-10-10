# ShishuRokkha Native Android Starter

This repository contains native Kotlin Parent and Child Android app variants alongside the existing web prototype.

## Build Android APKs
Open GitHub Actions and run **Build ShishuRokkha Android APKs**. On success, download the `shishurokkha-debug-apks` artifact and extract it to get Parent and Child debug APKs.

Expected APKs:
- `app/build/outputs/apk/parent/debug/app-parent-debug.apk`
- `app/build/outputs/apk/child/debug/app-child-debug.apk`

## Firebase setup
- Firebase project: `shishurokkha`
- Parent application ID: `org.shishurokkha.app.parent`
- Child application ID: `org.shishurokkha.app.child`
- Android configuration: `app/google-services.json` (contains entries for both app IDs)
- The Parent app supports email/password registration, sign-in, password reset, and sign-out through Firebase Authentication.

In Firebase Console, enable Email/Password under **Authentication → Sign-in method**. Anonymous sign-in will also be needed for the future child-device identity flow. Keep Firestore in production/locked mode until reviewed security rules are deployed. Never use open test rules for family or child data.

## Optional secure pairing backend
An initial Cloudflare Workers + D1 backend implementation is in the `cloudflare/` folder. It is separate from the Android app and does not affect the APKs until deployed and deliberately connected.

See `cloudflare/README.md` for setup and limitations. It is not deployed or connected to the Android apps yet. Do not upgrade Firebase to Blaze or enable paid services for this project without explicit approval.

## Honest feature status
These are installable native Android starter apps, not a complete parental-control product. Parent authentication is implemented and was tested on a physical device by the project owner. The Cloudflare backend code has been added to the repository but has not yet been deployed, independently security-reviewed, or tested end-to-end with both apps. Secure pairing is therefore **not active**. Firestore family data, push notifications, app blocking, location sharing, usage reporting, production signing, and full real-device QA are not implemented. The app does not currently send usage data to a server.

Do not claim remote parental controls are operational. Before production, complete consent and clear disclosure, server-side authorization, family-scoped access rules, data minimization, revocation and deletion, and device testing.

## Next milestones
1. Deploy and test the optional Cloudflare Worker and D1 database on the free plan.
2. Enable Firebase Anonymous Authentication for child-device identity.
3. Connect the Parent and Child apps to the deployed backend and test pairing, expiry, single-use redemption, and unlinking.
4. Add only the parental-control features supported by Android permissions and verify them on physical devices.
