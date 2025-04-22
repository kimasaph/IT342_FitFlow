package edu.cit.fitflow

data class WorkoutRequest(
    val userId: Int,
    val bodyType: String,
    val fitnessGoal: String,
    val fitnessLevel: String, // Not nullable
    val workoutStyle: String, // Not nullable
    val healthConcerns: String?, // Nullable
    //val currentFitnessLevel: String // Not nullable
)
