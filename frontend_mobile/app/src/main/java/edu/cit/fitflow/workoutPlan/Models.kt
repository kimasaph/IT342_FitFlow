package edu.cit.fitflow.workoutPlan

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Represents a workout template that can be used to start a new workout
 */
@Parcelize
data class WorkoutTemplate(
    val id: String,
    val name: String,
    val description: String,
    val exercises: List<Exercise> = emptyList()
) : Parcelable

/**
 * Represents an exercise with its details
 */
@Parcelize
data class Exercise(
    val id: String,
    val name: String,
    val targetMuscle: String,
    val difficulty: String,
    val imageResId: Int = 0,
    val isCompleted: Boolean = false,
    val sets: List<ExerciseSet> = emptyList()
) : Parcelable

/**
 * Represents a set of an exercise with weight, reps and completion status
 */
@Parcelize
data class ExerciseSet(
    val weight: Float = 0f,
    val reps: Int = 0,
    val isCompleted: Boolean = false
) : Parcelable

/**
 * Represents an active workout session with exercises and tracking data
 */
@Parcelize
data class ActiveWorkout(
    val id: String,
    val name: String,
    val exercises: List<Exercise> = emptyList(),
    val startTime: Long = System.currentTimeMillis(),
    val endTime: Long = 0,
    val userId: String = "" // Add this field to track which user created the workout
) : Parcelable