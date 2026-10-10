# ShishuRokkha Native Android Starter

This repository now includes a native Kotlin Android Gradle project alongside the existing web prototype.

## Build
Open GitHub Actions and run **Build ShishuRokkha Android APKs**. On success, download the `shishurokkha-debug-apks` artifact and extract it to get Parent and Child debug APKs.

Expected APKs:
- `app/build/outputs/apk/parent/debug/app-parent-debug.apk`
- `app/build/outputs/apk/child/debug/app-child-debug.apk`

## Honest feature status
These are installable native Android starter apps, not a complete parental-control product. Cloud accounts, secure pairing, remote commands, push notifications, app blocking, location tracking, usage reporting, production signing, and real-device QA are not implemented. The app does not send data to a server. Usage Access only opens Android settings and checks the permission state.

Do not use this starter to claim that remote parental controls are operational. Implement consent, secure authentication, backend authorization, data minimization, revocation, deletion, and device testing before production.
