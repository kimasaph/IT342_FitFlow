package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.facebook.*
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import com.google.android.gms.auth.api.signin.*
import com.google.android.gms.common.api.ApiException
import org.json.JSONException
import java.util.*

class RegistrationForm : AppCompatActivity() {

    private lateinit var googleSignInClient: GoogleSignInClient
    private lateinit var callbackManager: CallbackManager

    private val GOOGLE_SIGN_IN_REQUEST = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_form)

        // 🔙 Back button
        findViewById<ImageView>(R.id.imgLeft2).setOnClickListener {
            startActivity(Intent(this, Registration::class.java))
        }

        // 🔑 Navigate to Login
        findViewById<TextView>(R.id.btnSignIn).setOnClickListener {
            startActivity(Intent(this, Login::class.java))
        }

        // 📹 Video Background
        val videoView = findViewById<VideoView>(R.id.vidRegistrationForm)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.registration_form}")
        videoView.setVideoURI(uri)
        videoView.start()
        videoView.setOnCompletionListener { videoView.start() }

        // 🌐 Google Sign-In setup
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)

        findViewById<Button>(R.id.btnGoogle).setOnClickListener {
            val signInIntent = googleSignInClient.signInIntent
            startActivityForResult(signInIntent, GOOGLE_SIGN_IN_REQUEST)
        }

        // 📘 Facebook Sign-In setup
        callbackManager = CallbackManager.Factory.create()

        findViewById<Button>(R.id.btnFacebook).setOnClickListener {
            LoginManager.getInstance().logInWithReadPermissions(this, listOf("email", "public_profile"))
            LoginManager.getInstance().registerCallback(callbackManager,
                object : FacebookCallback<LoginResult> {
                    override fun onSuccess(result: LoginResult) {
                        handleFacebookAccessToken(result.accessToken)
                    }

                    override fun onCancel() {
                        Toast.makeText(this@RegistrationForm, "Facebook sign in cancelled.", Toast.LENGTH_SHORT).show()
                    }

                    override fun onError(error: FacebookException) {
                        Toast.makeText(this@RegistrationForm, "Facebook sign in failed: ${error.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        callbackManager.onActivityResult(requestCode, resultCode, data)

        if (requestCode == GOOGLE_SIGN_IN_REQUEST) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                val email = account?.email ?: ""
                val name = account?.displayName ?: ""
                val firstName = name.split(" ").firstOrNull() ?: ""
                val lastName = name.split(" ").drop(1).joinToString(" ")
                goToSuccessScreen(email, firstName, lastName)
            } catch (e: ApiException) {
                Toast.makeText(this, "Google sign in failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun handleFacebookAccessToken(token: AccessToken) {
        val request = GraphRequest.newMeRequest(token) { json, _ ->
            if (json != null) {
                try {
                    val email = json.optString("email", "")
                    val name = json.optString("name", "")
                    val firstName = name.split(" ").firstOrNull() ?: ""
                    val lastName = name.split(" ").drop(1).joinToString(" ")
                    goToSuccessScreen(email, firstName, lastName)
                } catch (e: JSONException) {
                    Toast.makeText(this, "Facebook data error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this, "Facebook data was null", Toast.LENGTH_SHORT).show()
            }
        }

        val parameters = Bundle().apply {
            putString("fields", "id,name,email")
        }
        request.parameters = parameters
        request.executeAsync()
    }


    private fun goToSuccessScreen(email: String, firstName: String, lastName: String) {
        val intent = Intent(this, RegistrationSuccess::class.java)
        intent.putExtra("email", email)
        intent.putExtra("firstName", firstName)
        intent.putExtra("lastName", lastName)
        startActivity(intent)
        finish()
    }
}
