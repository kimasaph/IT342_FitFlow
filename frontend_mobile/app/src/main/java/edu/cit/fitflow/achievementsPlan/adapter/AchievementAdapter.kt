package edu.cit.fitflow.achievementsPlan.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.R
import edu.cit.fitflow.achievementsPlan.model.Achievement

import java.text.SimpleDateFormat
import java.util.ArrayList
import java.util.Locale

class AchievementAdapter(
    private val context: Context,
    private val achievements: List<Achievement>
) : RecyclerView.Adapter<AchievementAdapter.AchievementViewHolder>() {

    private var filteredAchievements: MutableList<Achievement> = ArrayList(achievements)
    private var currentCategoryFilter = "All"
    private var currentStatusFilter = "All"

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AchievementViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_achievement, parent, false)
        return AchievementViewHolder(view)
    }

    override fun onBindViewHolder(holder: AchievementViewHolder, position: Int) {
        val achievement = filteredAchievements[position]

        // Set category
        val categoryResId = achievement.categoryId
        val category = context.getString(categoryResId)
        holder.tvCategory.text = category

        // Set achievement icon
        holder.ivAchievement.setImageResource(achievement.iconId)

        // Set title and description
        holder.tvTitle.text = achievement.title
        holder.tvDescription.text = achievement.description

        // Calculate and set progress
        val progress = calculateProgressPercentage(achievement)
        holder.progressBar.progress = progress

        // Set progress text
        val progressText = "${achievement.currentProgress}/${achievement.targetProgress}"
        holder.tvProgress.text = progressText

        // Set status text and color
        if (achievement.isUnlocked) {
            val dateFormat = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
            val unlockDate = achievement.dateUnlocked?.let { dateFormat.format(it) } ?: "Unknown date"
            holder.tvStatus.text = "Unlocked: $unlockDate"
            holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.green))
            holder.progressBar.progressTintList = ContextCompat.getColorStateList(context, R.color.green)
        } else {
            holder.tvStatus.text = "Locked"
            holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.dark_gray))
            holder.progressBar.progressTintList = ContextCompat.getColorStateList(context, R.color.blue)
        }
    }

    override fun getItemCount(): Int {
        return filteredAchievements.size
    }

    fun filterByCategory(category: String) {
        currentCategoryFilter = category
        applyFilters()
    }

    fun filterByStatus(status: String) {
        currentStatusFilter = status
        applyFilters()
    }

    private fun applyFilters() {
        filteredAchievements.clear()

        for (achievement in achievements) {
            val categoryResId = achievement.categoryId
            val matchesCategory = currentCategoryFilter == "All" ||
                    context.getString(categoryResId) == currentCategoryFilter

            val matchesStatus = currentStatusFilter == "All" ||
                    (currentStatusFilter == "Unlocked" && achievement.isUnlocked) ||
                    (currentStatusFilter == "Locked" && !achievement.isUnlocked)

            if (matchesCategory && matchesStatus) {
                filteredAchievements.add(achievement)
            }
        }

        notifyDataSetChanged()
    }

    // Helper function to calculate progress percentage
    private fun calculateProgressPercentage(achievement: Achievement): Int {
        return if (achievement.targetProgress > 0) {
            (achievement.currentProgress * 100) / achievement.targetProgress
        } else {
            0
        }
    }

    class AchievementViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvCategory: TextView = itemView.findViewById(R.id.tvCategory)
        val ivAchievement: ImageView = itemView.findViewById(R.id.ivAchievement)
        val tvTitle: TextView = itemView.findViewById(R.id.tvTitle)
        val tvDescription: TextView = itemView.findViewById(R.id.tvDescription)
        val progressBar: ProgressBar = itemView.findViewById(R.id.progressBar)
        val tvProgress: TextView = itemView.findViewById(R.id.tvProgress)
        val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
    }
    fun updateAchievements(newAchievements: List<Achievement>) {
        filteredAchievements = newAchievements.toMutableList()
        notifyDataSetChanged()
    }

}
