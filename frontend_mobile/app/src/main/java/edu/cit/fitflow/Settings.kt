package edu.cit.fitflow

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout

class Settings : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_settings)

        val toProfileData = findViewById<ConstraintLayout>(R.id.toProfileData)
        val toMyGoals = findViewById<ConstraintLayout>(R.id.toMyGoals)
        val arrowRightProfile = findViewById<ImageView>(R.id.arrowRightProfile)
        val arrowRightGoals = findViewById<ImageView>(R.id.arrowRightGoals)

        val toDashboard = findViewById<ImageView>(R.id.backtoSettings2)
        toDashboard.setOnClickListener {
            val intent = Intent(this, FitFlowDashboard::class.java)
            startActivity(intent)
        }

        //To Profile Data Page
        toProfileData.setOnClickListener {
            val intent = Intent(this, ProfileData::class.java)
            startActivity(intent)
        }
        arrowRightProfile.setOnClickListener {
            val intent = Intent(this, ProfileData::class.java)
            startActivity(intent)
        }

        //To My Goals Page
        toMyGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)
        }
        arrowRightGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)

        }

    }
}