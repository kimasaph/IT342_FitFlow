package edu.cit.fitflow.workoutPlan.cardioWorkout

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.databinding.ItemCardioExerciseBinding

class CardioExerciseAdapter(
    private val onExerciseCompleted: (String) -> Unit
) : ListAdapter<CardioExercise, CardioExerciseAdapter.ExerciseViewHolder>(ExerciseDiffCallback()) {

    private var currentExerciseIndex = 0
    private val completedExercises = mutableSetOf<String>()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExerciseViewHolder {
        val binding = ItemCardioExerciseBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ExerciseViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ExerciseViewHolder, position: Int) {
        val exercise = getItem(position)
        val isCurrentExercise = position == currentExerciseIndex
        val isCompleted = completedExercises.contains(exercise.id)

        holder.bind(exercise, isCurrentExercise, isCompleted)
    }

    fun setCurrentExerciseIndex(index: Int) {
        currentExerciseIndex = index
    }

    inner class ExerciseViewHolder(private val binding: ItemCardioExerciseBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(exercise: CardioExercise, isCurrentExercise: Boolean, isCompleted: Boolean) {
            binding.tvExerciseName.text = exercise.name
            binding.tvExerciseDescription.text = exercise.description
            binding.tvDuration.text = "${exercise.duration} sec"

            // Show completion status
            if (isCompleted) {
                binding.ivCompleted.visibility = View.VISIBLE
                completedExercises.add(exercise.id)
                onExerciseCompleted(exercise.id)
            } else {
                binding.ivCompleted.visibility = View.GONE
            }

            // Highlight current exercise
            if (isCurrentExercise) {
                binding.cardExercise.setCardBackgroundColor(0xFFE8F5E9.toInt()) // Light green
            } else {
                binding.cardExercise.setCardBackgroundColor(0xFFFFFFFF.toInt()) // White
            }
        }
    }

    class ExerciseDiffCallback : DiffUtil.ItemCallback<CardioExercise>() {
        override fun areItemsTheSame(oldItem: CardioExercise, newItem: CardioExercise): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: CardioExercise, newItem: CardioExercise): Boolean {
            return oldItem == newItem
        }
    }
}