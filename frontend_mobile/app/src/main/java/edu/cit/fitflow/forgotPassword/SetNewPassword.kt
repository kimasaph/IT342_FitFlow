package edu.cit.fitflow.forgotPassword

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.R

class SetNewPassword : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_set_new_password)

        val val1 = findViewById<ImageView>(R.id.imgBackSetNewPassword)
        val1.setOnClickListener{
            val intent = Intent(this, ForgotPasswordConfirmationCode::class.java)
            startActivity(intent)
        }

        val val2 = findViewById<Button>(R.id.btnConfirmSetNewPasssword)
        val2.setOnClickListener{
            val intent = Intent(this, PasswordChangeSuccessful::class.java)
            startActivity(intent)
        }
    }
}