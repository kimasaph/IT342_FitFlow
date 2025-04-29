package edu.cit.fitflow.workoutPlan.yogaWorkout

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.databinding.ItemYogaPoseBinding

class YogaPoseAdapter(
    private val onPoseCompleted: (String) -> Unit
) : ListAdapter<YogaPose, YogaPoseAdapter.PoseViewHolder>(PoseDiffCallback()) {

    private var currentPoseIndex = 0
    private val completedPoses = mutableSetOf<String>()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PoseViewHolder {
        val binding = ItemYogaPoseBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return PoseViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PoseViewHolder, position: Int) {
        val pose = getItem(position)
        val isCurrentPose = position == currentPoseIndex
        val isCompleted = completedPoses.contains(pose.id)

        holder.bind(pose, isCurrentPose, isCompleted)
    }

    fun setCurrentPoseIndex(index: Int) {
        currentPoseIndex = index
    }

    inner class PoseViewHolder(private val binding: ItemYogaPoseBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(pose: YogaPose, isCurrentPose: Boolean, isCompleted: Boolean) {
            binding.tvPoseName.text = pose.name
            binding.tvDuration.text = formatDuration(pose.duration)

            // Show completion status
            if (isCompleted) {
                binding.ivCompleted.visibility = View.VISIBLE
                completedPoses.add(pose.id)
                onPoseCompleted(pose.id)
            } else {
                binding.ivCompleted.visibility = View.GONE
            }

            // Highlight current pose
            if (isCurrentPose) {
                binding.cardPose.setCardBackgroundColor(0xFFE3F2FD.toInt()) // Light blue
            } else {
                binding.cardPose.setCardBackgroundColor(0xFFFFFFFF.toInt()) // White
            }
        }

        private fun formatDuration(seconds: Int): String {
            val mins = seconds / 60
            val secs = seconds % 60
            return String.format("%02d:%02d", mins, secs)
        }
    }

    class PoseDiffCallback : DiffUtil.ItemCallback<YogaPose>() {
        override fun areItemsTheSame(oldItem: YogaPose, newItem: YogaPose): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: YogaPose, newItem: YogaPose): Boolean {
            return oldItem == newItem
        }
    }
}