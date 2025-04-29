package edu.cit.fitflow.goalPlan

import android.os.Bundle
import android.widget.Button
import android.widget.ViewFlipper
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import edu.cit.fitflow.R

class GoalsActivity : AppCompatActivity() {
    private lateinit var viewFlipper: ViewFlipper
    private lateinit var achievementsTab: Button
    private lateinit var streaksTab: Button
    private lateinit var categoryChipGroup: ChipGroup
    private lateinit var statusChipGroup: ChipGroup

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_goals)

        // Initialize views
        viewFlipper = findViewById(R.id.view_flipper)
        achievementsTab = findViewById(R.id.achievements_tab)
        streaksTab = findViewById(R.id.streaks_tab)
        categoryChipGroup = findViewById(R.id.category_chip_group)
        statusChipGroup = findViewById(R.id.status_chip_group)

        // Set up tab buttons
        achievementsTab.setOnClickListener {
            viewFlipper.displayedChild = 0
            updateTabSelection(true)
        }

        streaksTab.setOnClickListener {
            viewFlipper.displayedChild = 1
            updateTabSelection(false)
        }

        // Set default tab
        updateTabSelection(true)

        // Set up category filter
        categoryChipGroup.setOnCheckedChangeListener { _, _ ->
            // Filter achievements by category
            filterAchievements()
        }

        // Set up status filter
        statusChipGroup.setOnCheckedChangeListener { _, _ ->
            // Filter achievements by status
            filterAchievements()
        }
    }

    private fun updateTabSelection(achievementsSelected: Boolean) {
        if (achievementsSelected) {
            achievementsTab.setTextColor(resources.getColor(R.color.black, theme))
            achievementsTab.alpha = 1.0f
            streaksTab.setTextColor(resources.getColor(R.color.darker_gray, theme))
            streaksTab.alpha = 0.7f
        } else {
            achievementsTab.setTextColor(resources.getColor(R.color.darker_gray, theme))
            achievementsTab.alpha = 0.7f
            streaksTab.setTextColor(resources.getColor(R.color.black, theme))
            streaksTab.alpha = 1.0f
        }
    }

    private fun filterAchievements() {
        // Get selected category
        val categoryId = categoryChipGroup.checkedChipId
        val selectedCategory = findViewById<Chip>(categoryId)
        val category = selectedCategory?.text?.toString() ?: "All"

        // Get selected status
        val statusId = statusChipGroup.checkedChipId
        val selectedStatus = findViewById<Chip>(statusId)
        val status = selectedStatus?.text?.toString() ?: "All"

        // In a real app, you would filter the achievements based on category and status
        // For this example, we'll just show a message
        println("Filtering achievements - Category: $category, Status: $status")
    }
}