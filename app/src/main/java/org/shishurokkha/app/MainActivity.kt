package org.shishurokkha.app

import android.app.Activity
import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.graphics.Color
import android.text.InputType
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth

class MainActivity : Activity() {
    private val teal = Color.rgb(13, 148, 136)
    private val ink = Color.rgb(22, 45, 55)
    private val muted = Color.rgb(91, 111, 121)
    private lateinit var root: LinearLayout
    private lateinit var status: TextView
    private var firebaseStatus = "Not initialized"
    private var auth: FirebaseAuth? = null
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var authPanel: LinearLayout
    private lateinit var signedInPanel: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        firebaseStatus = try {
            if (FirebaseApp.initializeApp(this) != null) {
                auth = FirebaseAuth.getInstance()
                "Connected to Firebase SDK"
            } else "Configuration not found"
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
            addText("Parent account", 20f, ink, true, 20, 8)
            addText("Create an account or sign in. Use an email address you can access because Firebase may send password-reset emails.", 14f, muted, false, 0, 12)
            emailInput = EditText(this).apply {
                hint = "Email address"
                inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                isSingleLine = true
                setTextColor(ink)
            }
            passwordInput = EditText(this).apply {
                hint = "Password (at least 6 characters)"
                inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
                isSingleLine = true
                setTextColor(ink)
            }
            root.addView(emailInput, match())
            root.addView(passwordInput, match())
            authPanel = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
            root.addView(authPanel, match())
            signedInPanel = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
            root.addView(signedInPanel, match())
            refreshAuthUi()
            addButton("Set up usage access", "Opens the Android system settings") {
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            }
        } else {
            addText("Child device setup", 20f, ink, true, 20, 8)
            addText("The child account and secure parent pairing flow are not implemented yet. This app does not silently monitor or upload activity.", 14f, muted, false, 0, 12)
        }

        addText("What works today", 12f, teal, true, 20, 8)
        addText("Parent email/password account creation, sign-in, password reset and sign-out use Firebase Authentication. Secure child pairing, Firestore family data, usage reports, blocking, location sharing and push alerts are not active yet.", 14f, muted, false, 0, 10)
    }

    private fun register() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()
        if (!validateCredentials(email, password, true)) return
        setBusy(true)
        auth?.createUserWithEmailAndPassword(email, password)
            ?.addOnCompleteListener(this) { task ->
                setBusy(false)
                if (task.isSuccessful) {
                    showMessage("Account created", "Your parent account was created successfully. Keep your password private.")
                } else showAuthError(task.exception)
                refreshAuthUi()
            } ?: showMessage("Firebase unavailable", "Firebase Authentication could not be initialized.")
    }

    private fun signIn() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()
        if (!validateCredentials(email, password, false)) return
        setBusy(true)
        auth?.signInWithEmailAndPassword(email, password)
            ?.addOnCompleteListener(this) { task ->
                setBusy(false)
                if (task.isSuccessful) showMessage("Signed in", "You are signed in. Family pairing is a separate feature and is not active yet.")
                else showAuthError(task.exception)
                refreshAuthUi()
            } ?: showMessage("Firebase unavailable", "Firebase Authentication could not be initialized.")
    }

    private fun resetPassword() {
        val email = emailInput.text.toString().trim()
        if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showMessage("Enter your email", "Type the email address for your account first.")
            return
        }
        setBusy(true)
        auth?.sendPasswordResetEmail(email)?.addOnCompleteListener(this) { task ->
            setBusy(false)
            if (task.isSuccessful) showMessage("Check your email", "If Firebase accepts this address, a password-reset email will be sent.")
            else showAuthError(task.exception)
        } ?: showMessage("Firebase unavailable", "Firebase Authentication could not be initialized.")
    }

    private fun signOut() {
        auth?.signOut()
        refreshAuthUi()
        showMessage("Signed out", "This parent app is now signed out.")
    }

    private fun validateCredentials(email: String, password: String, creating: Boolean): Boolean {
        if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showMessage("Check email", "Enter a valid email address.")
            return false
        }
        if (password.length < 6) {
            showMessage("Check password", if (creating) "Use at least 6 characters for the password." else "Enter your password (at least 6 characters).")
            return false
        }
        return true
    }

    private fun setBusy(busy: Boolean) {
        if (::authPanel.isInitialized) {
            for (i in 0 until authPanel.childCount) authPanel.getChildAt(i).isEnabled = !busy
        }
        if (::emailInput.isInitialized) emailInput.isEnabled = !busy
        if (::passwordInput.isInitialized) passwordInput.isEnabled = !busy
    }

    private fun refreshAuthUi() {
        if (!::authPanel.isInitialized || !::signedInPanel.isInitialized) return
        authPanel.removeAllViews()
        signedInPanel.removeAllViews()
        val user = auth?.currentUser
        if (user == null) {
            authPanel.addView(makeAction("Create parent account") { register() }, match())
            authPanel.addView(makeAction("Sign in") { signIn() }, match())
            authPanel.addView(makeAction("Reset password") { resetPassword() }, match())
        } else {
            signedInPanel.addView(TextView(this).apply {
                text = "Signed in as ${user.email ?: "parent"}"
                textSize = 14f
                setTextColor(ink)
                setPadding(0, dp(12), 0, dp(8))
            }, match())
            signedInPanel.addView(makeAction("Sign out") { signOut() }, match())
        }
    }

    private fun makeAction(title: String, action: () -> Unit): TextView =
        TextView(this).apply {
            text = title
            textSize = 16f
            setTextColor(Color.WHITE)
            setPadding(dp(16), dp(13), dp(16), dp(13))
            setBackgroundColor(teal)
            setOnClickListener {
                (getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager)
                    .hideSoftInputFromWindow(windowToken, 0)
                action()
            }
            val p = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            p.bottomMargin = dp(9)
            layoutParams = p
        }

    private fun showAuthError(error: Exception?) {
        val message = when (error) {
            is com.google.firebase.auth.FirebaseAuthUserCollisionException -> "An account already exists for this email. Try signing in instead."
            is com.google.firebase.auth.FirebaseAuthWeakPasswordException -> "Firebase rejected the password. Choose a stronger password."
            is com.google.firebase.auth.FirebaseAuthInvalidCredentialsException -> "The email or password is invalid. Check them and try again."
            else -> error?.localizedMessage ?: "The request failed. Check internet access and Firebase Authentication settings."
        }
        showMessage("Authentication failed", message)
    }

    private fun showMessage(title: String, message: String) {
        android.app.AlertDialog.Builder(this).setTitle(title).setMessage(message).setPositiveButton("OK", null).show()
    }

    private fun updateStatus() {
        val enabled = try {
            val ops = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            @Suppress("DEPRECATION")
            ops.checkOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), packageName) == AppOpsManager.MODE_ALLOWED
        } catch (_: Exception) { false }
        val signedIn = if (BuildConfig.APP_ROLE == "parent" && auth?.currentUser != null) "Yes" else "No"
        status.text = "Build role: ${BuildConfig.APP_ROLE}\nUsage access: ${if (enabled) "Granted" else "Not granted"}\nFirebase setup: $firebaseStatus\nParent signed in: $signedIn"
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
        box.addView(TextView(this).apply {
            text = title; textSize = 16f; setTextColor(ink)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        })
        box.addView(TextView(this).apply {
            text = subtitle; textSize = 12f; setTextColor(muted); setPadding(0, dp(5), 0, 0)
        })
        box.setOnClickListener { action() }
        val p = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        p.bottomMargin = dp(10)
        root.addView(box, p)
    }

    private fun match() = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
