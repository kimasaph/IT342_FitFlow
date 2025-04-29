package edu.cit.fitflow.workoutPlan

import android.app.Application
import android.content.Context
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import edu.cit.fitflow.services.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.reflect.Type

class WorkoutViewModel(application: Application) : AndroidViewModel(application) {
    private val _activeWorkout = MutableStateFlow<ActiveWorkout?>(null)
    val activeWorkout: StateFlow<ActiveWorkout?> = _activeWorkout.asStateFlow()

    private val _workoutHistory = MutableStateFlow<List<ActiveWorkout>>(emptyList())
    val workoutHistory: StateFlow<List<ActiveWorkout>> = _workoutHistory.asStateFlow()

    private var currentUserId: Int = -1
    private val gson = Gson()

    init {
        val sharedPreferences = application.getSharedPreferences("prefs", Context.MODE_PRIVATE)
        currentUserId = sharedPreferences.getInt("userId", -1)
        if (currentUserId != -1) {
            loadWorkoutHistory()
        }
    }

    fun startNewWorkout() {
        if (currentUserId == -1) return

        _activeWorkout.value = ActiveWorkout(
            id = System.currentTimeMillis().toString(),
            name = "Workout ${_workoutHistory.value.size + 1}",
            exercises = mutableListOf(),
            startTime = System.currentTimeMillis(),
            endTime = 0L,
            userId = currentUserId.toString()
        )
    }

    fun addExerciseToWorkout(exercise: Exercise) {
        _activeWorkout.value?.let { workout ->
            val updatedExercises = workout.exercises.toMutableList()
            updatedExercises.add(exercise)
            _activeWorkout.value = workout.copy(exercises = updatedExercises)
        }
    }

    fun addSetToExercise(exerciseIndex: Int, set: ExerciseSet) {
        _activeWorkout.value?.let { workout ->
            val updatedExercises = workout.exercises.toMutableList()
            if (exerciseIndex in updatedExercises.indices) {
                val exercise = updatedExercises[exerciseIndex]
                val updatedSets = exercise.sets.toMutableList()
                updatedSets.add(set)
                updatedExercises[exerciseIndex] = exercise.copy(sets = updatedSets)
                _activeWorkout.value = workout.copy(exercises = updatedExercises)
            }
        }
    }

    fun completeWorkout() {
        if (currentUserId == -1) {
            Log.e("WorkoutViewModel", "Cannot complete workout: No user logged in")
            return
        }

        _activeWorkout.value?.let { workout ->
            val completedWorkout = workout.copy(endTime = System.currentTimeMillis())
            val updatedHistory = _workoutHistory.value + completedWorkout
            _workoutHistory.value = updatedHistory
            _activeWorkout.value = null

            saveWorkoutHistory()

            val workoutRequest = WorkoutRequest(
                userId = currentUserId,
                bodyType = "",
                fitnessGoal = "",
                fitnessLevel = "",
                workoutStyle = "",
                healthConcerns = ""
            )

            RetrofitClient.instance.createWorkout(currentUserId, workoutRequest).enqueue(object : Callback<WorkoutRequest> {
                override fun onResponse(call: Call<WorkoutRequest>, response: Response<WorkoutRequest>) {
                    if (response.isSuccessful) {
                        Log.d("WorkoutViewModel", "Workout saved to server successfully")
                    } else {
                        Log.e("WorkoutViewModel", "Failed to save workout to server: ${response.code()}")
                    }
                }

                override fun onFailure(call: Call<WorkoutRequest>, t: Throwable) {
                    Log.e("WorkoutViewModel", "Error saving workout to server: ${t.message}")
                }
            })
        }
    }

    private fun saveWorkoutHistory() {
        if (currentUserId == -1) {
            Log.e("WorkoutViewModel", "Cannot save workout history: No user logged in")
            return
        }

        try {
            val sharedPreferences = getApplication<Application>().getSharedPreferences("workout_prefs", Context.MODE_PRIVATE)
            val workoutHistoryJson = gson.toJson(_workoutHistory.value)
            sharedPreferences.edit()
                .putString("workout_history_$currentUserId", workoutHistoryJson)
                .apply()

            Log.d("WorkoutViewModel", "Saved workout history for user $currentUserId: ${_workoutHistory.value.size} items")
        } catch (e: Exception) {
            Log.e("WorkoutViewModel", "Error saving workout history: ${e.message}")
        }
    }

    fun loadWorkoutHistory() {
        if (currentUserId == -1) return

        try {
            val sharedPreferences = getApplication<Application>().getSharedPreferences("workout_prefs", Context.MODE_PRIVATE)
            val workoutHistoryJson = sharedPreferences.getString("workout_history_$currentUserId", null)

            if (workoutHistoryJson != null) {
                val type: Type = object : TypeToken<List<ActiveWorkout>>() {}.type
                val history: List<ActiveWorkout> = gson.fromJson(workoutHistoryJson, type)
                _workoutHistory.value = history
                Log.d("WorkoutViewModel", "Loaded workout history for user $currentUserId: ${history.size} items")
            } else {
                _workoutHistory.value = emptyList()
                Log.d("WorkoutViewModel", "No workout history found for user: $currentUserId")
            }
        } catch (e: Exception) {
            Log.e("WorkoutViewModel", "Error loading workout history: ${e.message}")
            _workoutHistory.value = emptyList()
        }
    }

    fun updateSet(exerciseIndex: Int, setIndex: Int, updatedSet: ExerciseSet) {
        _activeWorkout.value?.let { workout ->
            val updatedExercises = workout.exercises.toMutableList()
            if (exerciseIndex in updatedExercises.indices) {
                val exercise = updatedExercises[exerciseIndex]
                val updatedSets = exercise.sets.toMutableList()
                if (setIndex in updatedSets.indices) {
                    updatedSets[setIndex] = updatedSet
                    updatedExercises[exerciseIndex] = exercise.copy(sets = updatedSets)
                    _activeWorkout.value = workout.copy(exercises = updatedExercises)
                }
            }
        }
    }

    fun removeExerciseFromWorkout(exerciseIndex: Int) {
        _activeWorkout.value?.let { workout ->
            val updatedExercises = workout.exercises.toMutableList()
            if (exerciseIndex in updatedExercises.indices) {
                updatedExercises.removeAt(exerciseIndex)
                _activeWorkout.value = workout.copy(exercises = updatedExercises)
            }
        }
    }

    fun calculateCaloriesBurned(workout: ActiveWorkout): Int {
        var totalCalories = 0
        workout.exercises.forEach { exercise ->
            exercise.sets.forEach { set ->
                if (set.isCompleted) {
                    totalCalories += (set.weight * set.reps * 0.1).toInt()
                }
            }
        }
        return totalCalories
    }
}
