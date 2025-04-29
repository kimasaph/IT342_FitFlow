package edu.cit.fitflow.registration

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.MediaController
import android.widget.Toast
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import java.util.concurrent.TimeUnit
import com.google.firebase.FirebaseException
import edu.cit.fitflow.MainActivity
import edu.cit.fitflow.R

class Registration : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var verificationId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration)

        // Initialize Firebase
        FirebaseApp.initializeApp(this)
        auth = FirebaseAuth.getInstance()

        val img1 = findViewById<ImageView>(R.id.imgLeft)
        img1.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }

        val btn1 = findViewById<Button>(R.id.btnContinue)
        val editTextPhone = findViewById<EditText>(R.id.editTextPhone)

        btn1.setOnClickListener {
            val phoneNumber = editTextPhone.text.toString().trim()
            if (phoneNumber.isNotEmpty()) {
                val formattedPhoneNumber = formatPhoneNumber(phoneNumber)
                if (formattedPhoneNumber != null) {
                    sendVerificationCode(formattedPhoneNumber)
                } else {
                    Toast.makeText(this, "Enter a valid phone number", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this, "Enter a phone number", Toast.LENGTH_SHORT).show()
            }
        }

        val videoView = findViewById<VideoView>(R.id.vidPhoneNumber)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.started}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)
        videoView.start()
        videoView.setOnCompletionListener { videoView.start() }
    }

    // Format the phone number to include the +63 country code if it's in local format (starts with 09)
    private fun formatPhoneNumber(input: String): String? {
        // Check if the number starts with "09" (local format for the Philippines)
        return when {
            input.startsWith("09") && input.length == 11 -> {
                // Format it to +63XXXXXXXXX
                "+63${input.substring(1)}"
            }
            input.startsWith("+63") && input.length == 12 -> {
                // Already in the correct format (+63XXXXXXXXX)
                input
            }
            else -> {
                // Invalid format for Philippine phone numbers
                null
            }
        }
    }

    private fun sendVerificationCode(phoneNumber: String) {
        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(this)
            .setCallbacks(object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                    signInWithPhoneAuthCredential(credential)
                }

                override fun onVerificationFailed(e: FirebaseException) {
                    // Handle errors gracefully
                    Toast.makeText(this@Registration, "Verification Failed: ${e.message}", Toast.LENGTH_LONG).show()
                }

                override fun onCodeSent(id: String, token: PhoneAuthProvider.ForceResendingToken) {
                    verificationId = id
                    val intent = Intent(this@Registration, RegistrationConfirmationCode::class.java)
                    intent.putExtra("verificationId", verificationId)
                    intent.putExtra("phoneNumber", phoneNumber)
                    startActivity(intent)
                }
            })
            .build()
        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    private fun signInWithPhoneAuthCredential(credential: PhoneAuthCredential) {
        auth.signInWithCredential(credential).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                Toast.makeText(this, "Verification successful!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, "Verification failed!", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
