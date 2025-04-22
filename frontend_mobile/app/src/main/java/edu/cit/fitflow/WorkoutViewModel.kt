package edu.cit.fitflow

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class WorkoutTemplate(
    val id: String,
    val name: String,
    val description: String,
    val exercises: List<Exercise> = emptyList()
)

data class Exercise(
    val id: String,
    val name: String,
    val targetMuscle: String,
    val sets: Int,
    val reps: Int
)

data class ActiveWorkout(
    val id: String,
    val name: String,
    val exercises: List<Exercise>,
    val startTime: Long,
    val endTime: Long? = null
)

class WorkoutViewModel : ViewModel() {
    private val _workoutTemplates = MutableStateFlow<List<WorkoutTemplate>>(emptyList())
    val workoutTemplates: StateFlow<List<WorkoutTemplate>> = _workoutTemplates.asStateFlow()

    private val _activeWorkout = MutableStateFlow<ActiveWorkout?>(null)
    val activeWorkout: StateFlow<ActiveWorkout?> = _activeWorkout.asStateFlow()

    private val _workoutHistory = MutableStateFlow<List<ActiveWorkout>>(emptyList())
    val workoutHistory: StateFlow<List<ActiveWorkout>> = _workoutHistory.asStateFlow()

    init {
        loadWorkoutTemplates()
    }

    private fun loadWorkoutTemplates() {
        // In a real app, this would come from a repository or database
        val templates = listOf(
            WorkoutTemplate(
                id = "full_body",
                name = "Full Body Strength",
                description = "Complete full body workout targeting all major muscle groups",
                exercises = listOf(
                    Exercise("squat", "Barbell Squat", "Legs", 4, 8),
                    Exercise("bench", "Bench Press", "Chest", 4, 8),
                    Exercise("deadlift", "Deadlift", "Back", 3, 6)
                )
            ),
            WorkoutTemplate(
                id = "upper_body",
                name = "Upper Body Focus",
                description = "Focused workout for chest, back, shoulders and arms",
                exercises = listOf(
                    Exercise("bench", "Bench Press", "Chest", 4, 10),
                    Exercise("row", "Barbell Row", "Back", 4, 10),
                    Exercise("press", "Overhead Press", "Shoulders", 3, 10)
                )
            ),
            WorkoutTemplate(
                id = "lower_body",
                name = "Lower Body Power",
                description = "Intense lower body workout for strength and power",
                exercises = listOf(
                    Exercise("squat", "Barbell Squat", "Legs", 5, 5),
                    Exercise("deadlift", "Deadlift", "Back", 3, 5),
                    Exercise("lunge", "Walking Lunges", "Legs", 3, 12)
                )
            )
        )

        _workoutTemplates.value = templates
    }

    fun startEmptyWorkout() {
        _activeWorkout.value = ActiveWorkout(
            id = "workout_${System.currentTimeMillis()}",
            name = "Custom Workout",
            exercises = emptyList(),
            startTime = System.currentTimeMillis()
        )
    }

    fun startTemplateWorkout(templateId: String) {
        val template = _workoutTemplates.value.find { it.id == templateId }
        template?.let {
            _activeWorkout.value = ActiveWorkout(
                id = "workout_${System.currentTimeMillis()}",
                name = it.name,
                exercises = it.exercises,
                startTime = System.currentTimeMillis()
            )
        }
    }

    fun finishWorkout() {
        _activeWorkout.value?.let { workout ->
            val completedWorkout = workout.copy(endTime = System.currentTimeMillis())
            _workoutHistory.value = _workoutHistory.value + completedWorkout
            _activeWorkout.value = null
        }
    }
}