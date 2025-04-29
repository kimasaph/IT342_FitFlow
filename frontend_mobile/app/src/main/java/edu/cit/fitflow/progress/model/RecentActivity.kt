package edu.cit.fitflow.progress.model

import java.util.Date

data class RecentActivity(
    val title: String,
    val description: String, // We'll keep this for future use if needed
    val date: Date,
    val iconBackground: Int
)