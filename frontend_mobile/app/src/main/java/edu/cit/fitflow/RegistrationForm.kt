package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FirebaseFirestore

class RegistrationForm : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore
    private lateinit var googleSignInClient: GoogleSignInClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_form)

        // Initialize Firebase Authentication & Firestore
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        // Initialize Google Sign-In
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)

        // Back Button
        val backButton = findViewById<ImageView>(R.id.imgLeft2)
        backButton.setOnClickListener {
            val intent = Intent(this, Registration::class.java)
            startActivity(intent)
        }

        val toLogin = findViewById<TextView>(R.id.btnSignIn)
        toLogin.setOnClickListener {
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }

        // Input Fields
        val firstName = findViewById<EditText>(R.id.editTextText)
        val lastName = findViewById<EditText>(R.id.editTextText2)
        val email = findViewById<EditText>(R.id.editTextTextEmailAddress)
        val password = findViewById<EditText>(R.id.editTextTextPassword)
        val confirmPassword = findViewById<EditText>(R.id.editTextTextPassword2)

        // Gender RadioButtons
        val radioMale = findViewById<RadioButton>(R.id.radioButton)
        val radioFemale = findViewById<RadioButton>(R.id.radioButton2)
        val radioOthers = findViewById<RadioButton>(R.id.radioButton3)

        // Sign Up Button
        val signUpButton = findViewById<Button>(R.id.btnSignUp1)
        signUpButton.setOnClickListener {
            val fName = firstName.text.toString().trim()
            val lName = lastName.text.toString().trim()
            val emailText = email.text.toString().trim()
            val passText = password.text.toString().trim()
            val confirmPassText = confirmPassword.text.toString().trim()

            val gender = when {
                radioMale.isChecked -> "Male"
                radioFemale.isChecked -> "Female"
                radioOthers.isChecked -> "Others"
                else -> "Not specified"
            }

            if (fName.isEmpty() || lName.isEmpty() || emailText.isEmpty() || passText.isEmpty() || confirmPassText.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (passText != confirmPassText) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            //signUpButton.isEnabled = false

            auth.createUserWithEmailAndPassword(emailText, passText)
                .addOnSuccessListener { result ->
                    val userId = result.user?.uid
                    if (userId == null) {
                        Toast.makeText(this, "Unexpected error: No user ID", Toast.LENGTH_SHORT).show()
                        signUpButton.isEnabled = true
                        return@addOnSuccessListener
                    }

                    val user = hashMapOf(
                        "firstName" to fName,
                        "lastName" to lName,
                        "email" to emailText,
                        "gender" to gender
                    )

                    db.collection("users").document(userId).set(user)
                        .addOnSuccessListener {
                            Toast.makeText(this, "Registration Successful!", Toast.LENGTH_SHORT).show()
                            Log.d("Registration", "Navigating to Login activity") //test
                            startActivity(Intent(this, Login::class.java))
                            finish()
                        }
                        .addOnFailureListener { e ->
                            Toast.makeText(this, "Firestore error: ${e.message}", Toast.LENGTH_SHORT).show()
                            signUpButton.isEnabled = true
                        }
                }
                .addOnFailureListener { e ->
                    if (e is FirebaseAuthUserCollisionException) {
                        Toast.makeText(this, "Email already in use", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this, "Registration Failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                    signUpButton.isEnabled = true
                }
        }

        // Google Sign-In Button
        findViewById<Button>(R.id.btnGoogle).setOnClickListener {
            val signInIntent = googleSignInClient.signInIntent
            startActivityForResult(signInIntent, RC_SIGN_IN)
        }

        // Apple Sign-In Button (not natively supported)
        findViewById<Button>(R.id.btnApple).setOnClickListener {
            Toast.makeText(this, "Apple sign-in is not supported on Android.", Toast.LENGTH_SHORT).show()
        }

        // Video Background
        val videoView = findViewById<VideoView>(R.id.vidRegistrationForm)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.registration_form}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        videoView.start()
        videoView.setOnCompletionListener {
            videoView.start()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)!!
                firebaseAuthWithGoogle(account.idToken!!)
            } catch (e: ApiException) {
                Log.w("GoogleSignIn", "Google sign in failed", e)
            }
        }
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    Toast.makeText(this, "Google sign-in successful", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this, FitFlowDashboard::class.java))
                    finish()
                } else {
                    Toast.makeText(this, "Authentication failed", Toast.LENGTH_SHORT).show()
                }
            }
    }

    companion object {
        private const val RC_SIGN_IN = 9001
    }
}
