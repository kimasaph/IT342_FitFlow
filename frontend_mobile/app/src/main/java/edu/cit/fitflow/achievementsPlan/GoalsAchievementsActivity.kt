package edu.cit.fitflow.achievementsPlan

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import edu.cit.fitflow.R
import edu.cit.fitflow.achievementsPlan.adapter.AchievementAdapter
import edu.cit.fitflow.achievementsPlan.model.Achievement
import edu.cit.fitflow.achievementsPlan.repository.AchievementRepository

class GoalsAchievementsActivity : AppCompatActivity() {

    private var rvAchievements: RecyclerView? = null
    private var tvAchievementsCount: TextView? = null
    private var categoryChipGroup: ChipGroup? = null
    private var statusChipGroup: ChipGroup? = null
    private var progressBar: ProgressBar? = null
    private var btnBack: ImageView? = null

    private lateinit var achievementRepository: AchievementRepository
    private lateinit var achievementAdapter: AchievementAdapter
    private var achievements = ArrayList<Achievement>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_goals_achievements)

        achievementRepository = AchievementRepository(this)
        initViews()

        rvAchievements?.layoutManager = GridLayoutManager(this, 2)
        achievementAdapter = AchievementAdapter(this, achievements)
        rvAchievements?.adapter = achievementAdapter

        btnBack?.setOnClickListener { finish() }

        setupCategoryChips()
        setupStatusChips()

        loadAchievements()
    }

    private fun initViews() {
        rvAchievements = findViewById(R.id.rvAchievements)
        tvAchievementsCount = findViewById(R.id.tvAchievementsCount)
        categoryChipGroup = findViewById(R.id.categoryChipGroup)
        statusChipGroup = findViewById(R.id.statusChipGroup)
        progressBar = findViewById(R.id.progressBar)
        btnBack = findViewById(R.id.btnBack)
    }

    private fun setupCategoryChips() {
        categoryChipGroup?.setOnCheckedChangeListener { group, checkedId ->
            val chip = findViewById<Chip>(checkedId)
            chip?.let { achievementAdapter.filterByCategory(it.text.toString()) }
        }
    }

    private fun setupStatusChips() {
        statusChipGroup?.setOnCheckedChangeListener { group, checkedId ->
            val chip = findViewById<Chip>(checkedId)
            chip?.let { achievementAdapter.filterByStatus(it.text.toString()) }
        }
    }

    private fun loadAchievements() {
        progressBar?.visibility = View.VISIBLE

        val userId = getUserIdFromPreferences()

        if (userId == -1) {
            Toast.makeText(this, "User not logged in.", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        achievementRepository.getUserAchievementsWithProgress(
            userId = userId,   // ✅ FIXED here
            onSuccess = { response ->
                progressBar?.visibility = View.GONE
                achievements.clear()

                val defaultAchievements = achievementRepository.getAllDefaultAchievements()

                achievements.addAll(
                    defaultAchievements.map { defaultAchievement ->
                        val userProgress = response.progress[defaultAchievement.triggerEvent] ?: 0
                        val isUnlocked = response.unlockedAchievements.any { it.achievementId == defaultAchievement.id }
                                || userProgress >= defaultAchievement.targetProgress

                        defaultAchievement.copy(
                            isUnlocked = isUnlocked,
                            currentProgress = userProgress
                        )
                    }
                )

                achievementAdapter.notifyDataSetChanged()
                val unlockedCount = achievements.count { it.isUnlocked }
                tvAchievementsCount?.text = "$unlockedCount/${achievements.size}"
            },
            onError = { errorMessage ->
                progressBar?.visibility = View.GONE
                Toast.makeText(this, "Unable to load achievements: $errorMessage", Toast.LENGTH_SHORT).show()
                loadFallbackAchievements()
            }
        )
    }

    private fun loadFallbackAchievements() {
        achievements.clear()

        achievements.addAll(achievementRepository.getAllDefaultAchievements())

        achievementAdapter.notifyDataSetChanged()
        val unlockedCount = achievements.count { it.isUnlocked }
        tvAchievementsCount?.text = "$unlockedCount/${achievements.size}"
    }

    private fun getUserIdFromPreferences(): Int {
        val sharedPref = getSharedPreferences("prefs", Context.MODE_PRIVATE)
        return sharedPref.getInt("userId", -1)
    }
}
