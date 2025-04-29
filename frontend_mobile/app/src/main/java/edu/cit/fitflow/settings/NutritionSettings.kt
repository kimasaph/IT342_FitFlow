package edu.cit.fitflow.settings

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.goalPlan.MyGoals
import edu.cit.fitflow.R

class NutritionSettings : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_nutrition_settings)

        val backToGoals = findViewById<ImageView>(R.id.backtoSettings2)

        backToGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)
        }


    }
}