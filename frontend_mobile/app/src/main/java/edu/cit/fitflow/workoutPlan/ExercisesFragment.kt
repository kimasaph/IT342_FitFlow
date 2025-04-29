package edu.cit.fitflow.workoutPlan

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.widget.SearchView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.FragmentExerciseBinding

class ExercisesFragment : Fragment() {
    private var _binding: FragmentExerciseBinding? = null
    private val binding get() = _binding!!

    private val viewModel: WorkoutViewModel by activityViewModels()
    private lateinit var exerciseAdapter: ExerciseListAdapter

    // Sample exercise database - in a real app, this would come from a database or API
    private val exerciseDatabase = listOf(
        Exercise(
            id = "1",
            name = "Bench Press",
            targetMuscle = "Chest",
            difficulty = "Intermediate",
            imageResId = R.drawable.exercise_bench_press,
            isCompleted = false,
            sets = emptyList()
        ),
        Exercise(
            id = "2",
            name = "Squat",
            targetMuscle = "Legs",
            difficulty = "Intermediate",
            imageResId = R.drawable.exercise_squat,
            isCompleted = false,
            sets = emptyList()
        ),
        Exercise(
            id = "3",
            name = "Deadlift",
            targetMuscle = "Back",
            difficulty = "Advanced",
            imageResId = R.drawable.exercise_deadlift,
            isCompleted = false,
            sets = emptyList()
        ),
        Exercise(
            id = "4",
            name = "Pull-up",
            targetMuscle = "Back",
            difficulty = "Intermediate",
            imageResId = R.drawable.exercise_pull_up,
            isCompleted = false,
            sets = emptyList()
        ),
        Exercise(
            id = "5",
            name = "Push-up",
            targetMuscle = "Chest",
            difficulty = "Beginner",
            imageResId = R.drawable.exercise_push_up,
            isCompleted = false,
            sets = emptyList()
        ),

        Exercise(
            id = "7",
            name = "Bicep Curl",
            targetMuscle = "Arms",
            difficulty = "Beginner",
            imageResId = R.drawable.exercise_bicep_curl,
            isCompleted = false,
            sets = emptyList()
        ),
    )

    private var filteredExercises = listOf<Exercise>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentExerciseBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupSearchView()
        setupFilterButtons()

        // Initialize with all exercises
        filteredExercises = exerciseDatabase
        exerciseAdapter.submitList(filteredExercises)
    }

    private fun setupRecyclerView() {
        exerciseAdapter = ExerciseListAdapter(
            onAddExercise = { exercise ->
                // Add the selected exercise to the current workout with a default set
                val exerciseWithSet = exercise.copy(
                    sets = listOf(
                        ExerciseSet(
                            weight = 0f,
                            reps = 0,
                            isCompleted = false
                        )
                    )
                )
                viewModel.addExerciseToWorkout(exerciseWithSet)
                Toast.makeText(
                    requireContext(),
                    "Added ${exercise.name} to workout",
                    Toast.LENGTH_SHORT
                ).show()

                // Optionally navigate to the Current Workout tab
                (activity as? WorkoutActivity)?.navigateToCurrentWorkoutTab()
            },
            onViewDetails = { exercise ->
                // Show exercise details (could navigate to a detail screen)
                Toast.makeText(
                    requireContext(),
                    "View details for ${exercise.name}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        )

        binding.rvExercises.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = exerciseAdapter
        }
    }

    private fun setupSearchView() {
        binding.searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                filterExercises(query)
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filterExercises(newText)
                return true
            }
        })
    }

    private fun setupFilterButtons() {
        // Set up muscle group filter buttons
        binding.chipAll.setOnClickListener { filterByMuscleGroup(null) }
        binding.chipChest.setOnClickListener { filterByMuscleGroup("Chest") }
        binding.chipBack.setOnClickListener { filterByMuscleGroup("Back") }
        binding.chipLegs.setOnClickListener { filterByMuscleGroup("Legs") }
        binding.chipArms.setOnClickListener { filterByMuscleGroup("Arms") }
        binding.chipShoulders.setOnClickListener { filterByMuscleGroup("Shoulders") }

        // Set up difficulty filter buttons
        binding.chipBeginner.setOnClickListener { filterByDifficulty("Beginner") }
        binding.chipIntermediate.setOnClickListener { filterByDifficulty("Intermediate") }
        binding.chipAdvanced.setOnClickListener { filterByDifficulty("Advanced") }
    }

    private fun filterExercises(query: String?) {
        if (query.isNullOrBlank()) {
            filteredExercises = exerciseDatabase
        } else {
            filteredExercises = exerciseDatabase.filter {
                it.name.contains(query, ignoreCase = true) ||
                        it.targetMuscle.contains(query, ignoreCase = true)
            }
        }
        exerciseAdapter.submitList(filteredExercises)
    }

    private fun filterByMuscleGroup(muscleGroup: String?) {
        filteredExercises = if (muscleGroup == null) {
            exerciseDatabase
        } else {
            exerciseDatabase.filter { it.targetMuscle == muscleGroup }
        }
        exerciseAdapter.submitList(filteredExercises)
    }

    private fun filterByDifficulty(difficulty: String) {
        filteredExercises = exerciseDatabase.filter { it.difficulty == difficulty }
        exerciseAdapter.submitList(filteredExercises)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}