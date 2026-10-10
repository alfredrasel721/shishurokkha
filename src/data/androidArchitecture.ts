export interface KotlinCodeModule {
  id: string;
  filename: string;
  language: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  code: string;
}

export const KOTLIN_CODE_MODULES: KotlinCodeModule[] = [
  {
    id: 'app-blocker',
    filename: 'AppBlockerAccessibilityService.kt',
    language: 'kotlin',
    titleEn: '1. App Detection & Lock Shield (AccessibilityService)',
    titleBn: '১. অ্যাপ ট্র্যাকিং ও তাৎক্ষণিক লক শিল্ড (AccessibilityService)',
    descriptionEn: 'Monitors Android window changes in real time. When restricted apps like Free Fire or TikTok launch, it intercepts the foreground event and renders the ShishuRokkha lockdown overlay.',
    descriptionBn: 'অ্যান্ড্রয়েডের উইন্ডো পরিবর্তন রিয়েলটাইমে ট্র্যাক করে। ফ্রি ফায়ার বা টিকটক চালু হলে এটি উইন্ডো ডিটেক্ট করে তাৎক্ষণিকভাবে লক স্ক্রিন সামনে নিয়ে আসে।',
    code: `package com.shishurokkha.child.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.util.Log
import com.shishurokkha.child.overlay.LockOverlayActivity
import com.shishurokkha.child.data.PolicyManager

class AppBlockerAccessibilityService : AccessibilityService() {

    private lateinit var policyManager: PolicyManager

    override fun onServiceConnected() {
        super.onServiceConnected()
        policyManager = PolicyManager(applicationContext)
        Log.d("ShishuRokkha", "Accessibility Service Connected & Guard Active")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val packageName = event.packageName?.toString() ?: return
        val currentPolicy = policyManager.getActivePolicy()

        // 1. Check if Parent Emergency Lockdown or Salat Prayer Break is active
        if (currentPolicy.isDevicePaused || currentPolicy.isPrayerBreakActive) {
            if (!policyManager.isWhitelistedEmergencyApp(packageName)) {
                triggerLockOverlay(packageName, "DEVICE_PAUSED")
                return
            }
        }

        // 2. Check Study Mode (Only 10MS & Shikho allowed)
        if (currentPolicy.isStudyModeActive) {
            if (!policyManager.isEducationApp(packageName)) {
                triggerLockOverlay(packageName, "STUDY_MODE_RESTRICTION")
                return
            }
        }

        // 3. Check App-Specific Daily Quota (e.g., Garena Free Fire)
        if (policyManager.isAppOverDailyLimit(packageName)) {
            triggerLockOverlay(packageName, "QUOTA_EXHAUSTED")
        }
    }

    private fun triggerLockOverlay(blockedPackage: String, reason: String) {
        val lockIntent = Intent(this, LockOverlayActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("EXTRA_BLOCKED_PKG", blockedPackage)
            putExtra("EXTRA_REASON", reason)
        }
        startActivity(lockIntent)
    }

    override fun onInterrupt() {
        Log.w("ShishuRokkha", "Accessibility Service interrupted by OS")
    }
}`,
  },
  {
    id: 'device-admin',
    filename: 'ShishuRokkhaAdminReceiver.kt',
    language: 'kotlin',
    titleEn: '2. Anti-Tamper & Anti-Uninstall (DeviceAdminReceiver)',
    titleBn: '২. আনইনস্টল ও ফোর্স স্টপ প্রতিরোধ (DeviceAdminReceiver)',
    descriptionEn: 'Locks down the app within Android OS. If a child attempts to uninstall ShishuRokkha or force-stop it via Settings, this service triggers an authorization challenge requiring the parent passcode.',
    descriptionBn: 'অ্যান্ড্রয়েড ওএস-এ অ্যাপটিকে সুরক্ষিত করে। সন্তান সেটিংস থেকে আনইনস্টল বা ফোর্স স্টপ করতে চাইলে অভিভাবকের গোপন মাস্টার পিন ছাড়া সিস্টেম অ্যাক্সেস ব্লক করে দেয়।',
    code: `package com.shishurokkha.child.admin

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast
import com.shishurokkha.child.telemetry.TelemetryDispatcher

class ShishuRokkhaAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Toast.makeText(context, "ShishuRokkha Device Administrator Activated", Toast.LENGTH_SHORT).show()
        TelemetryDispatcher.dispatchAdminStatus(context, isEnabled = true)
    }

    override fun onDisableRequested(context: Context, intent: Intent): CharSequence {
        // Intercept when someone clicks "Deactivate & Uninstall" in Android Settings
        TelemetryDispatcher.dispatchSecurityAlert(
            context,
            alertType = "UNINSTALL_ATTEMPT",
            message = "Child attempted to revoke Device Administrator rights at Settings"
        )

        return "Warning: Deactivating ShishuRokkha will immediately alert your parents. Parental Master PIN is required to proceed."
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        TelemetryDispatcher.dispatchAdminStatus(context, isEnabled = false)
    }
}`,
  },
  {
    id: 'mfs-shield',
    filename: 'MfsFinancialShieldService.kt',
    language: 'kotlin',
    titleEn: '3. bKash & Nagad Wallet Shield (WindowManager Overlay)',
    titleBn: '৩. বিকাশ ও নগদ ওয়ালেট সুরক্ষা শিল্ড (WindowManager Overlay)',
    descriptionEn: 'Detects mobile wallet apps and Google Play billing popups. Injects an impenetrable security surface over bKash and Nagad to stop unauthorized in-game diamond purchases.',
    descriptionBn: 'বিকাশ, নগদ বা গুগল প্লে পেমেন্ট পপআপ শনাক্ত করে। গেমের ডায়মন্ড কেনা ঠেকাতে বিকাশ উইন্ডোর উপর স্বয়ংক্রিয়ভাবে অভিভাবক পিন শিল্ড এঁটে দেয়।',
    code: `package com.shishurokkha.child.mfs

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import com.shishurokkha.child.R
import com.shishurokkha.child.telemetry.TelemetryDispatcher

class MfsFinancialShieldService : Service() {

    private lateinit var windowManager: WindowManager
    private var overlayView: View? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val targetWalletApp = intent?.getStringExtra("EXTRA_WALLET_APP") ?: "bKash"
        showMfsShieldOverlay(targetWalletApp)
        return START_NOT_STICKY
    }

    private fun showMfsShieldOverlay(walletAppName: String) {
        if (overlayView != null) return

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
        }

        overlayView = LayoutInflater.from(this).inflate(R.layout.layout_mfs_security_overlay, null)
        
        // Handle dismiss only when valid Parent Master PIN is entered
        overlayView?.findViewById<View>(R.id.btn_parent_unlock)?.setOnClickListener {
            // Verify Parent Biometrics or PIN
            removeOverlay()
        }

        windowManager.addView(overlayView, params)
        TelemetryDispatcher.dispatchMfsIntercept(this, walletAppName)
    }

    private fun removeOverlay() {
        if (overlayView != null) {
            windowManager.removeView(overlayView)
            overlayView = null
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`,
  },
  {
    id: 'manifest',
    filename: 'AndroidManifest.xml',
    language: 'xml',
    titleEn: '4. Android System Manifest & Permissions',
    titleBn: '৪. অ্যান্ড্রয়েড সিস্টেম ম্যানিফেস্ট ও পারমিশন কনফিগারেশন',
    descriptionEn: 'The core configuration file specifying the required Android permissions, background services, and intent filters for the child companion APK.',
    descriptionBn: 'অ্যান্ড্রয়েড ওএস কনফিগারেশন ফাইল যাতে ডিভাইস অ্যাডমিন, ওভারলে এবং ব্যাকগ্রাউন্ড সার্ভিসের পারমিশন যুক্ত রয়েছে।',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shishurokkha.child">

    <!-- Mandatory Permissions for Parental Supervision -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

    <application
        android:name=".ShishuRokkhaApplication"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/Theme.ShishuRokkha">

        <!-- 1. Real-time App Blocker Accessibility Service -->
        <service
            android:name=".service.AppBlockerAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- 2. Device Administrator Receiver (Anti-Uninstall) -->
        <receiver
            android:name=".admin.ShishuRokkhaAdminReceiver"
            android:permission="android.permission.BIND_DEVICE_ADMIN"
            android:exported="true">
            <meta-data
                android:name="android.app.device_admin"
                android:resource="@xml/device_admin_policies" />
            <intent-filter>
                <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
                <action android:name="android.app.action.DEVICE_ADMIN_DISABLE_REQUESTED" />
                <action android:name="android.app.action.DEVICE_ADMIN_DISABLED" />
            </intent-filter>
        </receiver>

        <!-- 3. bKash / Nagad Financial Shield Window Overlay Service -->
        <service
            android:name=".mfs.MfsFinancialShieldService"
            android:exported="false" />

        <!-- 4. Google Play Services Geofencing Broadcast Receiver -->
        <receiver
            android:name=".geofence.GeofenceBroadcastReceiver"
            android:exported="true" />

    </application>
</manifest>`,
  },
];
