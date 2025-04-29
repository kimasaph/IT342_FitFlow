package edu.cit.fitflow.workoutPlan.cardioWorkout

import androidx.lifecycle.ViewModel

class CardioWorkoutViewModel : ViewModel() {
    // Workout state
    var intensity: String = "high"
        private set

    var exerciseCountdown: Int = 0
    var caloriesBurned: Double = 33.9
    var totalCaloriesBurned: Double = 33.9
    var totalTime: Int = 60 // 1 minute in seconds
    var heartRate: Int = 156
    var overallProgress: Int = 80
    var completedWorkouts: Int = 2

    // Exercise data
    private val exercises = listOf(
        // Low intensity exercises
        CardioExercise(
            id = "low_1",
            name = "Walking in Place",
            description = "Walk in place at a comfortable pace.",
            duration = 60,
            intensity = "low",
            caloriesPerMinute = mapOf("low" to 3.0, "medium" to 4.0, "high" to 5.0)
        ),
        CardioExercise(
            id = "low_2",
            name = "Side Steps",
            description = "Step side-to-side while swinging your arms.",
            duration = 60,
            intensity = "low",
            caloriesPerMinute = mapOf("low" to 3.5, "medium" to 4.5, "high" to 5.5)
        ),
        CardioExercise(
            id = "low_3",
            name = "Arm Circles",
            description = "Extend your arms and make small circles.",
            duration = 45,
            intensity = "low",
            caloriesPerMinute = mapOf("low" to 2.5, "medium" to 3.5, "high" to 4.5)
        ),
        CardioExercise(
            id = "low_4",
            name = "Seated March",
            description = "Sit on a chair and march your legs up and down.",
            duration = 60,
            intensity = "low",
            caloriesPerMinute = mapOf("low" to 2.0, "medium" to 3.0, "high" to 4.0)
        ),
        CardioExercise(
            id = "low_5",
            name = "Toe Taps",
            description = "Tap your toes on the ground alternately.",
            duration = 45,
            intensity = "low",
            caloriesPerMinute = mapOf("low" to 2.5, "medium" to 3.5, "high" to 4.5)
        ),

        // Medium intensity exercises
        CardioExercise(
            id = "medium_1",
            name = "Jumping Jacks",
            description = "Stand with your feet together and arms at your sides, then jump to a position with legs spread and arms overhead.",
            duration = 60,
            intensity = "medium",
            caloriesPerMinute = mapOf("low" to 6.0, "medium" to 8.0, "high" to 10.0)
        ),
        CardioExercise(
            id = "medium_2",
            name = "High Knees",
            description = "Run in place, lifting your knees as high as possible with each step.",
            duration = 45,
            intensity = "medium",
            caloriesPerMinute = mapOf("low" to 7.0, "medium" to 9.0, "high" to 11.0)
        ),
        CardioExercise(
            id = "medium_3",
            name = "Mountain Climbers",
            description = "Start in a plank position and alternate driving your knees toward your chest.",
            duration = 45,
            intensity = "medium",
            caloriesPerMinute = mapOf("low" to 8.0, "medium" to 10.0, "high" to 12.0)
        ),
        CardioExercise(
            id = "medium_4",
            name = "Step-Ups",
            description = "Step up and down on a sturdy platform or step.",
            duration = 60,
            intensity = "medium",
            caloriesPerMinute = mapOf("low" to 6.5, "medium" to 8.5, "high" to 10.5)
        ),
        CardioExercise(
            id = "medium_5",
            name = "Butt Kicks",
            description = "Run in place, kicking your heels toward your glutes.",
            duration = 45,
            intensity = "medium",
            caloriesPerMinute = mapOf("low" to 7.0, "medium" to 9.0, "high" to 11.0)
        ),

        // High intensity exercises
        CardioExercise(
            id = "high_1",
            name = "Burpees",
            description = "Begin in a standing position, move into a squat position, kick feet back, return to squat, and jump up.",
            duration = 30,
            intensity = "high",
            caloriesPerMinute = mapOf("low" to 10.0, "medium" to 13.0, "high" to 16.0)
        ),
        CardioExercise(
            id = "high_2",
            name = "Jump Rope",
            description = "Jump over an imaginary or real rope swinging beneath your feet and over your head.",
            duration = 60,
            intensity = "high",
            caloriesPerMinute = mapOf("low" to 9.0, "medium" to 12.0, "high" to 15.0)
        ),
        CardioExercise(
            id = "high_3",
            name = "Squat Jumps",
            description = "Perform a squat and jump explosively upward.",
            duration = 45,
            intensity = "high",
            caloriesPerMinute = mapOf("low" to 9.5, "medium" to 12.5, "high" to 15.5)
        ),
        CardioExercise(
            id = "high_4",
            name = "Lunge Jumps",
            description = "Perform alternating lunges with a jump in between.",
            duration = 45,
            intensity = "high",
            caloriesPerMinute = mapOf("low" to 10.0, "medium" to 13.0, "high" to 16.0)
        ),
        CardioExercise(
            id = "high_5",
            name = "Sprint in Place",
            description = "Run in place as fast as you can.",
            duration = 30,
            intensity = "high",
            caloriesPerMinute = mapOf("low" to 11.0, "medium" to 14.0, "high" to 17.0)
        )
    )

    // Filtered exercises based on current intensity
    var filteredExercises: List<CardioExercise> = exercises.filter { it.intensity == intensity }
        private set

    fun setIntensity(newIntensity: String) {
        intensity = newIntensity
        filteredExercises = exercises.filter { it.intensity == intensity }
    }

    fun incrementTotalTime() {
        totalTime++
    }

    fun incrementCaloriesBurned(calories: Double) {
        caloriesBurned += calories
        totalCaloriesBurned += calories
    }

    fun incrementCompletedWorkouts() {
        completedWorkouts++
    }
}

data class CardioExercise(
    val id: String,
    val name: String,
    val description: String,
    val duration: Int, // in seconds
    val intensity: String, // "low", "medium", or "high"
    val caloriesPerMinute: Map<String, Double> // calories burned per minute for each intensity level
)