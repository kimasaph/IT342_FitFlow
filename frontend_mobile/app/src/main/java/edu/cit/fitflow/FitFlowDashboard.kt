package edu.cit.fitflow

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class FitFlowDashboard : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_fit_flow_dashboard)

        // To Goal Plan
        val toGoalPlan = findViewById<ImageView>(R.id.arrow_right2)
        toGoalPlan.setOnClickListener {
            val intent = Intent(this, GoalsActivity::class.java)
            startActivity(intent)
        }

        // To Meal Plan
        val toMealPlan = findViewById<ImageView>(R.id.arrow_right3)
        toMealPlan.setOnClickListener {
            val intent = Intent(this, MealPlanActivity::class.java)
            startActivity(intent)
        }

        val addWorkout = findViewById<Button>(R.id.btnAddWorkout)
        addWorkout.setOnClickListener {
            val intent = Intent(this, WorkoutPlanActivity::class.java)
            startActivity(intent)
        }

        // To Settings
        val toSettings = findViewById<ImageView>(R.id.img_settings)
        toSettings.setOnClickListener {
            val intent = Intent(this, Settings::class.java)
            startActivity(intent)
        }

        val currentDateText: TextView = findViewById(R.id.current_date)
        val currentTimeText: TextView = findViewById(R.id.current_time)

        // Set current date
        val dateFormat = SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault())
        val currentDate = dateFormat.format(Date())
        currentDateText.text = currentDate

        // Set current time
        val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
        var currentTime = timeFormat.format(Date())
        currentTimeText.text = currentTime

        // Update time every minute
        val handler = Handler(Looper.getMainLooper())
        val updateTimeRunnable = object : Runnable {
            override fun run() {
                val updatedTime = timeFormat.format(Date())
                currentTimeText.text = updatedTime
                handler.postDelayed(this, 60000)
            }
        }
        handler.postDelayed(updateTimeRunnable, 60000)

        // Fetch and display meal count
        fetchMealCount()
    }

    private fun fetchMealCount() {
        val apiService = RetrofitClient.instance
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("userId", 0)
        val token = "Bearer ${sharedPreferences.getString("auth_token", "")}".trim()

        if (token.isNotEmpty()) {
            apiService.getMealsByUserId(userId, token).enqueue(object : Callback<List<UserMealEntity>> {
                override fun onResponse(call: Call<List<UserMealEntity>>, response: Response<List<UserMealEntity>>) {
                    if (response.isSuccessful) {
                        val meals = response.body() ?: emptyList()
                        val mealCountText = findViewById<TextView>(R.id.meal_count_text)
                        mealCountText.text = "${meals.size} meals added"
                    } else {
                        Log.e("Dashboard", "Failed to get meals: ${response.code()}")
                    }
                }

                override fun onFailure(call: Call<List<UserMealEntity>>, t: Throwable) {
                    Log.e("Dashboard", "Error: ${t.message}")
                }
            })
        }
    }
}
