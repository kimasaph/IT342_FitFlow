package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class Registration : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration)


        val img1 = findViewById<ImageView>(R.id.imgLeft)

        img1.setOnClickListener{
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        val btn1 = findViewById<Button>(R.id.btnContinue)

        btn1.setOnClickListener{
            val intent = Intent(this, RegistrationConfirmationCode::class.java)
            startActivity(intent)
        }
    }
}
