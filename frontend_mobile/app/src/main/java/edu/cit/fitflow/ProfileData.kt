package edu.cit.fitflow

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileData : AppCompatActivity() {

    private lateinit var apiService: ApiService
    private var userId: Int = -1 // Assuming you store the userId when the user logs in

    @SuppressLint("WrongViewCast")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_profile_data)

        // Retrieve userId (e.g., from SharedPreferences or intent)
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        userId = sharedPreferences.getInt("userId", -1)
        //val token = "Bearer ${sharedPreferences.getString("auth_token", "")}"
        val token = sharedPreferences.getString("auth_token", "") ?: ""


        apiService = RetrofitClient.instance

        if (userId == -1 || token.isBlank()) {
            Toast.makeText(this, "Please log in again", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, Login::class.java))
            finish()
            return
        }

        fetchUserProfile(userId, token)


        // Back to Settings button
        val backToSettings = findViewById<ImageView>(R.id.backtoSettings2)
        backToSettings.setOnClickListener {
            val intent = Intent(this, Settings::class.java)
            startActivity(intent)
        }

        // Save Button to update profile
        val saveButton = findViewById<TextView>(R.id.profile_data_save_button)
        saveButton.setOnClickListener {
            // Collect updated data and send it to the server to update the profile
            val updatedFirstName = findViewById<EditText>(R.id.first_name_input).text.toString()
            val updatedLastName = findViewById<EditText>(R.id.last_name_input).text.toString()
            val updatedAge = findViewById<EditText>(R.id.age_input).text.toString().toIntOrNull() ?: 0
            val updatedGender = findViewById<EditText>(R.id.gender_dropdown).text.toString()
            val updatedWeight = findViewById<EditText>(R.id.weight_input).text.toString().toFloatOrNull() ?: 0f
            val updatedHeight = findViewById<EditText>(R.id.height_input).text.toString().toFloatOrNull() ?: 0f
            val updatedBodyGoal = findViewById<EditText>(R.id.body_goal_dropdown).text.toString()

            // Create an updated User object to send to the backend
            val updatedUser = User(
                userId = userId,
                username = "", // You can fetch this from SharedPreferences or the current user's session
                email = "", // You can fetch this from SharedPreferences or the current user's session
                phoneNumber = "", // Similarly fetch this from SharedPreferences or the current user's session
                password = "", // Leave empty if you don't want to update the password
                firstName = updatedFirstName,
                lastName = updatedLastName,
                gender = updatedGender,
                height = updatedHeight,
                weight = updatedWeight,
                age = updatedAge,
                bodyGoal = updatedBodyGoal
            )

            // Send the updated data to the backend
            updateUserProfile(updatedUser)
        }
    }

    private fun fetchUserProfile(userId: Int, token: String) {


        // Call API to get user profile data
        apiService.getUserProfile(userId, token).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    val user = response.body()
                    user?.let {
                        // Update UI with user data
                        findViewById<EditText>(R.id.first_name_input).setText(it.firstName)
                        findViewById<EditText>(R.id.last_name_input).setText(it.lastName)
                        findViewById<EditText>(R.id.age_input).setText(it.age.toString())
                        findViewById<EditText>(R.id.gender_dropdown).setText(it.gender)
                        findViewById<EditText>(R.id.phone_input).setText(it.phoneNumber)
                        findViewById<EditText>(R.id.weight_input).setText(it.weight.toString())
                        findViewById<EditText>(R.id.height_input).setText(it.height.toString())
                        findViewById<EditText>(R.id.body_goal_dropdown).setText(it.bodyGoal)
                    }
                } else {
                    Log.e("ProfileData", "Error: ${response.message()}")
                    Toast.makeText(this@ProfileData, "Failed to fetch user data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Log.e("ProfileData", "Error: ${t.message}")
                Toast.makeText(this@ProfileData, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }


    private fun updateUserProfile(updatedUser: User) {
        val token = "Bearer ${getSharedPreferences("prefs", MODE_PRIVATE).getString("auth_token", "")}"

        // Send the updated user data to the backend for update
        apiService.updateUserProfile(userId, updatedUser, token).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@ProfileData, "Profile updated successfully!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@ProfileData, "Failed to update profile", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(this@ProfileData, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

}
