package edu.cit.fitflow

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import edu.cit.fitflow.databinding.ActivityMainBinding
import com.google.android.material.tabs.TabLayoutMediator
import edu.cit.fitflow.databinding.ActivityStrengthTrainingBinding

class StrengthTraining : AppCompatActivity() {

    private lateinit var binding: ActivityStrengthTrainingBinding

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

        // Connect TabLayout with ViewPager2
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            tab.text = when (position) {
                0 -> getString(edu.cit.fitflow.R.string.current_workout)
                1 -> getString(edu.cit.fitflow.R.string.exercises)
                2 -> getString(edu.cit.fitflow.R.string.history)
                else -> null
            }
        }.attach()

        // Setup back button
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
    }

    private inner class WorkoutPagerAdapter(fa: FragmentActivity) : FragmentStateAdapter(fa) {
        override fun getItemCount(): Int = 3

        override fun createFragment(position: Int): Fragment {
            return when (position) {
                0 -> CurrentWorkoutFragment()
                1 -> ExercisesFragment()
                2 -> HistoryFragment()
                else -> throw IllegalArgumentException("Invalid position $position")
            }
        }
    }
}