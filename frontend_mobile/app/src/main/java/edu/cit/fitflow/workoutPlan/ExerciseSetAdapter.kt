
package edu.cit.fitflow.workoutPlan

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.databinding.ItemExerciseSetBinding

class ExerciseSetAdapter(
    private val sets: List<ExerciseSet>,
    private val onSetCompleted: (setIndex: Int, updatedSet: ExerciseSet) -> Unit
) : RecyclerView.Adapter<ExerciseSetAdapter.SetViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SetViewHolder {
        val binding = ItemExerciseSetBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return SetViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SetViewHolder, position: Int) {
        holder.bind(sets[position], position)
    }

    override fun getItemCount(): Int = sets.size

    inner class SetViewHolder(private val binding: ItemExerciseSetBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(set: ExerciseSet, position: Int) {
            binding.tvSetNumber.text = (position + 1).toString()
            binding.etWeight.setText(set.weight.toString())
            binding.etReps.setText(set.reps.toString())
            binding.cbDone.isChecked = set.isCompleted

            binding.cbDone.setOnCheckedChangeListener { _, isChecked ->
                val updatedWeight = binding.etWeight.text.toString().toFloatOrNull() ?: 0f
                val updatedReps = binding.etReps.text.toString().toIntOrNull() ?: 0
                val updatedSet = ExerciseSet(
                    weight = updatedWeight,
                    reps = updatedReps,
                    isCompleted = isChecked
                )
                onSetCompleted(position, updatedSet)
            }
        }
    }
}