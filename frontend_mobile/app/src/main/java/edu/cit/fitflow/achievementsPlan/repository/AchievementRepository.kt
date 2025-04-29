package edu.cit.fitflow.achievementsPlan.repository

import android.content.Context
import android.util.Log
import edu.cit.fitflow.R
import edu.cit.fitflow.achievementsPlan.dto.AchievementProgressResponse
import edu.cit.fitflow.achievementsPlan.model.Achievement
import edu.cit.fitflow.services.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AchievementRepository(private val context: Context) {

    private val TAG = "AchievementRepository"

    fun getCurrentUserId(context: Context): Int {
        val sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
        return sharedPreferences.getInt("userId", -1)  // or -1 if not found
    }


    fun getUserAchievementsWithProgress(
        userId: Int,
        onSuccess: (AchievementProgressResponse) -> Unit,
        onError: (String) -> Unit
    ) {
        val retrofitService = RetrofitClient.instance

        retrofitService.getMyAchievementsWithProgress(userId)
            .enqueue(object : Callback<AchievementProgressResponse> {
                override fun onResponse(
                    call: Call<AchievementProgressResponse>,
                    response: Response<AchievementProgressResponse>
                ) {
                    if (response.isSuccessful) {
                        response.body()?.let { onSuccess(it) }
                    } else {
                        Log.e(TAG, "Server error: ${response.code()} - ${response.errorBody()?.string()}")
                        onError("No achievements yet. Start earning your first one!")
                    }
                }

                override fun onFailure(call: Call<AchievementProgressResponse>, t: Throwable) {
                    Log.e(TAG, "Network error", t)
                    onError("Unable to connect. Showing offline achievements.")
                }
            })
    }



    fun getAllDefaultAchievements(): List<Achievement> {
        return listOf(
            Achievement(1, "Protein King", "Meet your protein goal for 7 consecutive days", R.string.category_nutrition, R.drawable.ic_protein, 0, false, 7, "protein_streak"),
            Achievement(2, "Hydration Hero", "Drink 3L of water daily for 5 days", R.string.category_health, R.drawable.ic_hydration_hero, 0, false, 5, "hydration_streak"),
            Achievement(3, "Cardio Crusher", "Complete 10 cardio sessions", R.string.category_workout, R.drawable.ic_cardio_crusher, 0, false, 10, "cardio_completed"),
            Achievement(4, "Early Bird", "Complete 5 workouts before 8 AM", R.string.category_workout, R.drawable.ic_early_birda, 0, false, 5, "early_workout"),
            Achievement(5, "Consistency Champion", "Log in to FitFlow for 30 days in a row", R.string.category_general, R.drawable.ic_consistency_champion, 0, false, 30, "login_streak"),
            Achievement(6, "Weight Warrior", "Record weight 10 days in a row", R.string.category_tracking, R.drawable.ic_weight_warrior, 0, false, 10, "weight_streak"),
            Achievement(7, "Meal Master", "Create 5 custom meals", R.string.category_nutrition, R.drawable.ic_meal_master, 0, false, 5, "meals_created_5"),
            Achievement(8, "Sleep Expert", "Get 8 hours of sleep for 7 days", R.string.category_health, R.drawable.ic_sleep_expert, 0, false, 7, "sleep_streak")
        )
    }
}
