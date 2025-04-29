package edu.cit.fitflow.workoutPlan

data class WorkoutRequest(
    val userId: Int,
    val bodyType: String,
    val fitnessGoal: String,
    val fitnessLevel: String,
    val workoutStyle: String,
    val healthConcerns: String? = null
)


data class ExerciseRequest(
    val name: String,
    val targetMuscle: String,
    val difficulty: String,
    val sets: List<SetRequest>
)

data class SetRequest(
    val weight: Float,
    val reps: Int,
    val isCompleted: Boolean
)
