package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class RegistrationForm : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_form)


        val v1 = findViewById<ImageView>(R.id.imgLeft2)

        v1.setOnClickListener{
            val intent = Intent(this, Registration::class.java)
            startActivity(intent)
        }

        val v2 = findViewById<Button>(R.id.btnSignUp1)
        v2.setOnClickListener{
            val intent = Intent(this, RegistrationSuccess::class.java)
            startActivity(intent)
        }
    }
}
