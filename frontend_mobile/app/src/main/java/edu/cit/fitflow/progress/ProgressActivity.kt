package edu.cit.fitflow.progress

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import edu.cit.fitflow.R
import edu.cit.fitflow.achievementsPlan.GoalsAchievementsActivity
import edu.cit.fitflow.achievementsPlan.adapter.AchievementAdapter
import edu.cit.fitflow.achievementsPlan.model.Achievement
import edu.cit.fitflow.achievementsPlan.repository.AchievementRepository
import edu.cit.fitflow.progress.adapter.RecentActivityAdapter
import edu.cit.fitflow.progress.model.RecentActivity
import edu.cit.fitflow.workoutPlan.ActiveWorkout
import java.util.*

class ProgressActivity : AppCompatActivity() {

    private var btnBack: ImageView? = null
    private var rvRecentActivity: RecyclerView? = null
    private var rvAchievements: RecyclerView? = null
    private var btnViewAllAchievements: Button? = null
    private var tvAchievementsCount: TextView? = null
    private var progressBar: ProgressBar? = null
    private var emptyStateLayout: LinearLayout? = null

    private lateinit var achievementRepository: AchievementRepository
    private var achievementAdapter: AchievementAdapter? = null

    private var achievements = listOf<Achievement>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_progress)

        achievementRepository = AchievementRepository(this)
        initViews()

        btnBack?.setOnClickListener { finish() }
        setupRecentActivity()
        setupAchievements()

        btnViewAllAchievements?.setOnClickListener {
            val intent = Intent(this, GoalsAchievementsActivity::class.java)
            startActivity(intent)
        }

        updateWorkoutStyleBreakdown()
    }

    private fun initViews() {
        btnBack = findViewById(R.id.btnBack)
        rvRecentActivity = findViewById(R.id.rvRecentActivity)
        rvAchievements = findViewById(R.id.rvAchievements)
        btnViewAllAchievements = findViewById(R.id.btnViewAllAchievements)
        tvAchievementsCount = findViewById(R.id.tvAchievementsCount)
        progressBar = findViewById(R.id.progressBar)
        emptyStateLayout = findViewById(R.id.emptyStateLayout)
    }

    private fun setupRecentActivity() {
        val today = Calendar.getInstance().time
        val yesterday = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, -1) }.time
        val twoDaysAgo = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, -2) }.time

        val activities = listOf(
            RecentActivity("Completed 30 min Strength Training", "", today, R.drawable.circle_background_light_orange),
            RecentActivity("Weight Recorded: 71.6 kg", "", yesterday, R.drawable.circle_background_light_purple),
            RecentActivity("Goal Achieved: 5 workouts in a week", "", twoDaysAgo, R.drawable.circle_background_light_green)
        )

        rvRecentActivity?.let { recyclerView ->
            val adapter = RecentActivityAdapter(activities)
            recyclerView.layoutManager = LinearLayoutManager(this)
            recyclerView.adapter = adapter

            if (activities.isNotEmpty()) {
                recyclerView.visibility = View.VISIBLE
                findViewById<View>(R.id.tvNoActivity)?.visibility = View.GONE
            }
        }
    }

    private fun setupAchievements() {
        rvAchievements?.let { recyclerView ->
            recyclerView.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
            achievementAdapter = AchievementAdapter(this, emptyList())
            recyclerView.adapter = achievementAdapter
            loadAchievements()
        }
    }

    private fun loadAchievements() {
        val userId = getUserIdFromPreferences()

        if (userId == -1) {
            Toast.makeText(this, "User not logged in.", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        progressBar?.visibility = View.VISIBLE

        achievementRepository.getUserAchievementsWithProgress(
            userId = userId,
            onSuccess = { response ->
                progressBar?.visibility = View.GONE

                val defaultAchievements = achievementRepository.getAllDefaultAchievements()

                achievements = defaultAchievements.map { defaultAchievement ->
                    val userProgress = response.progress[defaultAchievement.triggerEvent] ?: 0
                    val isUnlocked = response.unlockedAchievements.any { it.achievementId == defaultAchievement.id }
                            || userProgress >= defaultAchievement.targetProgress
                    defaultAchievement.copy(
                        isUnlocked = isUnlocked,
                        currentProgress = userProgress
                    )
                }

                if (achievements.isEmpty()) {
                    showEmptyState()
                } else {
                    hideEmptyState()

                    val topAchievements = achievements
                        .sortedWith(compareByDescending<Achievement> { it.isUnlocked }
                            .thenByDescending { it.getProgressPercentage() })
                        .take(3)

                    achievementAdapter = AchievementAdapter(this, topAchievements)
                    rvAchievements?.adapter = achievementAdapter
                }

                val unlockedCount = achievements.count { it.isUnlocked }
                val totalCount = achievements.size
                tvAchievementsCount?.text = "$unlockedCount/$totalCount"
            },
            onError = { errorMessage ->
                progressBar?.visibility = View.GONE
                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
                loadFallbackAchievements()
            }
        )
    }

    private fun loadFallbackAchievements() {
        val sampleAchievements = createSampleAchievements()

        if (sampleAchievements.isEmpty()) {
            showEmptyState()
        } else {
            hideEmptyState()

            achievementAdapter = AchievementAdapter(this, sampleAchievements.take(3))
            rvAchievements?.adapter = achievementAdapter
        }

        val unlockedCount = sampleAchievements.count { it.isUnlocked }
        tvAchievementsCount?.text = "$unlockedCount/${sampleAchievements.size}"
    }

    private fun createSampleAchievements(): List<Achievement> {
        return listOf(
            Achievement(1, "Protein King", "Meet your protein goal for 7 consecutive days", R.string.category_nutrition, R.drawable.ic_protein, 7, true, 7, "protein_streak"),
            Achievement(2, "Hydration Hero", "Drink 3L of water daily for 5 days", R.string.category_health, R.drawable.ic_hydration_hero, 5, true, 5, "hydration_streak"),
            Achievement(3, "Cardio Crusher", "Complete 10 cardio sessions", R.string.category_workout, R.drawable.ic_cardio_crusher, 7, false, 10, "cardio_completed")
        )
    }

    private fun updateWorkoutStyleBreakdown() {
        val sharedPref = getSharedPreferences("workout_prefs", Context.MODE_PRIVATE)
        val userId = getUserIdFromPreferences()

        if (userId == -1) return

        val workoutHistoryJson = sharedPref.getString("workout_history_$userId", null)

        if (workoutHistoryJson != null) {
            val gson = Gson()
            val type = object : TypeToken<List<ActiveWorkout>>() {}.type
            val workouts: List<ActiveWorkout> = gson.fromJson(workoutHistoryJson, type)

            var strengthCount = 0
            var cardioCount = 0
            var yogaCount = 0
            var totalCompletedWorkouts = 0

            workouts.forEach { workout ->
                val hasCompletedSet = workout.exercises.any { exercise ->
                    exercise.sets.any { it.isCompleted }
                }

                if (hasCompletedSet) {
                    totalCompletedWorkouts++

                    when {
                        workout.name.contains("Strength", ignoreCase = true) -> strengthCount++
                        workout.name.contains("Cardio", ignoreCase = true) -> cardioCount++
                        workout.name.contains("Yoga", ignoreCase = true) ||
                                workout.name.contains("Flexibility", ignoreCase = true) -> yogaCount++
                    }
                }
            }

            val tvWorkoutBreakdown = findViewById<TextView>(R.id.tvWorkoutBreakdown)
            val tvTotalWorkouts = findViewById<TextView>(R.id.tvTotalWorkouts) // Add this if needed

            tvWorkoutBreakdown.text = "Strength: $strengthCount | Cardio: $cardioCount | Yoga: $yogaCount"
            tvTotalWorkouts?.text = totalCompletedWorkouts.toString()
        }
    }


    private fun showEmptyState() {
        emptyStateLayout?.visibility = View.VISIBLE
        rvAchievements?.visibility = View.GONE
        tvAchievementsCount?.text = "0/0"
    }

    private fun hideEmptyState() {
        emptyStateLayout?.visibility = View.GONE
        rvAchievements?.visibility = View.VISIBLE
    }

    private fun getUserIdFromPreferences(): Int {
        val sharedPref = getSharedPreferences("prefs", Context.MODE_PRIVATE)
        return sharedPref.getInt("userId", -1)
    }
}
