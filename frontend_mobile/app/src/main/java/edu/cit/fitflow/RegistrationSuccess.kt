package edu.cit.fitflow

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class RegistrationSuccess : AppCompatActivity() {

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_success_prompt)

        // Retrieve data from RegistrationConfirmationCode
        val email = intent.getStringExtra("email") ?: ""
        val phone = intent.getStringExtra("phone") ?: ""
        val password = intent.getStringExtra("password") ?: ""


        // Complete Profile button
        findViewById<Button>(R.id.btnCompleteYourProfile).setOnClickListener {
            val intent = Intent(this, RegistrationForm2::class.java).apply {
                putExtra("email", email)
                putExtra("phone", phone)
                putExtra("password", password)

            }
            startActivity(intent)
        }

        // Proceed to Dashboard button
        findViewById<Button>(R.id.btnProceedToDashboard).setOnClickListener {
            startActivity(Intent(this, FitFlowDashboard::class.java))
        }
    }
}
