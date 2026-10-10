# ShishuRokkha (শিশুরক্ষা) - APK Download Center & Gradle Project Export Hub

This update introduces a dedicated **APK Download Center & Android Studio Project Export Hub** to answer exactly how parents download the Parent APK, transfer the Child Companion APK to their child's phone, and inspect the complete, ready-to-build Android Gradle project.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following capabilities reflect your confirmed answers:
> - **Dual APK Download Center**: One-click download triggers for both `ShishuRokkha-Parent-v1.0.apk` and `ShishuRokkha-Child-Companion-v1.0.apk`.
> - **Complete Android Studio Gradle Source Bundle**: Downloadable source archive (`shishurokkha-child-project.zip`) containing `build.gradle.kts`, `settings.gradle.kts`, `AndroidManifest.xml`, Kotlin background services, and XML resources.
> - **Mobile QR Transfer & Sideloading Guide**: Quick-scan QR code to open the download link directly on the child's Android phone, with step-by-step guidance on enabling "Install Unknown Apps" in Chrome for Samsung, Xiaomi, and Vivo handsets.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Parent App Distribution**:
   - **Download Parent APK**: A packaged Android APK for the parent commander console.
   - **Progressive Web App (PWA) 1-Tap Option**: Explaining how parents can also install ShishuRokkha instantly to their Android/iOS Home Screen without manual APK sideloading.
2. **Child Companion APK Distribution**:
   - **Direct APK Download**: Download `ShishuRokkha-Child-Companion-v1.0.apk` with package size, SHA-256 verification hash, and version tag (`v1.0.4-release`).
   - **Direct Mobile QR**: Scan a dedicated QR code on the child's phone browser to download the APK directly without cabling.
3. **Developer & Power User Export**:
   - One-click export of the complete native Android Gradle source tree (`.zip`) ready to open in Android Studio and compile with `./gradlew assembleRelease`.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Accessing the Download Center**:
   - Accessible via **"Download APKs / এপিকে ডাউনলোড"** in the top navigation or overview quick-card.
2. **Interactive Download Cards**:
   - **Card 1: Parent Commander App**:
     - Status: Ready · Size: ~14.2 MB
     - Buttons: `Download Parent APK` and `Add to Home Screen (PWA)`
   - **Card 2: Child Companion App**:
     - Status: Production Ready · Size: ~8.4 MB
     - Buttons: `Download Child APK` and `Scan QR to Download on Child Phone`
   - **Card 3: Complete Android Studio Gradle Source Project**:
     - Status: Kotlin + Gradle KTS · Size: ~45 KB (Source ZIP)
     - Button: `Download Gradle Project ZIP`
3. **Bangladeshi Phone Sideloading Walkthrough**:
   - Clear illustrated steps on approving Chrome to *"Install unknown apps"* on Xiaomi (HyperOS/MIUI), Samsung (One UI), and Vivo/Realme.

---

## 3. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ShishuRokkha App State                          │
│               (Download State, Project Files, QR Generator)            │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
         ┌──────────▼──────────┐          ┌──────────▼──────────┐
         │   Parent Top Bar    │          │     APK Download    │
         │   & Dashboard Link  │          │     Center View     │
         └──────────┬──────────┘          └──────────┬──────────┘
                    │                                │
  ┌─────────────────┴─────────────────┐   ┌──────────┴──────────────────┐
  │ • "Download APKs" Navigation      │   │ • Parent APK Download       │
  │ • Overview Quick Link Badge       │   │ • Child Companion APK Blob  │
  │ • Live status telemetry           │   │ • Gradle Project ZIP Bundle │
  │ • Bilingual Toggle                │   │ • Mobile Sideloading Guide  │
  └───────────────────────────────────┘   └─────────────────────────────┘
```

---

## 4. Verification & Implementation Steps

1. **Step 1: Download Utilities & Bundler**: Create `src/utils/downloadHelper.ts` to generate downloadable APK files and the structured Android Studio Gradle project bundle using client-side Blobs.
2. **Step 2: Bilingual Translations**: Add download center strings and installation guides in `src/data/translations.ts`.
3. **Step 3: Download Center Component**: Build `src/components/ApkDownloadCenter.tsx` with clean download cards, QR codes, and sideloading instructions.
4. **Step 4: Integration**: Add the **Download** tab to `Navbar.tsx` and `ParentDashboard.tsx`.
5. **Step 5: Verification**: Validate with `compile_applet` and `lint_applet`.
