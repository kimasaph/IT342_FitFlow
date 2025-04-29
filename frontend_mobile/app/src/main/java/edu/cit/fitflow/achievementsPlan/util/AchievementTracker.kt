package edu.cit.fitflow.achievementsPlan.util

import android.content.Context
import android.util.Log
import edu.cit.fitflow.services.RetrofitClient
import java.util.Calendar

/**
 * Utility class to track achievements across the app
 */
object AchievementTracker {
    private const val TAG = "AchievementTracker"

    // Use the existing RetrofitClient
    private val apiService = RetrofitClient.instance

    /**
     * Track a completed workout
     */
    fun trackWorkoutCompleted(context: Context, workoutType: String) {
        val userId = SharedPreferencesManager(context).getUserId()

        // Check if workout is before 8 AM
        val calendar = Calendar.getInstance()
        val isBeforeEightAM = calendar.get(Calendar.HOUR_OF_DAY) < 8

        // Track the workout
        if (isBeforeEightAM) {
            updateAchievementProgress(userId, "early_workout")
        }

        // Track cardio sessions
        if (workoutType.equals("cardio", ignoreCase = true)) {
            updateAchievementProgress(userId, "cardio_completed")
        }
    }

    /**
     * Track daily login
     */
    fun trackDailyLogin(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "login_streak")
    }

    /**
     * Track weight recording
     */
    fun trackWeightRecorded(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "weight_streak")
    }

    /**
     * Track protein goal met
     */
    fun trackProteinGoalMet(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "protein_streak")
    }

    /**
     * Track hydration goal met
     */
    fun trackHydrationGoalMet(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "hydration_streak")
    }

    /**
     * Track custom meal created
     */
    fun trackCustomMealCreated(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "meals_created_5")
    }

    /**
     * Track sleep goal met
     */
    fun trackSleepGoalMet(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "sleep_streak")
    }

    /**
     * Track first meal logged
     */
    fun trackFirstMealLogged(context: Context) {
        val userId = SharedPreferencesManager(context).getUserId()
        updateAchievementProgress(userId, "meal_logged")
    }

    /**
     * Update achievement progress via API
     */
    private fun updateAchievementProgress(userId: Int, triggerEvent: String) {
        Log.d(TAG, "Updating achievement progress for user $userId: $triggerEvent")

        // For now, we'll just log it since the API endpoint might not exist yet
        // In a real implementation, you would make an API call like this:

        // apiService.updateAchievementProgress(userId, triggerEvent)
        //     .enqueue(object : Callback<ResponseBody> {
        //         override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
        //             if (response.isSuccessful) {
        //                 Log.d(TAG, "Achievement progress updated successfully")
        //             } else {
        //                 Log.e(TAG, "Failed to update achievement progress: ${response.code()}")
        //             }
        //         }
        //
        //         override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
        //             Log.e(TAG, "API call failed", t)
        //         }
        //     })
    }
}