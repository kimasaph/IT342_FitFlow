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

class Login : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Video Background
        val videoView = findViewById<VideoView>(R.id.vidGetStarted1)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.get_started}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        videoView.start()
        videoView.setOnCompletionListener {
            videoView.start()
        }

        // Navigate to Registration
        findViewById<TextView>(R.id.txtSignUp1).setOnClickListener {
            startActivity(Intent(this, RegistrationForm::class.java))
        }

        // Navigate to Forgot Password
        findViewById<TextView>(R.id.txtForgotPassword).setOnClickListener {
            startActivity(Intent(this, ForgotPassword1::class.java))
        }

        // Login Button
        findViewById<Button>(R.id.btnLogin).setOnClickListener {
            val email = findViewById<EditText>(R.id.editTextTextEmailAddress2).text.toString().trim()
            val password = findViewById<EditText>(R.id.editTextTextPassword3).text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter both email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Retrofit Login Call
            val loginRequest = LoginRequest(email, password)

            RetrofitClient.instance.loginUser(loginRequest).enqueue(object : Callback<UserResponse> {
                override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                    if (response.isSuccessful && response.body() != null) {
                        val user = response.body()!!
                        Toast.makeText(this@Login, "Login Successful!", Toast.LENGTH_SHORT).show()

                        val intent = Intent(this@Login, FitFlowDashboard::class.java).apply {
                            putExtra("FIRST_NAME", user.firstName)
                            putExtra("LAST_NAME", user.lastName)
                            putExtra("GENDER", user.gender)
                        }
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@Login, "Login Failed: Invalid credentials", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                    Toast.makeText(this@Login, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
