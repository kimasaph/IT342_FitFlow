package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.firestore.FirebaseFirestore

class RegistrationForm : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_form)

        // Initialize Firebase Authentication & Firestore
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

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

            // Basic validation
            if (fName.isEmpty() || lName.isEmpty() || emailText.isEmpty() || passText.isEmpty() || confirmPassText.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (passText != confirmPassText) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val auth = FirebaseAuth.getInstance()
            val db = FirebaseFirestore.getInstance()

            auth.createUserWithEmailAndPassword(emailText, passText)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        // User creation successful in FirebaseAuth, proceed to store data in Firestore
                        val userId = auth.currentUser?.uid ?: return@addOnCompleteListener

                        val user = hashMapOf(
                            "firstName" to fName,
                            "lastName" to lName,
                            "email" to emailText,
                            "gender" to gender
                        )

                        db.collection("users").document(userId).set(user)
                            .addOnSuccessListener {
                                Toast.makeText(this, "Registration Successful!", Toast.LENGTH_SHORT)
                                    .show()

                                // Navigate to Login Activity
                                val intent = Intent(this, Login::class.java)
                                startActivity(intent)
                                finish()
                            }
                            .addOnFailureListener { e ->
                                Toast.makeText(
                                    this,
                                    "Failed to save user data: ${e.message}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                    } else {
                        // Handle specific Firebase Auth error: email already in use
                        if (task.exception is FirebaseAuthUserCollisionException) {
                            Toast.makeText(
                                this,
                                "Registration Failed: Email is already in use",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            val errorMessage = task.exception?.message ?: "Registration failed"
                            Toast.makeText(
                                this,
                                "Registration Failed: $errorMessage",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
        }

        // Social Media Sign-Up Buttons
        findViewById<Button>(R.id.btnGoogle).setOnClickListener {
            Toast.makeText(this, "Google Sign-Up clicked", Toast.LENGTH_SHORT).show()
            // TODO: Integrate Google sign-in
        }

        findViewById<Button>(R.id.btnFacebook).setOnClickListener {
            Toast.makeText(this, "Facebook Sign-Up clicked", Toast.LENGTH_SHORT).show()
            // TODO: Integrate Facebook sign-in
        }

        findViewById<Button>(R.id.btnApple).setOnClickListener {
            Toast.makeText(this, "Apple Sign-Up clicked", Toast.LENGTH_SHORT).show()
            // TODO: Integrate Apple sign-in
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
            videoView.start() // Restart video
        }
    }

    private fun saveUserToFirestore(
        userId: String?,
        firstName: String,
        lastName: String,
        email: String,
        gender: String
    ) {
        if (userId == null) return

        val user = hashMapOf(
            "firstName" to firstName,
            "lastName" to lastName,
            "email" to email,
            "gender" to gender
        )

        db.collection("users").document(userId).set(user)
            .addOnSuccessListener {
                Toast.makeText(this, "Registration Successful!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, RegistrationSuccess::class.java))
                finish()
            }
            .addOnFailureListener { e ->
                Log.e("Firebase", "Error saving user", e)
                Toast.makeText(this, "Failed to save user data", Toast.LENGTH_SHORT).show()
            }
    }


}
