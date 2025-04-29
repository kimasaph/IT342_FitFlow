package edu.cit.fitflow.progress.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.R
import edu.cit.fitflow.progress.model.RecentActivity
import java.text.SimpleDateFormat
import java.util.*

class RecentActivityAdapter(private val activities: List<RecentActivity>) :
    RecyclerView.Adapter<RecentActivityAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val icon: ImageView = view.findViewById(R.id.ivActivityIcon)
        val title: TextView = view.findViewById(R.id.tvActivityTitle)
        val time: TextView = view.findViewById(R.id.tvActivityTime)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_recent_activity, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val activity = activities[position]

        // Set icon background
        holder.icon.setBackgroundResource(activity.iconBackground)

        // Set title (combine title and description since we only have one title field)
        holder.title.text = activity.title

        // Format and set date
        val today = Calendar.getInstance()
        val activityDate = Calendar.getInstance().apply { time = activity.date }

        val dateText = when {
            isSameDay(today, activityDate) -> {
                // Today
                "Today, ${formatTime(activity.date)}"
            }
            isYesterday(today, activityDate) -> {
                // Yesterday
                "Yesterday, ${formatTime(activity.date)}"
            }
            else -> {
                // Other days
                formatDate(activity.date)
            }
        }

        holder.time.text = dateText
    }

    override fun getItemCount() = activities.size

    private fun formatTime(date: Date): String {
        val format = SimpleDateFormat("h:mm a", Locale.getDefault())
        return format.format(date)
    }

    private fun formatDate(date: Date): String {
        val format = SimpleDateFormat("MMM d, h:mm a", Locale.getDefault())
        return format.format(date)
    }

    private fun isSameDay(cal1: Calendar, cal2: Calendar): Boolean {
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR)
    }

    private fun isYesterday(today: Calendar, other: Calendar): Boolean {
        val yesterday = Calendar.getInstance().apply {
            timeInMillis = today.timeInMillis
            add(Calendar.DAY_OF_YEAR, -1)
        }
        return isSameDay(yesterday, other)
    }
}