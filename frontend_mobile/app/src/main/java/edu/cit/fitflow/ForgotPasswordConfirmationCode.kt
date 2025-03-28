package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ForgotPasswordConfirmationCode : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_forgot_password_confirmation_code)

        val val1 = findViewById<ImageView>(R.id.imgBackForgotPasswordConfirmationCode)
        val1.setOnClickListener{
            val intent = Intent(this, ForgotPassword1::class.java)
            startActivity(intent)
        }


        val val2 = findViewById<Button>(R.id.btnContinueConfirmationCode)
        val2.setOnClickListener{
            val intent = Intent(this, SetNewPassword::class.java)
            startActivity(intent)
        }


    }
}