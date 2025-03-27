package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ForgotPassword1 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_forgot_password1)


        val val1 = findViewById<Button>(R.id.btnContinueForgotPassword)
        val1.setOnClickListener{
            val intent = Intent(this, ForgotPasswordConfirmationCode::class.java)
            startActivity(intent)
        }

        val val2 = findViewById<ImageView>(R.id.imgBackForgotPassword)
        val2.setOnClickListener{
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }

    }
}