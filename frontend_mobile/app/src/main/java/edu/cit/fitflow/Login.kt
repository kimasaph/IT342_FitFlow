package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class Login : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize Firebase Auth and Firestore
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        val videoView = findViewById<VideoView>(R.id.vidGetStarted1)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.get_started}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        videoView.start()

        videoView.setOnCompletionListener {
            videoView.start() // Restart video
        }

        // TextView for "Sign Up" - Navigate to Registration Form
        val signUpText = findViewById<TextView>(R.id.txtSignUp1)
        signUpText.setOnClickListener {
            val intent = Intent(this, RegistrationForm::class.java)
            startActivity(intent)
        }

        // TextView for "Forgot Password" - Navigate to Forgot Password
        val forgotPasswordText = findViewById<TextView>(R.id.txtForgotPassword)
        forgotPasswordText.setOnClickListener {
            val intent = Intent(this, ForgotPassword1::class.java)
            startActivity(intent)
        }

        // Button for "Login" - Handle Login Logic
        val loginButton = findViewById<Button>(R.id.btnLogin)
        loginButton.setOnClickListener {
            val email = findViewById<EditText>(R.id.editTextTextEmailAddress2).text.toString().trim()
            val password = findViewById<EditText>(R.id.editTextTextPassword3).text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter both email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Sign in with Firebase Auth
            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        // Login successful, show a success toast
                        Toast.makeText(this, "Login Successful!", Toast.LENGTH_SHORT).show()

                        // Retrieve user data from Firestore
                        val userId = auth.currentUser?.uid ?: return@addOnCompleteListener
                        db.collection("users").document(userId)
                            .get()
                            .addOnSuccessListener { document ->
                                if (document.exists()) {
                                    val firstName = document.getString("firstName")
                                    val lastName = document.getString("lastName")
                                    val gender = document.getString("gender")

                                    // Pass user data to the dashboard
                                    val intent = Intent(this, FitFlowDashboard::class.java).apply {
                                        putExtra("FIRST_NAME", firstName)
                                        putExtra("LAST_NAME", lastName)
                                        putExtra("GENDER", gender)
                                    }
                                    startActivity(intent)
                                    finish()
                                } else {
                                    Toast.makeText(this, "User data not found", Toast.LENGTH_SHORT).show()
                                }
                            }
                            .addOnFailureListener { e ->
                                Toast.makeText(this, "Failed to retrieve user data: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                    } else {
                        // If sign-in fails, show a message
                        Toast.makeText(this, "Authentication Failed: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                    }
                }
        }
    }
}
