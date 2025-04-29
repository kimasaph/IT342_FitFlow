package edu.cit.fitflow.workoutPlan

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.ViewModelProvider
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import edu.cit.fitflow.R

class WorkoutActivity : AppCompatActivity() {
    private lateinit var viewPager: ViewPager2
    private lateinit var tabLayout: TabLayout
    private lateinit var workoutViewModel: WorkoutViewModel

    companion object {
        const val TAB_CURRENT_WORKOUT = 0
        const val TAB_EXERCISES = 1
        const val TAB_HISTORY = 2
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_workout)

        // Initialize ViewModel
        workoutViewModel = ViewModelProvider(this)[WorkoutViewModel::class.java]

        // Get userId from SharedPreferences
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("userId", -1)

        // Set the current user in WorkoutViewModel
        if (userId != -1) {
            //workoutViewModel.setCurrentUser(userId.toString())
            Log.d("WorkoutActivity", "Set current user ID: $userId")
        } else {
            Log.e("WorkoutActivity", "No user ID found in SharedPreferences")
        }

        // Set up ViewPager and TabLayout
        viewPager = findViewById(R.id.viewPager)
        tabLayout = findViewById(R.id.tabLayout)

        viewPager.adapter = WorkoutPagerAdapter(this)

        // Connect TabLayout with ViewPager2
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = when (position) {
                TAB_CURRENT_WORKOUT -> "Current"
                TAB_EXERCISES -> "Exercises"
                TAB_HISTORY -> "History"
                else -> null
            }
        }.attach()
    }

    fun navigateToCurrentWorkoutTab() {
        viewPager.currentItem = TAB_CURRENT_WORKOUT
    }

    fun navigateToHistoryTab() {
        viewPager.currentItem = TAB_HISTORY
    }

    private inner class WorkoutPagerAdapter(fa: FragmentActivity) : FragmentStateAdapter(fa) {
        override fun getItemCount(): Int = 3

        override fun createFragment(position: Int): Fragment {
            return when (position) {
                TAB_CURRENT_WORKOUT -> CurrentWorkoutFragment()
                TAB_EXERCISES -> ExercisesFragment()
                TAB_HISTORY -> {
                    Log.d("WorkoutActivity", "Creating HistoryFragment")
                    HistoryFragment()
                }
                else -> throw IllegalArgumentException("Invalid position $position")
            }
        }
    }
}