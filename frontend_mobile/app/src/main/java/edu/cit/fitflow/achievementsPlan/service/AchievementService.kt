//package edu.cit.fitflow.achievementsPlan.service
//
//import android.content.Context
//import android.util.Log
//import edu.cit.fitflow.achievementsPlan.model.Achievement
//import edu.cit.fitflow.achievementsPlan.service.AchievementService.Service
//import edu.cit.fitflow.entity.AchievementProgressEntity
//import edu.cit.fitflow.entity.UserEntity
//import edu.cit.fitflow.repository.AchievementProgressRepository
//import kotlinx.coroutines.Dispatchers
//import kotlinx.coroutines.withContext
//import org.springframework.stereotype.Service
//import java.util.Date
//import java.util.concurrent.Executor
//import java.util.concurrent.Executors
//
//@Service
//class AchievementService {
//    annotation class Service
//
//    companion object {
//        // Achievement trigger events
//        const val TRIGGER_FIRST_WORKOUT = "first_workout"
//        const val TRIGGER_WORKOUTS_COMPLETED = "workouts_completed"
//        const val TRIGGER_ALL_WORKOUT_TYPES = "all_workout_types"
//        const val TRIGGER_MORNING_WORKOUTS = "early_bird"
//        const val TRIGGER_STREAK_DAYS = "streak_days"
//        const val TRIGGER_WEIGHT_GOAL = "weight_goal"
//        const val TRIGGER_PROTEIN_GOAL = "protein_goal"
//        const val TRIGGER_HYDRATION = "hydration"
//        const val TRIGGER_CARDIO_SESSIONS = "cardio_sessions"
//        const val TRIGGER_LOGIN_STREAK = "login_streak"
//        const val TRIGGER_WEIGHT_TRACKING = "weight_tracking"
//        const val TRIGGER_CUSTOM_MEALS = "custom_meals"
//        const val TRIGGER_SLEEP_TRACKING = "sleep_tracking"
//
//        // Singleton instance
//        @Volatile
//        private var instance: AchievementService? = null
//
//        fun getInstance(context: Context): AchievementService {
//            return instance ?: synchronized(this) {
//                instance ?: AchievementService().also { instance = it }
//            }
//        }
//
//        // Define all available achievements
//        fun getAllAchievements(): List<Achievement> {
//            return listOf(
//                Achievement(
//                    title = "First Workout",
//                    description = "Complete your first workout",
//                    category = "Workout",
//                    image = "ic_trophy",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 1
//                ),
//                Achievement(
//                    title = "Consistency Champion",
//                    description = "Log in to FitFlow for 30 days in a row",
//                    category = "General",
//                    image = "consistency_champion",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 30
//                ),
//                Achievement(
//                    title = "Early Bird",
//                    description = "Complete 5 workouts before 8 AM",
//                    category = "Workout",
//                    image = "early_bird",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 5
//                ),
//                Achievement(
//                    title = "Protein King",
//                    description = "Meet your protein goal for 7 consecutive days",
//                    category = "Nutrition",
//                    image = "protein_king",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 7
//                ),
//                Achievement(
//                    title = "Hydration Hero",
//                    description = "Drink 3L of water daily for 5 days",
//                    category = "Health",
//                    image = "hydration_hero",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 5
//                ),
//                Achievement(
//                    title = "Cardio Crusher",
//                    description = "Complete 10 cardio sessions",
//                    category = "Workout",
//                    image = "cardio_crusher",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 10
//                ),
//                Achievement(
//                    title = "Weight Warrior",
//                    description = "Record weight 10 days in a row",
//                    category = "Tracking",
//                    image = "weight_warrior",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 10
//                ),
//                Achievement(
//                    title = "Meal Master",
//                    description = "Create 5 custom meals",
//                    category = "Nutrition",
//                    image = "meal_master",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 5
//                ),
//                Achievement(
//                    title = "Sleep Expert",
//                    description = "Get 8 hours of sleep for 7 days",
//                    category = "Health",
//                    image = "sleep_expert",
//                    unlocked = false,
//                    dateAchieved = null,
//                    currentProgress = 0,
//                    targetProgress = 7
//                )
//            )
//        }
//    }
//
//    private val executor: Executor = Executors.newSingleThreadExecutor()
//
//    // This would be autowired in a Spring context
//    private var achievementProgressRepository: AchievementProgressRepository? = null
//
//    // For Android, we'll use this method to set the repository
//    fun setRepository(repository: AchievementProgressRepository) {
//        this.achievementProgressRepository = repository
//    }
//
//    // Get user's achievements with progress
//    suspend fun getUserAchievements(user: UserEntity): List<Achievement> {
//        return withContext(Dispatchers.IO) {
//            try {
//                val allAchievements = getAllAchievements()
//                val userProgress = achievementProgressRepository?.findByUser(user) ?: emptyList()
//
//                // Map user progress to achievements
//                allAchievements.map { achievement ->
//                    val triggerEvent = getTriggerEventForAchievement(achievement.title)
//                    val progress = userProgress.find { it.triggerEvent == triggerEvent }
//
//                    if (progress != null) {
//                        val isUnlocked = progress.currentProgress >= achievement.targetProgress
//                        achievement.copy(
//                            currentProgress = progress.currentProgress,
//                            unlocked = isUnlocked,
//                            dateAchieved = if (isUnlocked) Date() else null
//                        )
//                    } else {
//                        achievement
//                    }
//                }
//            } catch (e: Exception) {
//                Log.e("AchievementService", "Error getting user achievements", e)
//                getAllAchievements() // Return default achievements on error
//            }
//        }
//    }
//
//    // Get trigger event based on achievement title
//    private fun getTriggerEventForAchievement(title: String): String {
//        return when (title) {
//            "First Workout" -> TRIGGER_FIRST_WORKOUT
//            "Consistency Champion" -> TRIGGER_LOGIN_STREAK
//            "Early Bird" -> TRIGGER_MORNING_WORKOUTS
//            "Protein King" -> TRIGGER_PROTEIN_GOAL
//            "Hydration Hero" -> TRIGGER_HYDRATION
//            "Cardio Crusher" -> TRIGGER_CARDIO_SESSIONS
//            "Weight Warrior" -> TRIGGER_WEIGHT_TRACKING
//            "Meal Master" -> TRIGGER_CUSTOM_MEALS
//            "Sleep Expert" -> TRIGGER_SLEEP_TRACKING
//            else -> title.lowercase().replace(" ", "_")
//        }
//    }
//
//    // Update achievement progress
//    fun updateProgress(user: UserEntity, triggerEvent: String, progress: Int = 1) {
//        executor.execute {
//            try {
//                val repository = achievementProgressRepository ?: return@execute
//
//                val achievementProgress = repository.findByUserAndTriggerEvent(user, triggerEvent)
//                    .orElse(AchievementProgressEntity(null, user, triggerEvent, 0))
//
//                // Increment progress
//                achievementProgress.currentProgress += progress
//
//                // Save updated progress
//                repository.save(achievementProgress)
//
//                // Check if any achievements were unlocked
//                val achievement = getAllAchievements().find {
//                    getTriggerEventForAchievement(it.title) == triggerEvent
//                }
//                if (achievement != null && achievementProgress.currentProgress >= achievement.targetProgress) {
//                    // Achievement unlocked - could trigger notification or other action
//                    Log.d("AchievementService", "Achievement unlocked: ${achievement.title}")
//                }
//            } catch (e: Exception) {
//                Log.e("AchievementService", "Error updating achievement progress", e)
//            }
//        }
//    }
//
//    // Track workout completion
//    fun trackWorkoutCompleted(user: UserEntity, workoutType: String, isBeforeEightAM: Boolean) {
//        // Track first workout
//        updateProgress(user, TRIGGER_FIRST_WORKOUT)
//
//        // Track total workouts
//        updateProgress(user, TRIGGER_WORKOUTS_COMPLETED)
//
//        // Track workout type
//        updateProgress(user, "$TRIGGER_ALL_WORKOUT_TYPES:$workoutType")
//
//        // Check if it's a morning workout
//        if (isBeforeEightAM) {
//            updateProgress(user, TRIGGER_MORNING_WORKOUTS)
//        }
//
//        // Track cardio sessions if applicable
//        if (workoutType.equals("cardio", ignoreCase = true)) {
//            updateProgress(user, TRIGGER_CARDIO_SESSIONS)
//        }
//    }
//
//    // Track streak days
//    fun trackLoginStreak(user: UserEntity) {
//        updateProgress(user, TRIGGER_LOGIN_STREAK)
//    }
//
//    // Track weight recording
//    fun trackWeightRecorded(user: UserEntity) {
//        updateProgress(user, TRIGGER_WEIGHT_TRACKING)
//    }
//
//    // Track protein goal met
//    fun trackProteinGoalMet(user: UserEntity) {
//        updateProgress(user, TRIGGER_PROTEIN_GOAL)
//    }
//
//    // Track hydration goal met
//    fun trackHydrationGoalMet(user: UserEntity) {
//        updateProgress(user, TRIGGER_HYDRATION)
//    }
//
//    // Track custom meal created
//    fun trackCustomMealCreated(user: UserEntity) {
//        updateProgress(user, TRIGGER_CUSTOM_MEALS)
//    }
//
//    // Track sleep goal met
//    fun trackSleepGoalMet(user: UserEntity) {
//        updateProgress(user, TRIGGER_SLEEP_TRACKING)
//    }
//
//    // Reset streak (when streak is broken)
//    fun resetLoginStreak(user: UserEntity) {
//        executor.execute {
//            try {
//                val repository = achievementProgressRepository ?: return@execute
//
//                val streakProgress = repository.findByUserAndTriggerEvent(user, TRIGGER_LOGIN_STREAK)
//                    .orElse(null) ?: return@execute
//
//                // Reset streak to 0
//                streakProgress.currentProgress = 0
//                repository.save(streakProgress)
//            } catch (e: Exception) {
//                Log.e("AchievementService", "Error resetting streak", e)
//            }
//        }
//    }
//
//    // For demo/testing purposes - populate with sample achievements
//    fun populateSampleAchievements(user: UserEntity) {
//        updateProgress(user, TRIGGER_FIRST_WORKOUT, 1) // First workout completed
//        updateProgress(user, TRIGGER_WORKOUTS_COMPLETED, 6) // 6 workouts completed
//        updateProgress(user, "$TRIGGER_ALL_WORKOUT_TYPES:strength", 1) // Tried strength training
//        updateProgress(user, TRIGGER_LOGIN_STREAK, 18) // 18-day login streak
//        updateProgress(user, TRIGGER_PROTEIN_GOAL, 7) // Protein goal met for 7 days
//        updateProgress(user, TRIGGER_HYDRATION, 5) // Hydration goal met for 5 days
//        updateProgress(user, TRIGGER_CARDIO_SESSIONS, 10) // 10 cardio sessions completed
//        updateProgress(user, TRIGGER_MORNING_WORKOUTS, 3) // 3 morning workouts
//        updateProgress(user, TRIGGER_WEIGHT_TRACKING, 6) // Weight tracked for 6 days
//        updateProgress(user, TRIGGER_CUSTOM_MEALS, 1) // 1 custom meal created
//        updateProgress(user, TRIGGER_SLEEP_TRACKING, 4) // Sleep goal met for 4 days
//    }
//}