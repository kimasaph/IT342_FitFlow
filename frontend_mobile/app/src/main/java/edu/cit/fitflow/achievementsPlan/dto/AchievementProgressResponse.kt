package edu.cit.fitflow.achievementsPlan.dto

import com.google.gson.annotations.SerializedName
import java.util.Date

data class AchievementProgressResponse(
    @SerializedName("unlocked")
    val unlockedAchievements: List<UnlockedAchievementDTO>,

    @SerializedName("progress")
    val progress: Map<String, Int>
)

data class UnlockedAchievementDTO(
    val id: Int,
    val achievementId: Int,
    val title: String,
    val description: String,
    val image: String,
    val dateAchieved: Long? // <<< CHANGED from Date? to Long?
)


data class UserAchievementDTO(
    val achievementTitle: String,
    val achievementDescription: String,
    val achievementImage: String,
    val dateAchieved: Date?
)