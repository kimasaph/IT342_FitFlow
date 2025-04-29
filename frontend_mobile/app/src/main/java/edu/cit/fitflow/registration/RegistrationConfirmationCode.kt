package edu.cit.fitflow.registration

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.R
import edu.cit.fitflow.registration.RegistrationSuccess
import edu.cit.fitflow.VerificationResponse
import edu.cit.fitflow.VerifyCodeRequest
import edu.cit.fitflow.services.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegistrationConfirmationCode : AppCompatActivity() {

    private lateinit var userEmail: String
    private lateinit var userPhone: String
    private lateinit var userPassword: String
    private lateinit var userFirstName: String
    private lateinit var userLastName: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_confirmation_code)

        // Retrieve all user info passed from RegistrationForm
        userEmail = intent.getStringExtra("email") ?: ""
        userPhone = intent.getStringExtra("phone") ?: ""
        userPassword = intent.getStringExtra("password") ?: ""
        userFirstName = intent.getStringExtra("firstName") ?: ""
        userLastName = intent.getStringExtra("lastName") ?: ""

        val otpInput = findViewById<EditText>(R.id.editTextOtp4)
        val btnConfirm = findViewById<Button>(R.id.btnContinue)
        val backBtn = findViewById<ImageView>(R.id.imgLeft)

        btnConfirm.setOnClickListener {
            val code = otpInput.text.toString().trim()

            if (code.isEmpty()) {
                Toast.makeText(this, "Enter verification code", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            verifyCode(userEmail, code)
        }

        backBtn.setOnClickListener {
            startActivity(Intent(this, Registration::class.java))
        }

        // Background video setup
        val videoView = findViewById<VideoView>(R.id.vidConfirmCode)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.confirm_code}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)
        videoView.start()
        videoView.setOnCompletionListener { videoView.start() }
    }

    private fun verifyCode(email: String, code: String) {
        val request = VerifyCodeRequest(email, code)

        RetrofitClient.instance.verifyCode(request).enqueue(object : Callback<VerificationResponse> {
            override fun onResponse(call: Call<VerificationResponse>, response: Response<VerificationResponse>) {
                if (response.isSuccessful && response.body()?.status == "success") {
                    Toast.makeText(this@RegistrationConfirmationCode, "Email Verified!", Toast.LENGTH_SHORT).show()

                    val intent = Intent(this@RegistrationConfirmationCode, RegistrationSuccess::class.java).apply {
                        putExtra("email", userEmail)
                        putExtra("phone", userPhone)
                        putExtra("password", userPassword)

                    }
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(this@RegistrationConfirmationCode, "Invalid or expired code", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<VerificationResponse>, t: Throwable) {
                Toast.makeText(this@RegistrationConfirmationCode, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
