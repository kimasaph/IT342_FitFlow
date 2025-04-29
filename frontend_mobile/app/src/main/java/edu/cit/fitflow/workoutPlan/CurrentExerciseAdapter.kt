package edu.cit.fitflow.workoutPlan

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.databinding.ItemCurrentExerciseBinding

class CurrentExerciseAdapter(
    private val onSetCompleted: (exerciseIndex: Int, setIndex: Int, updatedSet: ExerciseSet) -> Unit,
    private val onAddSet: (exerciseIndex: Int) -> Unit,
    private val onRemoveExercise: (exerciseIndex: Int) -> Unit
) : ListAdapter<Exercise, CurrentExerciseAdapter.ExerciseViewHolder>(ExerciseDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExerciseViewHolder {
        val binding = ItemCurrentExerciseBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ExerciseViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ExerciseViewHolder, position: Int) {
        holder.bind(getItem(position), position)
    }

    inner class ExerciseViewHolder(private val binding: ItemCurrentExerciseBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(exercise: Exercise, position: Int) {
            binding.tvExerciseName.text = exercise.name
            binding.tvMuscleGroup.text = exercise.targetMuscle
            binding.tvDifficulty.text = exercise.difficulty

            val caloriesPerSet = when {
                exercise.name.contains("cardio", ignoreCase = true) -> 15
                exercise.name.contains("hiit", ignoreCase = true) -> 20
                else -> 10
            }
            val totalCalories = caloriesPerSet * exercise.sets.size
            binding.tvExerciseCalories.text = "$totalCalories cal"

            val setsAdapter = ExerciseSetAdapter(
                sets = exercise.sets,
                onSetCompleted = { setIndex, updatedSet ->
                    onSetCompleted(position, setIndex, updatedSet)
                }
            )

            binding.rvSets.apply {
                layoutManager = LinearLayoutManager(context)
                adapter = setsAdapter
            }

            binding.btnDeleteExercise.setOnClickListener {
                onRemoveExercise(position)
            }

            binding.btnAddSet.setOnClickListener {
                onAddSet(position)
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