package edu.cit.fitflow

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
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthProvider

class RegistrationConfirmationCode : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var verificationId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_confirmation_code)

        auth = FirebaseAuth.getInstance()
        verificationId = intent.getStringExtra("verificationId") ?: ""

        val otpInput = findViewById<EditText>(R.id.editTextOtp4)
        val btnConfirm = findViewById<Button>(R.id.btnContinue)
        val v1 = findViewById<ImageView>(R.id.imgLeft)

        btnConfirm.setOnClickListener {
            val otpCode = otpInput.text.toString()
            if (otpCode.isNotEmpty()) {
                verifyCode(otpCode)
            } else {
                Toast.makeText(this, "Enter OTP", Toast.LENGTH_SHORT).show()
            }
        }

        v1.setOnClickListener {
            val intent = Intent(this, Registration::class.java)
            startActivity(intent)
        }

        val videoView = findViewById<VideoView>(R.id.vidConfirmCode)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.confirm_code}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)
        videoView.start()
        videoView.setOnCompletionListener { videoView.start() }
    }

    private fun verifyCode(code: String) {
        val credential = PhoneAuthProvider.getCredential(verificationId, code)
        signInWithCredential(credential)
    }

    private fun signInWithCredential(credential: PhoneAuthCredential) {
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val intent = Intent(this, RegistrationForm::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(this, "Invalid OTP", Toast.LENGTH_SHORT).show()
                }
            }
    }
}
