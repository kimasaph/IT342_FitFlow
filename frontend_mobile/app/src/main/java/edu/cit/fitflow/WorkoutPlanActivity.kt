package edu.cit.fitflow


import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class WorkoutPlanActivity : AppCompatActivity() {
    private var bodyTypeRadioGroup: RadioGroup? = null
    private var fitnessGoalRadioGroup: RadioGroup? = null
    private var fitnessLevelRadioGroup: RadioGroup? = null
    private var workoutStyleRadioGroup: RadioGroup? = null
    private var healthConcernsInput: TextInputEditText? = null
    private var submitButton: MaterialButton? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_workout_plan)

        // Initialize views
        bodyTypeRadioGroup = findViewById(R.id.body_type_radio_group)
        fitnessGoalRadioGroup = findViewById(R.id.fitness_goal_radio_group)
        fitnessLevelRadioGroup = findViewById(R.id.fitness_level_radio_group)
        workoutStyleRadioGroup = findViewById(R.id.workout_style_radio_group)
        healthConcernsInput = findViewById(R.id.health_concerns_input)
        submitButton = findViewById(R.id.submit_button)

        // Set default selections
//        (bodyTypeRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
//        (fitnessGoalRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
//        (fitnessLevelRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
//        (workoutStyleRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true

        // Set up back button
        val backButton = findViewById<ImageView>(R.id.back_button)
        backButton.setOnClickListener { finish() }

        // Set up submit button
        submitButton!!.setOnClickListener { submitWorkoutPlan() }
    }

    private fun submitWorkoutPlan() {
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("userId", -1)

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

                    // Navigate based on selected style
                    if (workoutStyle.equals("Strength Training", ignoreCase = true)) {
                        val intent = Intent(this@WorkoutPlanActivity, StrengthTraining::class.java)
                        startActivity(intent)
                    } else {
                        finish() // or navigate to another screen
                    }
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

    private fun resetButton() {
        submitButton?.isEnabled = true
        submitButton?.text = "Create My Workout Plan"
    }
}
