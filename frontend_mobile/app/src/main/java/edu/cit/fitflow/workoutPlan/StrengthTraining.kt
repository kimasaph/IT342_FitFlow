package edu.cit.fitflow.workoutPlan

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.google.android.material.tabs.TabLayoutMediator
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.ActivityStrengthTrainingBinding

class StrengthTraining : AppCompatActivity() {

    private lateinit var binding: ActivityStrengthTrainingBinding
    private val TAB_CURRENT_WORKOUT = 0
    private val TAB_EXERCISES = 1
    private val TAB_HISTORY = 2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStrengthTrainingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupViews()
    }

    private fun setupViews() {
        // Setup ViewPager with tabs
        val pagerAdapter = WorkoutPagerAdapter(this)
        binding.viewPager.adapter = pagerAdapter
        binding.viewPager.isUserInputEnabled = true // Allow swiping between tabs

        // Connect TabLayout with ViewPager2
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            tab.text = when (position) {
                TAB_CURRENT_WORKOUT -> getString(R.string.current_workout)
                TAB_EXERCISES -> getString(R.string.exercises)
                TAB_HISTORY -> getString(R.string.history)
                else -> null
            }
        }.attach()

        // Setup back button
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
    }

    fun navigateToExercisesTab() {
        binding.viewPager.currentItem = TAB_EXERCISES
    }

    fun navigateToCurrentWorkoutTab() {
        binding.viewPager.currentItem = TAB_CURRENT_WORKOUT
    }

    fun navigateToHistoryTab() {
        binding.viewPager.currentItem = TAB_HISTORY
    }

    private inner class WorkoutPagerAdapter(fa: FragmentActivity) : FragmentStateAdapter(fa) {
        override fun getItemCount(): Int = 3

        override fun createFragment(position: Int): Fragment {
            return when (position) {
                TAB_CURRENT_WORKOUT -> CurrentWorkoutFragment()
                TAB_EXERCISES -> ExercisesFragment()
                TAB_HISTORY -> HistoryFragment()
                else -> throw IllegalArgumentException("Invalid position $position")
            }
        }
    }

}