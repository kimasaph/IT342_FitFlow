package edu.cit.fitflow.achievementsPlan.model

import android.content.Context
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Model class representing an achievement in the FitFlow app.
 */
data class Achievement(
    val id: Int,                  // Achievement ID
    val title: String,            // Achievement title
    val description: String,      // Achievement description
    val categoryId: Int,          // Resource ID for the category string
    val iconId: Int,              // Resource ID for the achievement icon
    var currentProgress: Int,     // Current progress toward achievement
    var isUnlocked: Boolean,      // Whether the achievement is unlocked
    val targetProgress: Int,      // Target progress needed to unlock
    val triggerEvent: String,     // Backend event identifier for progress tracking
    var dateUnlocked: Date? = null // Date when the achievement was unlocked (nullable)
) {
    /**
     * Calculates the progress percentage for this achievement.
     * @return The progress as a percentage (0-100)
     */
    fun getProgressPercentage(): Int {
        return if (targetProgress > 0) {
            (currentProgress * 100) / targetProgress
        } else {
            0
        }
    }

    /**
     * Formats the unlocked date for display.
     * @return A formatted date string or a default message if not unlocked yet
     */
    fun getFormattedDate(): String {
        val dateUnlocked = this.dateUnlocked ?: return "Not unlocked yet"
        val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
        return dateFormat.format(dateUnlocked)
    }

    /**
     * Retrieves the category name based on the category ID.
     * @param context The context to access resources
     * @return The category name as a string
     */
    fun getCategoryName(context: Context): String {
        return try {
            context.getString(this.categoryId)
        } catch (e: Exception) {
            "General"
        }
    }
}
