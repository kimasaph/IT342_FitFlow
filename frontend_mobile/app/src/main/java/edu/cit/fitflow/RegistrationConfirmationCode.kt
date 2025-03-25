package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class RegistrationConfirmationCode : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_confirmation_code)


        val btnConfirm = findViewById<Button>(R.id.btnConfirm)

        btnConfirm.setOnClickListener{
            val intent = Intent(this, RegistrationForm::class.java)
            startActivity(intent)
        }

        val v1 = findViewById<ImageView>(R.id.imgLeft1)

        v1.setOnClickListener{
            val intent = Intent(this,Registration::class.java)
            startActivity(intent)
        }
    }
}
