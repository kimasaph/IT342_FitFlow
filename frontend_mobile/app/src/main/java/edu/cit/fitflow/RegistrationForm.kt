package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegistrationForm : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_form)

        // Back Button
        val backButton = findViewById<ImageView>(R.id.imgLeft2)
        backButton.setOnClickListener {
            startActivity(Intent(this, Registration::class.java))
        }

        // Navigate to Login
        val toLogin = findViewById<TextView>(R.id.btnSignIn)
        toLogin.setOnClickListener {
            startActivity(Intent(this, Login::class.java))
        }

        // Input Fields
        val email = findViewById<EditText>(R.id.editTextFirstName)
        val phone = findViewById<EditText>(R.id.editTextLastName)
        val password = findViewById<EditText>(R.id.editTextPassword)
        val confirmPassword = findViewById<EditText>(R.id.editTextConfirmPassword)

        // Placeholder fields for first and last name if they will be used later
        val firstName = EditText(this)
        val lastName = EditText(this)

        // Sign Up Button
        val signUpButton = findViewById<Button>(R.id.btnSignUp1)
        signUpButton.setOnClickListener {
            val emailText = email.text.toString().trim()
            val phoneText = phone.text.toString().trim()
            val passText = password.text.toString().trim()
            val confirmPassText = confirmPassword.text.toString().trim()

            if (emailText.isEmpty() || phoneText.isEmpty() || passText.isEmpty() || confirmPassText.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (passText != confirmPassText) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val user = User(
                userId = 0, //Change this if error
                username = emailText,
                email = emailText,
                phoneNumber = phoneText,
                password = passText,
                firstName = "N/A",
                lastName = "N/A",
                gender = "Not Specified",
                height = 0.0f,
                weight = 0.0f,
                age = 0,
                bodyGoal = ""
            )


            RetrofitClient.instance.registerUser(user).enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        // ✅ STEP 1: Send verification code
                        RetrofitClient.instance.sendVerificationCode(SendCodeRequest(emailText))
                            .enqueue(object : Callback<VerificationResponse> {
                                override fun onResponse(call: Call<VerificationResponse>, response: Response<VerificationResponse>) {
                                    if (response.isSuccessful && response.body()?.status == "success") {
                                        Toast.makeText(this@RegistrationForm, "Verification code sent", Toast.LENGTH_SHORT).show()

                                        // ✅ STEP 2: Move to confirmation screen
                                        val intent = Intent(this@RegistrationForm, RegistrationConfirmationCode::class.java)
                                        intent.putExtra("email", emailText)
                                        startActivity(intent)
                                        finish()
                                    } else {
                                        Toast.makeText(this@RegistrationForm, "Failed to send verification code", Toast.LENGTH_SHORT).show()
                                    }
                                }

                                override fun onFailure(call: Call<VerificationResponse>, t: Throwable) {
                                    Toast.makeText(this@RegistrationForm, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                                }
                            })

                    } else {
                        Toast.makeText(this@RegistrationForm, "Registration Failed: ${response.errorBody()?.string()}", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(this@RegistrationForm, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
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
}