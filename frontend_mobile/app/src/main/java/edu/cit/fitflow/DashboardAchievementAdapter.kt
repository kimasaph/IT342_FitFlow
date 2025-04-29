// DashboardAchievementAdapter.kt
package edu.cit.fitflow.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.R
import edu.cit.fitflow.achievementsPlan.model.Achievement
import edu.cit.fitflow.databinding.ItemDashboardAchievementBinding

class DashboardAchievementAdapter(
    private val context: Context,
    private val achievements: List<Achievement>
) : RecyclerView.Adapter<DashboardAchievementAdapter.AchievementViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AchievementViewHolder {
        val binding = ItemDashboardAchievementBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return AchievementViewHolder(binding)
    }

    override fun onBindViewHolder(holder: AchievementViewHolder, position: Int) {
        val achievement = achievements[position]
        holder.bind(achievement)
    }

    override fun getItemCount(): Int = achievements.size

    inner class AchievementViewHolder(private val binding: ItemDashboardAchievementBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(achievement: Achievement) {
            binding.tvAchievementTitle.text = achievement.title
            binding.tvAchievementDesc.text = achievement.description
            binding.ivAchievementIcon.setImageResource(achievement.iconId)
        }
    }
}
