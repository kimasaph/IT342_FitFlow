package edu.cit.fitflow.forgotPassword

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.R
import edu.cit.fitflow.login.Login

class PasswordChangeSuccessful : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_password_change_successful)




        val val1 = findViewById<Button>(R.id.btnPasswordChangeSuccessful)
        val1.setOnClickListener{
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }
    }
}