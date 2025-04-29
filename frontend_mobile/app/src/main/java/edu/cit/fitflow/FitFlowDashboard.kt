package edu.cit.fitflow

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.os.*
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import edu.cit.fitflow.achievementsPlan.GoalsAchievementsActivity
import edu.cit.fitflow.achievementsPlan.repository.AchievementRepository
import edu.cit.fitflow.adapter.DashboardAchievementAdapter
import edu.cit.fitflow.mealPlan.MealPlanActivity
import edu.cit.fitflow.mealPlan.UserMealEntity
import edu.cit.fitflow.notification.ReminderReceiver
import edu.cit.fitflow.progress.ProgressActivity
import edu.cit.fitflow.services.RetrofitClient
import edu.cit.fitflow.settings.FitFlowSettings
import edu.cit.fitflow.workoutPlan.WorkoutActivity
import edu.cit.fitflow.workoutPlan.WorkoutPlanActivity
import edu.cit.fitflow.workoutPlan.ActiveWorkout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*

class FitFlowDashboard : AppCompatActivity() {

    private lateinit var bottomNavigationView: BottomNavigationView
    private lateinit var prefs: SharedPreferences
    private lateinit var workoutPrefs: SharedPreferences
    private var userId: Int = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_fit_flow_dashboard)

        prefs = getSharedPreferences("prefs", MODE_PRIVATE)
        workoutPrefs = getSharedPreferences("workout_prefs", MODE_PRIVATE)
        userId = prefs.getInt("userId", -1)

        setupBottomNavigation()
        setupNavigation()
        setupDateAndTime()

        fetchMealCount()
        fetchWorkoutCount()
        fetchTodayProgress()

        loadCompletedAchievements()
        loadProfilePicture()
        highlightWorkoutSchedule()
        scheduleDailyReminder()
        requestNotificationPermission()
    }

    private fun setupBottomNavigation() {
        bottomNavigationView = findViewById(R.id.bottom_navigation)
        bottomNavigationView.selectedItemId = R.id.nav_home

        bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> true
                R.id.nav_workouts -> {
                    startActivity(Intent(this, WorkoutPlanActivity::class.java))
                    finish()
                    true
                }
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

    private fun setupNavigation() {
        findViewById<ImageView>(R.id.arrow_right2).setOnClickListener {
            startActivity(Intent(this, GoalsAchievementsActivity::class.java))
        }
        findViewById<ImageView>(R.id.arrow_right3).setOnClickListener {
            startActivity(Intent(this, MealPlanActivity::class.java))
        }
        findViewById<Button>(R.id.btnAddWorkout).setOnClickListener {
            startActivity(Intent(this, WorkoutPlanActivity::class.java))
        }
        findViewById<ConstraintLayout>(R.id.card_workout).setOnClickListener {
            startActivity(Intent(this, WorkoutPlanActivity::class.java))
        }
        findViewById<View>(R.id.purple_indicator).setOnClickListener {
            startActivity(Intent(this, WorkoutActivity::class.java))
        }
        findViewById<ImageView>(R.id.img_settings).setOnClickListener {
            startActivity(Intent(this, FitFlowSettings::class.java))
        }
    }

    private fun setupDateAndTime() {
        val currentDateText: TextView = findViewById(R.id.current_date)
        val currentTimeText: TextView = findViewById(R.id.current_time)

        val dateFormat = SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault())
        val currentDate = dateFormat.format(Date())
        currentDateText.text = currentDate

        val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
        var currentTime = timeFormat.format(Date())
        currentTimeText.text = currentTime

        val handler = Handler(Looper.getMainLooper())
        val updateTimeRunnable = object : Runnable {
            override fun run() {
                val updatedTime = timeFormat.format(Date())
                currentTimeText.text = updatedTime
                handler.postDelayed(this, 60000)
            }
        }
        handler.postDelayed(updateTimeRunnable, 60000)
    }

    private fun fetchMealCount() {
        val token = prefs.getString("auth_token", "")?.let { "Bearer $it" } ?: ""

        if (token.isNotEmpty()) {
            RetrofitClient.instance.getMealsByUserId(userId, token).enqueue(object : Callback<List<UserMealEntity>> {
                override fun onResponse(call: Call<List<UserMealEntity>>, response: Response<List<UserMealEntity>>) {
                    if (response.isSuccessful) {
                        val meals = response.body() ?: emptyList()
                        findViewById<TextView>(R.id.meal_count_text).text = "${meals.size} meals added"
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

    private fun fetchWorkoutCount() {
        val workoutHistoryJson = workoutPrefs.getString("workout_history_$userId", null)

        if (workoutHistoryJson != null) {
            try {
                val workoutList: List<ActiveWorkout> = Gson().fromJson(
                    workoutHistoryJson,
                    object : TypeToken<List<ActiveWorkout>>() {}.type
                )
                findViewById<TextView>(R.id.workout_count_text).text = "${workoutList.size} workouts completed"
            } catch (e: Exception) {
                Log.e("Dashboard", "Error parsing workout history: ${e.message}")
            }
        }
    }

    private fun loadCompletedAchievements() {
        val achievementRepository = AchievementRepository(this)
        achievementRepository.getUserAchievementsWithProgress(
            userId = userId,
            onSuccess = { response ->
                val defaultAchievements = achievementRepository.getAllDefaultAchievements()

                val achievements = defaultAchievements.map { defaultAchievement ->
                    val userProgress = response.progress[defaultAchievement.triggerEvent] ?: 0
                    val isUnlocked = response.unlockedAchievements.any { it.achievementId == defaultAchievement.id }
                            || userProgress >= defaultAchievement.targetProgress
                    defaultAchievement.copy(
                        isUnlocked = isUnlocked,
                        currentProgress = userProgress
                    )
                }

                val completedAchievements = achievements.filter { it.isUnlocked && it.getProgressPercentage() >= 100 }
                val rvDashboardAchievements = findViewById<RecyclerView>(R.id.rvAchievementsDashboard)

                if (completedAchievements.isNotEmpty()) {
                    rvDashboardAchievements.visibility = View.VISIBLE
                    rvDashboardAchievements.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
                    rvDashboardAchievements.adapter = DashboardAchievementAdapter(this, completedAchievements)
                } else {
                    rvDashboardAchievements.visibility = View.GONE
                }
            },
            onError = { errorMessage ->
                Log.e("FitFlowDashboard", "Error fetching achievements: $errorMessage")
            }
        )
    }

    private fun loadProfilePicture() {
        val profilePicturePath = prefs.getString("profilePicturePath", null)
        val profileImageView = findViewById<ImageView>(R.id.profile_image)

        if (profilePicturePath.isNullOrEmpty()) {
            Glide.with(this)
                .load(R.drawable.default_profile_picture)
                .circleCrop()
                .into(profileImageView)
        } else {
            Glide.with(this)
                .load("http://10.0.2.2:8080/$profilePicturePath")
                .circleCrop()
                .placeholder(R.drawable.default_profile_picture)
                .into(profileImageView)
        }
    }

    private fun highlightWorkoutSchedule() {
        val today = Calendar.getInstance().get(Calendar.DAY_OF_MONTH)
        val workoutHistoryJson = workoutPrefs.getString("workout_history_$userId", null)

        val scheduledWorkoutDays = mutableListOf<Int>()

        if (workoutHistoryJson != null) {
            try {
                val workoutList: List<ActiveWorkout> = Gson().fromJson(
                    workoutHistoryJson,
                    object : TypeToken<List<ActiveWorkout>>() {}.type
                )
                workoutList.forEach { workout ->
                    val calendar = Calendar.getInstance()
                    calendar.timeInMillis = workout.startTime
                    scheduledWorkoutDays.add(calendar.get(Calendar.DAY_OF_MONTH))
                }
            } catch (e: Exception) {
                Log.e("FitFlowDashboard", "Error parsing workouts: ${e.message}")
            }
        }

        for (day in 1..30) {
            val dayId = resources.getIdentifier("day_$day", "id", packageName)
            val dayTextView = findViewById<TextView>(dayId)

            if (dayTextView != null) {
                when {
                    day == today -> {
                        dayTextView.setBackgroundResource(R.drawable.calendar_day_current)
                        dayTextView.setTextColor(resources.getColor(android.R.color.white))
                    }
                    scheduledWorkoutDays.contains(day) -> {
                        dayTextView.setBackgroundResource(R.drawable.calendar_day_scheduled)
                        dayTextView.setTextColor(resources.getColor(R.color.blue))
                    }
                    else -> {
                        dayTextView.setBackgroundResource(0)
                        dayTextView.setTextColor(resources.getColor(R.color.dark_gray))
                    }
                }
            }
        }
    }

    private fun scheduleDailyReminder() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(this, ReminderReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            add(Calendar.MINUTE, 1)
        }

        alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            calendar.timeInMillis,
            pendingIntent
        )

        Log.d("FitFlowDashboard", "Test reminder scheduled at: ${calendar.time}")
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 1001)
            }
        }
    }

    private fun fetchTodayProgress() {
        val today = Calendar.getInstance()
        val todayYear = today.get(Calendar.YEAR)
        val todayMonth = today.get(Calendar.MONTH)
        val todayDay = today.get(Calendar.DAY_OF_MONTH)

        var workoutsCompletedToday = 0
        var caloriesFromWorkouts = 0

        val workoutHistoryJson = workoutPrefs.getString("workout_history_$userId", null)
        if (workoutHistoryJson != null) {
            try {
                val workoutList: List<ActiveWorkout> = Gson().fromJson(
                    workoutHistoryJson,
                    object : TypeToken<List<ActiveWorkout>>() {}.type
                )

                workoutList.forEach { workout ->
                    val workoutDate = Calendar.getInstance()
                    workoutDate.timeInMillis = workout.startTime
                    if (workoutDate.get(Calendar.YEAR) == todayYear &&
                        workoutDate.get(Calendar.MONTH) == todayMonth &&
                        workoutDate.get(Calendar.DAY_OF_MONTH) == todayDay) {
                        workoutsCompletedToday++
                        caloriesFromWorkouts += 150
                    }
                }
            } catch (e: Exception) {
                Log.e("FitFlowDashboard", "Error parsing workout history: ${e.message}")
            }
        }

        findViewById<TextView>(R.id.workout_progress_count).text = workoutsCompletedToday.toString()
        findViewById<TextView>(R.id.calories_progress_count).text = caloriesFromWorkouts.toString()

        val progressPercentage = calculateProgress(caloriesFromWorkouts)
        findViewById<TextView>(R.id.percentage_text).text = "$progressPercentage%"
        findViewById<ProgressBar>(R.id.progress_bar).progress = progressPercentage
    }

    private fun calculateProgress(totalCalories: Int): Int {
        val goalCalories = 1000
        return ((totalCalories.toFloat() / goalCalories) * 100).toInt().coerceAtMost(100)
    }
}
