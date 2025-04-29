package edu.cit.fitflow.workoutPlan

import android.os.Bundle
import android.os.CountDownTimer
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.FragmentCurrentWorkoutBinding
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class CurrentWorkoutFragment : Fragment() {
    private var _binding: FragmentCurrentWorkoutBinding? = null
    private val binding get() = _binding!!

    private val viewModel: WorkoutViewModel by activityViewModels()
    private lateinit var exerciseAdapter: CurrentExerciseAdapter

    private var timer: CountDownTimer? = null
    private var timerRunning = false
    private var timeRemaining = 0L

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCurrentWorkoutBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupTimerButtons()

        // Start a new workout if there isn't one active
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.activeWorkout.collectLatest { workout ->
                if (workout == null) {
                    viewModel.startNewWorkout()
                } else {
                    // Update UI with workout data
                    updateWorkoutUI(workout)
                }
            }
        }

        // Set up button click listeners
        binding.btnAddExercise.setOnClickListener {
            // Navigate to exercise selection or show dialog
            showExerciseSelectionDialog()
        }

        binding.btnCompleteWorkout.setOnClickListener {
            viewModel.completeWorkout()
            Toast.makeText(requireContext(), "Workout completed!", Toast.LENGTH_SHORT).show()

            // Navigate to History tab
            (activity as? WorkoutActivity)?.navigateToHistoryTab()
        }
    }

    private fun setupRecyclerView() {
        exerciseAdapter = CurrentExerciseAdapter(
            onSetCompleted = { exerciseIndex, setIndex, updatedSet ->
                viewLifecycleOwner.lifecycleScope.launch {
                    viewModel.updateSet(exerciseIndex, setIndex, updatedSet)
                    updateProgress()
                    viewModel.activeWorkout.value?.let { workout ->
                        val calories = viewModel.calculateCaloriesBurned(workout)
                        binding.tvCaloriesBurned.text = "$calories"
                    }
                }
            },
            onAddSet = { exerciseIndex ->
                viewLifecycleOwner.lifecycleScope.launch {
                    val workout = viewModel.activeWorkout.value ?: return@launch
                    if (exerciseIndex < workout.exercises.size) {
                        val newSet = ExerciseSet(weight = 0f, reps = 0, isCompleted = false)
                        viewModel.addSetToExercise(exerciseIndex, newSet)
                    }
                }
            },
            onRemoveExercise = { exerciseIndex ->
                viewModel.removeExerciseFromWorkout(exerciseIndex)
            }
        )

        binding.rvExercises.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = exerciseAdapter
        }
    }

    private fun setupTimerButtons() {
        binding.btn30Sec.setOnClickListener { setTimer(30) }
        binding.btn1Min.setOnClickListener { setTimer(60) }
        binding.btn1Min30Sec.setOnClickListener { setTimer(90) }
        binding.btn2Min.setOnClickListener { setTimer(120) }

        binding.fabTimer.setOnClickListener {
            if (timerRunning) {
                pauseTimer()
            } else {
                startTimer()
            }
        }
    }

    private fun setTimer(seconds: Int) {
        cancelTimer()
        timeRemaining = seconds * 1000L
        updateTimerDisplay(timeRemaining)
    }

    private fun startTimer() {
        if (timeRemaining <= 0) {
            setTimer(60) // Default to 1 minute if no time set
        }

        timer = object : CountDownTimer(timeRemaining, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                timeRemaining = millisUntilFinished
                updateTimerDisplay(millisUntilFinished)
            }

            override fun onFinish() {
                timerRunning = false
                timeRemaining = 0
                updateTimerDisplay(0)
                binding.ivTimerIcon.setImageResource(R.drawable.ic_timer)
                Toast.makeText(requireContext(), "Rest time complete!", Toast.LENGTH_SHORT).show()
            }
        }.start()

        timerRunning = true
        binding.ivTimerIcon.setImageResource(R.drawable.ic_pause)
    }

    private fun pauseTimer() {
        timer?.cancel()
        timerRunning = false
        binding.ivTimerIcon.setImageResource(R.drawable.ic_timer)
    }

    private fun cancelTimer() {
        timer?.cancel()
        timerRunning = false
        binding.ivTimerIcon.setImageResource(R.drawable.ic_timer)
    }

    private fun updateTimerDisplay(milliseconds: Long) {
        val minutes = (milliseconds / 1000) / 60
        val seconds = (milliseconds / 1000) % 60
        binding.tvTimer.text = String.format("%02d:%02d", minutes, seconds)
    }

    private fun updateWorkoutUI(workout: ActiveWorkout) {
        // Update workout title
        binding.tvWorkoutTitle.text = workout.name

        // Update workout info (date and exercise count)
        val dateFormat = SimpleDateFormat("MM/dd/yyyy", Locale.getDefault())
        val date = dateFormat.format(Date(workout.startTime))
        val exerciseCount = workout.exercises.size
        binding.tvWorkoutInfo.text = "$date • $exerciseCount exercises"

        // Update calories
        val calories = viewModel.calculateCaloriesBurned(workout)
        binding.tvCaloriesBurned.text = "$calories"
        exerciseAdapter.submitList(workout.exercises)
        updateProgress()


        // Update exercise list
        exerciseAdapter.submitList(workout.exercises)

        // Update progress
        updateProgress()
    }

    private fun updateProgress() {
        viewLifecycleOwner.lifecycleScope.launch {
            val workout = viewModel.activeWorkout.value ?: return@launch

            var totalSets = 0
            var completedSets = 0

            for (exercise in workout.exercises) {
                totalSets += exercise.sets.size
                completedSets += exercise.sets.count { it.isCompleted }
            }

            val progress = if (totalSets > 0) {
                (completedSets.toFloat() / totalSets.toFloat() * 100).toInt()
            } else {
                100
            }

            binding.progressBar.progress = progress
            binding.tvProgressPercentage.text = "$progress%"
        }
    }

    private fun showExerciseSelectionDialog() {
        // For demo purposes, add a sample exercise
        val exercise = Exercise(
            id = System.currentTimeMillis().toString(),
            name = "Bench Press",
            targetMuscle = "Chest",
            difficulty = "Intermediate",
            imageResId = 0,
            isCompleted = false,
            sets = listOf(
                ExerciseSet(
                    weight = 135f,
                    reps = 10,
                    isCompleted = false
                )
            )
        )
        viewModel.addExerciseToWorkout(exercise)

        // In a real app, you would show a dialog or navigate to an exercise selection screen
        Toast.makeText(requireContext(), "Added Bench Press", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        cancelTimer()
        _binding = null
    }
}