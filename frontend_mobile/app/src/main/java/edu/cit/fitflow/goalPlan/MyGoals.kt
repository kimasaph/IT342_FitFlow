package edu.cit.fitflow.goalPlan

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.R
import edu.cit.fitflow.settings.BodyGoalSettings
import edu.cit.fitflow.settings.NutritionSettings
import edu.cit.fitflow.settings.FitFlowSettings
import edu.cit.fitflow.settings.WorkoutSettings

class MyGoals : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_my_goals)

        val backToSettings = findViewById<ImageView>(R.id.backToSettings)

        val toWorkoutSettings = findViewById<TextView>(R.id.txtToWorkout)
        val toNutritionSettings = findViewById<TextView>(R.id.txtToNutrition)
        val toBodyGoalSettings = findViewById<TextView>(R.id.txtToBodyGoal)

        val arrowRightWorkout = findViewById<ImageView>(R.id.arrowRightWorkout)
        val arrowRightNutrition = findViewById<ImageView>(R.id.arrowRightNutrition)
        val arrowRightBodyGoal = findViewById<ImageView>(R.id.arrowRightBodyGoal)


        //Back to Settings
        backToSettings.setOnClickListener {
            val intent = Intent(this, FitFlowSettings::class.java)
            startActivity(intent)
        }

        //To Workout Settings
        toWorkoutSettings.setOnClickListener {

            val intent = Intent(this, WorkoutSettings::class.java)
            startActivity(intent)
        }
        arrowRightWorkout.setOnClickListener {

            val intent = Intent(this, WorkoutSettings::class.java)
            startActivity(intent)
        }

        //To Nutrition Settings
        toNutritionSettings.setOnClickListener {

            val intent = Intent(this, NutritionSettings::class.java)
            startActivity(intent)
        }
        arrowRightNutrition.setOnClickListener {

            val intent = Intent(this, NutritionSettings::class.java)
            startActivity(intent)
        }

        //To Body Goal Settings
        toBodyGoalSettings.setOnClickListener {

            val intent = Intent(this, BodyGoalSettings::class.java)
            startActivity(intent)
        }
        arrowRightBodyGoal.setOnClickListener {

            val intent = Intent(this, BodyGoalSettings::class.java)
            startActivity(intent)
        }
    }
}