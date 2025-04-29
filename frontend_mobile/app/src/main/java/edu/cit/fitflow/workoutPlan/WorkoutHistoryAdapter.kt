package edu.cit.fitflow.workoutPlan

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.R
import java.text.SimpleDateFormat
import java.util.*

class WorkoutHistoryAdapter : RecyclerView.Adapter<WorkoutHistoryAdapter.WorkoutViewHolder>() {

    private var workouts: List<ActiveWorkout> = emptyList()

    fun submitList(newWorkouts: List<ActiveWorkout>) {
        workouts = newWorkouts.sortedByDescending { it.startTime }
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WorkoutViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_workout_history_with_exercises, parent, false)
        return WorkoutViewHolder(view)
    }

    override fun onBindViewHolder(holder: WorkoutViewHolder, position: Int) {
        val workout = workouts[position]
        holder.bind(workout)
    }

    override fun getItemCount(): Int = workouts.size

    inner class WorkoutViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvWorkoutName: TextView = itemView.findViewById(R.id.tvWorkoutName)
        private val tvWorkoutDate: TextView = itemView.findViewById(R.id.tvWorkoutDate)
        private val tvCalories: TextView = itemView.findViewById(R.id.tvCalories)
        private val tvCompletedExercises: TextView = itemView.findViewById(R.id.tvCompletedExercises)

        fun bind(workout: ActiveWorkout) {
            tvWorkoutName.text = workout.name

            val dateFormat = SimpleDateFormat("M/d/yyyy", Locale.US)
            tvWorkoutDate.text = dateFormat.format(Date(workout.startTime))

            val calories = workout.exercises.sumOf { exercise ->
                exercise.sets.sumOf { set -> if (set.isCompleted) (set.weight * set.reps * 0.1).toInt() else 0 }
            }
            tvCalories.text = "$calories cal"

            val completedExercises = workout.exercises.count { exercise ->
                exercise.sets.any { it.isCompleted }
            }
            tvCompletedExercises.text = "$completedExercises completed exercises"
        }
    }
}
