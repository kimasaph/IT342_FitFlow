package edu.cit.fitflow.registration

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import edu.cit.fitflow.FitFlowDashboard
import edu.cit.fitflow.R
import edu.cit.fitflow.registration.RegistrationSuccess
import edu.cit.fitflow.services.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegistrationForm2 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_registration_form2)

        val backButton = findViewById<ImageView>(R.id.imgLeft2)
        backButton.setOnClickListener {
            startActivity(Intent(this, RegistrationSuccess::class.java))
        }

        // Retrieve values passed from RegistrationSuccess
        val email = intent.getStringExtra("email") ?: ""
        val phone = intent.getStringExtra("phone") ?: ""

        // Form fields
        val ageInput = findViewById<EditText>(R.id.editTextAge)
        val heightInput = findViewById<EditText>(R.id.editTextHeight)
        val weightInput = findViewById<EditText>(R.id.editTextWeight)
        val genderMale = findViewById<RadioButton>(R.id.radioButton)
        val genderFemale = findViewById<RadioButton>(R.id.radioButton2)
        val genderOther = findViewById<RadioButton>(R.id.radioButton3)
        val spinner = findViewById<Spinner>(R.id.spinnerBodyGoal)
        val btnSubmit = findViewById<Button>(R.id.btnSignUp1)

        // Spinner setup
        val goals = arrayOf(
            "Lose Weight", "Build Muscle", "Maintain Weight",
            "Increase Endurance", "Improve Flexibility", "Overall Fitness"
        )
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, goals)
        spinner.adapter = adapter

        // Submit button logic
        btnSubmit.setOnClickListener {
            val age = ageInput.text.toString().toIntOrNull() ?: 0
            val height = heightInput.text.toString().toFloatOrNull() ?: 0f
            val weight = weightInput.text.toString().toFloatOrNull() ?: 0f
            val firstNameInput = findViewById<EditText>(R.id.editTextFirstName)
            val lastNameInput = findViewById<EditText>(R.id.editTextLastName)
            val gender = when {
                genderMale.isChecked -> "Male"
                genderFemale.isChecked -> "Female"
                genderOther.isChecked -> "Others"
                else -> "Not Specified"
            }

            val bodyGoal = spinner.selectedItem?.toString() ?: "Not Specified"

            val profileData = mapOf(
                "email" to email,
                "phoneNumber" to phone,
                "firstName" to firstNameInput.text.toString().trim(),
                "lastName" to lastNameInput.text.toString().trim(),
                "gender" to gender,
                "height" to height.toString(),
                "weight" to weight.toString(),
                "age" to age.toString(),
                "bodyGoal" to bodyGoal
            )

            RetrofitClient.instance.setupUserProfile(profileData).enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegistrationForm2, "Profile updated!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@RegistrationForm2, FitFlowDashboard::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@RegistrationForm2, "Failed: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(this@RegistrationForm2, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }

        // Video background setup
        val videoView = findViewById<VideoView>(R.id.vidRegistrationForm)
        val uri = Uri.parse("android.resource://$packageName/${R.raw.registration_form}")
        videoView.setVideoURI(uri)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        videoView.start()
        videoView.setOnCompletionListener { videoView.start() }
    }
}
