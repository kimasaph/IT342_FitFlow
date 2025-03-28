package edu.cit.fitflow

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class RegistrationSuccess : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_success_prompt)



        val val2 = findViewById<Button>(R.id.btnContinueRegistrationSuccess)
        val2.setOnClickListener{
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }



    }
}