package edu.cit.fitflow


import android.os.Bundle
import android.widget.ImageView
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import edu.cit.fitflow.R
import edu.cit.fitflow.RetrofitClient
import edu.cit.fitflow.WorkoutRequest
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
        (bodyTypeRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
        (fitnessGoalRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
        (fitnessLevelRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true
        (workoutStyleRadioGroup!!.getChildAt(0) as RadioButton).isChecked = true

        // Set up back button
        val backButton = findViewById<ImageView>(R.id.back_button)
        backButton.setOnClickListener { finish() }

        // Set up submit button
        submitButton!!.setOnClickListener { submitWorkoutPlan() }
    }

    private fun submitWorkoutPlan() {
        val userId = 1L // Replace with real logged-in user ID from session/localStorage

        val bodyType = findViewById<RadioButton>(bodyTypeRadioGroup!!.checkedRadioButtonId).text.toString()
        val fitnessGoal = findViewById<RadioButton>(fitnessGoalRadioGroup!!.checkedRadioButtonId).text.toString()
        val fitnessLevel = findViewById<RadioButton>(fitnessLevelRadioGroup!!.checkedRadioButtonId).text.toString()
        val workoutStyle = findViewById<RadioButton>(workoutStyleRadioGroup!!.checkedRadioButtonId).text.toString()

        val request = WorkoutRequest(
            userId = userId,
            bodyType = bodyType,
            fitnessGoal = fitnessGoal,
            currentFitnessLevel = fitnessLevel,
            preferredWorkoutStyle = workoutStyle
        )

        submitButton!!.isEnabled = false
        submitButton!!.text = "Processing..."

        RetrofitClient.instance.createWorkout(request).enqueue(object : Callback<WorkoutRequest> {
            override fun onResponse(call: Call<WorkoutRequest>, response: Response<WorkoutRequest>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@WorkoutPlanActivity, "Workout plan saved!", Toast.LENGTH_SHORT).show()
                    finish()
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
