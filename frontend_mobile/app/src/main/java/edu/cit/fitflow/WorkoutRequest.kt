package edu.cit.fitflow

public final data class WorkoutRequest(
    val userId: Long, // You need to pass the logged-in user's ID
    val bodyType: String,
    val fitnessGoal: String,
    val currentFitnessLevel: String,
    val preferredWorkoutStyle: String
)
