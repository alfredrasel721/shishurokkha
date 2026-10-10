package org.shishurokkha.app

import android.app.Activity
import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.graphics.Color
import com.google.firebase.FirebaseApp

class MainActivity : Activity() {
    private val teal = Color.rgb(13, 148, 136)
    private val ink = Color.rgb(22, 45, 55)
    private val muted = Color.rgb(91, 111, 121)
    private lateinit var root: LinearLayout
    private lateinit var status: TextView
    private var firebaseStatus = "Not initialized"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        firebaseStatus = try {
            if (FirebaseApp.initializeApp(this) != null) {
                "SDK initialized; sign-in and sync are not implemented yet"
            } else {
                "Configuration not found"
            }
        } catch (error: Exception) {
            "Initialization failed (${error.javaClass.simpleName})"
        }
        render()
    }

    override fun onResume() {
        super.onResume()
        if (::root.isInitialized) updateStatus()
    }

    private fun render() {
        val scroll = ScrollView(this)
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(22), dp(30), dp(22), dp(28))
            setBackgroundColor(Color.rgb(247, 250, 250))
        }
        scroll.addView(root)
        setContentView(scroll)

        addText("শিশুরক্ষা", 30f, teal, true, 0, 2)
        addText("ShishuRokkha", 22f, ink, true, 0, 8)
        addText(if (BuildConfig.APP_ROLE == "parent") "PARENT COMPANION" else "CHILD COMPANION", 12f, teal, true, 0, 18)
        addText(if (BuildConfig.APP_ROLE == "parent") "A safer digital childhood, together." else "This device is being set up for family safety.", 17f, ink, true, 0, 8)
        addText("Native Android foundation · Version ${BuildConfig.VERSION_NAME}", 13f, muted, false, 0, 20)

        status = TextView(this).apply {
            textSize = 14f
            setTextColor(ink)
            setPadding(dp(14), dp(14), dp(14), dp(14))
            setBackgroundColor(Color.WHITE)
        }
        root.addView(status, match())
        updateStatus()

        if (BuildConfig.APP_ROLE == "parent") {
            addButton("Set up usage access", "Open Android Usage Access settings") {
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            }
            addButton("Pair a child device", "Pairing will be enabled after the cloud backend is implemented") {
                info("Firebase SDK setup is being connected. Secure cloud pairing is not implemented yet.")
            }
            addButton("Open safety setup checklist", "Review the required production setup") {
                info("Next: implement sign-in, secure authenticated pairing, Firestore security rules, then test usage reporting on real devices.")
            }
        } else {
            addButton("Review setup and permissions", "No monitoring is enabled silently") {
                info("Firebase SDK setup is being connected. Pairing and child-device protections are not active until the cloud backend and explicit setup flow are implemented.")
            }
        }
        addText("IMPORTANT", 12f, teal, true, 0, 18)
        addText("Firebase SDK initialization does not mean accounts, pairing, monitoring, or cloud sync are active. This starter does not send usage data to a server. Any future collection must be disclosed, permission-based, securely authorised, and revocable.", 14f, muted, false, 0, 10)
    }

    private fun updateStatus() {
        val enabled = try {
            val ops = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            @Suppress("DEPRECATION")
            ops.checkOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), packageName) == AppOpsManager.MODE_ALLOWED
        } catch (_: Exception) { false }
        status.text = "Build role: ${BuildConfig.APP_ROLE}\nUsage access: ${if (enabled) "Granted" else "Not granted"}\nFirebase setup: $firebaseStatus"
    }

    private fun addText(value: String, size: Float, color: Int, bold: Boolean, top: Int, bottom: Int) {
        val t = TextView(this).apply {
            text = value
            textSize = size
            setTextColor(color)
            if (bold) setTypeface(typeface, android.graphics.Typeface.BOLD)
            setPadding(0, dp(top), 0, dp(bottom))
        }
        root.addView(t, match())
    }

    private fun addButton(title: String, subtitle: String, action: () -> Unit) {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(13), dp(16), dp(13))
            setBackgroundColor(Color.WHITE)
        }
        val heading = TextView(this).apply {
            text = title; textSize = 16f; setTextColor(ink)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        val detail = TextView(this).apply {
            text = subtitle; textSize = 12f; setTextColor(muted); setPadding(0, dp(5), 0, 0)
        }
        box.addView(heading)
        box.addView(detail)
        box.setOnClickListener { action() }
        val p = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        p.bottomMargin = dp(10)
        root.addView(box, p)
    }

    private fun info(message: String) =
        android.app.AlertDialog.Builder(this).setTitle("ShishuRokkha").setMessage(message).setPositiveButton("OK", null).show()

    private fun match() = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
