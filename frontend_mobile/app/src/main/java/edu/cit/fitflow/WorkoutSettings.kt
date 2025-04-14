package edu.cit.fitflow

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class WorkoutSettings : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_workout_settings)


        val backToGoals = findViewById<ImageView>(R.id.backtoSettings2)

        backToGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)
        }

    }
}