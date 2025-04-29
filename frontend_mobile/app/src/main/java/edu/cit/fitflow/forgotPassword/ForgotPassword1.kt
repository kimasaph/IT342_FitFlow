package edu.cit.fitflow.forgotPassword

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.R
import edu.cit.fitflow.login.Login

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