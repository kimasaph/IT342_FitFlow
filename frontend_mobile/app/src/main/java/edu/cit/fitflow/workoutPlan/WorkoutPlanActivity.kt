package edu.cit.fitflow.workoutPlan

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.ImageView
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import edu.cit.fitflow.R
import edu.cit.fitflow.FitFlowDashboard
import edu.cit.fitflow.progress.ProgressActivity
import edu.cit.fitflow.services.RetrofitClient
import edu.cit.fitflow.settings.FitFlowSettings
import edu.cit.fitflow.workoutPlan.cardioWorkout.CardioWorkoutActivity
import edu.cit.fitflow.workoutPlan.yogaWorkout.YogaWorkoutActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.google.gson.Gson

class WorkoutPlanActivity : AppCompatActivity() {
    private var bodyTypeRadioGroup: RadioGroup? = null
    private var fitnessGoalRadioGroup: RadioGroup? = null
    private var fitnessLevelRadioGroup: RadioGroup? = null
    private var workoutStyleRadioGroup: RadioGroup? = null
    private var healthConcernsInput: TextInputEditText? = null
    private var submitButton: MaterialButton? = null
    private lateinit var bottomNavigationView: BottomNavigationView
    private lateinit var prefs: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_workout_plan)

        bodyTypeRadioGroup = findViewById(R.id.body_type_radio_group)
        fitnessGoalRadioGroup = findViewById(R.id.fitness_goal_radio_group)
        fitnessLevelRadioGroup = findViewById(R.id.fitness_level_radio_group)
        workoutStyleRadioGroup = findViewById(R.id.workout_style_radio_group)
        healthConcernsInput = findViewById(R.id.health_concerns_input)
        submitButton = findViewById(R.id.submit_button)

        prefs = getSharedPreferences("prefs", MODE_PRIVATE)

        val backButton = findViewById<ImageView>(R.id.back_button)
        backButton.setOnClickListener { finish() }

        submitButton!!.setOnClickListener { submitWorkoutPlan() }

        setupBottomNavigation()
    }

    private fun setupBottomNavigation() {
        bottomNavigationView = findViewById(R.id.bottom_navigation)
        bottomNavigationView.selectedItemId = R.id.nav_workouts

        bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, FitFlowDashboard::class.java))
                    finish()
                    true
                }
                R.id.nav_workouts -> true
                R.id.nav_progress -> {
                    startActivity(Intent(this, ProgressActivity::class.java))
                    finish()
                    true
                }
                R.id.nav_profile -> {
                    startActivity(Intent(this, FitFlowSettings::class.java))
                    finish()
                    true
                }
                else -> false
            }
        }
    }

    private fun submitWorkoutPlan() {
        val userId = prefs.getInt("userId", -1)

        if (bodyTypeRadioGroup?.checkedRadioButtonId == -1 ||
            fitnessGoalRadioGroup?.checkedRadioButtonId == -1 ||
            fitnessLevelRadioGroup?.checkedRadioButtonId == -1 ||
            workoutStyleRadioGroup?.checkedRadioButtonId == -1) {
            Toast.makeText(this, "Please select all options", Toast.LENGTH_SHORT).show()
            return
        }

        val bodyType = findViewById<RadioButton>(bodyTypeRadioGroup!!.checkedRadioButtonId).text.toString()
        val fitnessGoal = findViewById<RadioButton>(fitnessGoalRadioGroup!!.checkedRadioButtonId).text.toString()
        val fitnessLevel = findViewById<RadioButton>(fitnessLevelRadioGroup!!.checkedRadioButtonId).text.toString()
        val workoutStyle = findViewById<RadioButton>(workoutStyleRadioGroup!!.checkedRadioButtonId).text.toString()
        val healthConcerns = healthConcernsInput?.text?.toString() ?: ""

        val request = WorkoutRequest(
            userId = userId,
            bodyType = bodyType,
            fitnessGoal = fitnessGoal,
            fitnessLevel = fitnessLevel,
            workoutStyle = workoutStyle,
            healthConcerns = healthConcerns
        )

        submitButton!!.isEnabled = false
        submitButton!!.text = "Processing..."

        RetrofitClient.instance.createWorkout(userId, request).enqueue(object : Callback<WorkoutRequest> {
            override fun onResponse(call: Call<WorkoutRequest>, response: Response<WorkoutRequest>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@WorkoutPlanActivity, "Workout plan saved!", Toast.LENGTH_SHORT).show()

                    // 🛠 Save locally per user after success
                    saveWorkoutPlanLocally(userId, request)

                    navigateToWorkoutType(workoutStyle, fitnessLevel)
                } else {
                    Toast.makeText(this@WorkoutPlanActivity, "Server error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    resetButton()
                }
            }

            override fun onFailure(call: Call<WorkoutRequest>, t: Throwable) {
                Toast.makeText(this@WorkoutPlanActivity, "Failed: ${t.message}", Toast.LENGTH_SHORT).show()
                resetButton()
            }
        })
    }

    private fun saveWorkoutPlanLocally(userId: Int, request: WorkoutRequest) {
        val gson = Gson()
        val workoutPrefs = getSharedPreferences("workout_prefs", MODE_PRIVATE)
        val workoutKey = "workout_plan_$userId"

        val json = gson.toJson(request)
        workoutPrefs.edit().putString(workoutKey, json).apply()
    }

    private fun navigateToWorkoutType(workoutStyle: String, fitnessLevel: String) {
        when {
            workoutStyle.equals("Strength Training", ignoreCase = true) -> {
                startActivity(Intent(this, StrengthTraining::class.java))
            }
            workoutStyle.equals("Cardio", ignoreCase = true) -> {
                val intent = Intent(this, CardioWorkoutActivity::class.java)
                val intensity = when {
                    fitnessLevel.equals("Beginner", ignoreCase = true) -> "low"
                    fitnessLevel.equals("Intermediate", ignoreCase = true) -> "medium"
                    fitnessLevel.equals("Advanced", ignoreCase = true) -> "high"
                    else -> "medium"
                }
                intent.putExtra("INTENSITY", intensity)
                startActivity(intent)
            }
            workoutStyle.equals("Flexibility/Yoga", ignoreCase = true) -> {
                val intent = Intent(this, YogaWorkoutActivity::class.java)
                val difficulty = when {
                    fitnessLevel.equals("Beginner", ignoreCase = true) -> "beginner"
                    fitnessLevel.equals("Intermediate", ignoreCase = true) -> "intermediate"
                    fitnessLevel.equals("Advanced", ignoreCase = true) -> "advanced"
                    else -> "beginner"
                }
                intent.putExtra("DIFFICULTY", difficulty)
                startActivity(intent)
            }
            else -> {
                Toast.makeText(this, "$workoutStyle workouts coming soon!", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun resetButton() {
        submitButton?.isEnabled = true
        submitButton?.text = "Create My Workout Plan"
    }
}
