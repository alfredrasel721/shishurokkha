# ShishuRokkha Native Android Starter

This repository includes native Kotlin Android app variants alongside the existing web prototype.

## Build
Open GitHub Actions and run **Build ShishuRokkha Android APKs**. On success, download the `shishurokkha-debug-apks` artifact and extract it to get Parent and Child debug APKs.

Expected APKs:
- `app/build/outputs/apk/parent/debug/app-parent-debug.apk`
- `app/build/outputs/apk/child/debug/app-child-debug.apk`

## Firebase setup
- Firebase project: `shishurokkha`
- Parent application ID: `org.shishurokkha.app.parent`
- Child application ID: `org.shishurokkha.app.child`
- Android configuration: `app/google-services.json` (contains entries for both app IDs)
- Firebase SDK dependencies: Authentication and Cloud Firestore via the Firebase BoM.
- The app displays whether the Firebase SDK can initialise from its configuration. This is **not** proof that sign-in, database access, or internet connectivity has been tested.

In Firebase Console, enable Email/Password under **Authentication → Sign-in method**. Keep Firestore in production/locked mode until reviewed security rules are deployed. Never use open test rules for family or child data.

## Honest feature status
These are installable native Android starter apps, not a complete parental-control product. Firebase SDK initialization is wired in, but account registration/sign-in screens, secure cloud pairing, Firestore data access, backend functions, push notifications, app blocking, location sharing, usage reporting, production signing, and real-device QA are not implemented. The app does not send usage data to a server.

Do not use this starter to claim that remote parental controls are operational. Implement consent and clear disclosure, secure authentication, server-side authorization, family-scoped database rules, data minimization, revocation and deletion, and device testing before production.

## Next milestones
1. Implement parent registration, sign-in, and password reset.
2. Add secure pairing through a trusted backend, with expiring single-use codes and unlink/revoke support.
3. Deploy and test Firestore security rules for family-scoped access.
4. Add explicit child-device setup and test permitted app-usage reporting on physical devices.
