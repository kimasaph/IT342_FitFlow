package edu.cit.fitflow.workoutPlan

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.databinding.ItemExerciseBinding

class ExerciseListAdapter(
    private val onAddExercise: (Exercise) -> Unit,
    private val onViewDetails: (Exercise) -> Unit
) : ListAdapter<Exercise, ExerciseListAdapter.ExerciseViewHolder>(ExerciseDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExerciseViewHolder {
        val binding = ItemExerciseBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ExerciseViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ExerciseViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ExerciseViewHolder(private val binding: ItemExerciseBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(exercise: Exercise) {
            binding.tvExerciseName.text = exercise.name
            binding.tvMuscleGroup.text = exercise.targetMuscle
            binding.tvDifficulty.text = exercise.difficulty

            // Set image if available
            if (exercise.imageResId != 0) {
                binding.ivExercise.setImageResource(exercise.imageResId)
            }

            // Hide completed tag for exercise selection
            binding.tvCompletedTag.visibility = ViewGroup.GONE

            // Set click listeners
            binding.btnAdd.setOnClickListener {
                onAddExercise(exercise)
            }

            binding.btnViewDetails.setOnClickListener {
                onViewDetails(exercise)
            }
        }
    }

    class ExerciseDiffCallback : DiffUtil.ItemCallback<Exercise>() {
        override fun areItemsTheSame(oldItem: Exercise, newItem: Exercise): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Exercise, newItem: Exercise): Boolean {
            return oldItem == newItem
        }
    }
}