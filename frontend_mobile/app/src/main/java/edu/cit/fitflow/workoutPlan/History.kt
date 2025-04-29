package edu.cit.fitflow.workoutPlan

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.FragmentHistoryBinding
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class HistoryFragment : Fragment() {

    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!
    private val viewModel: WorkoutViewModel by activityViewModels()
    private lateinit var workoutHistoryAdapter: WorkoutHistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        observeWorkoutHistory()

        // Always load from SharedPreferences when entering history
        viewModel.loadWorkoutHistory()

    }

    private fun setupRecyclerView() {
        workoutHistoryAdapter = WorkoutHistoryAdapter()
        binding.rvWorkoutHistory.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = workoutHistoryAdapter
        }
    }

    private fun observeWorkoutHistory() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.workoutHistory.collectLatest { history ->
                if (history.isEmpty()) showEmptyState()
                else showWorkoutHistory(history)
            }
        }
    }

    private fun showEmptyState() {
        binding.emptyStateLayout.visibility = View.VISIBLE
        binding.historyContentLayout.visibility = View.GONE
    }

    private fun showWorkoutHistory(history: List<ActiveWorkout>) {
        binding.emptyStateLayout.visibility = View.GONE
        binding.historyContentLayout.visibility = View.VISIBLE
        updateSummaryStats(history)
        workoutHistoryAdapter.submitList(history)
    }

    private fun updateSummaryStats(history: List<ActiveWorkout>) {
        val completedWorkouts = history.filter { workout ->
            workout.exercises.any { exercise -> exercise.sets.any { it.isCompleted } }
        }
        binding.tvTotalWorkouts.text = completedWorkouts.size.toString()

        var totalSets = 0
        var totalCalories = 0
        val muscleGroups = mutableSetOf<String>()

        completedWorkouts.forEach { workout ->
            workout.exercises.forEach { exercise ->
                muscleGroups.add(exercise.targetMuscle)
                exercise.sets.forEach { set ->
                    if (set.isCompleted) {
                        totalSets++
                        totalCalories += (set.weight * set.reps * 0.1).toInt()
                    }
                }
            }
        }

        binding.tvTotalSets.text = totalSets.toString()
        binding.tvCaloriesBurned.text = totalCalories.toString()
        updateMuscleGroupTags(muscleGroups)
    }

    private fun updateMuscleGroupTags(muscleGroups: Set<String>) {
        binding.muscleGroupsContainer.removeAllViews()
        muscleGroups.forEach { group ->
            val tagView = layoutInflater.inflate(R.layout.item_muscle_group_tag, binding.muscleGroupsContainer, false)
            val tagText = tagView.findViewById<TextView>(R.id.tvMuscleGroupTag)
            tagText.text = group
            binding.muscleGroupsContainer.addView(tagView)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
