package edu.cit.fitflow.workoutPlan.cardioWorkout

import android.os.Bundle
import android.os.CountDownTimer
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.ActivityCardioWorkoutBinding
import java.util.Locale
import kotlin.compareTo
import kotlin.math.max
import kotlin.math.min
import kotlin.math.round
import kotlin.random.Random

class CardioWorkoutActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCardioWorkoutBinding
    private lateinit var viewModel: CardioWorkoutViewModel

    private var timer: CountDownTimer? = null
    private var isWorkoutActive = false
    private var currentExerciseIndex = 0
    private var completedExercises = mutableSetOf<String>()
    private var workoutComplete = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCardioWorkoutBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[CardioWorkoutViewModel::class.java]

        // Get intensity from intent
        val intensity = intent.getStringExtra("INTENSITY") ?: "medium"
        viewModel.setIntensity(intensity)

        setupIntensitySpinner()
        setupExerciseList()
        setupButtons()
        setupTabs()
        updateStats()

        // Initialize with the first exercise
        if (viewModel.filteredExercises.isNotEmpty()) {
            updateExerciseCountdown(viewModel.filteredExercises[0].duration)
        }

        // Add back button functionality
        binding.tvTitle.setOnClickListener {
            finish()
        }
    }

    private fun setupIntensitySpinner() {
        val intensities = arrayOf("Low Intensity", "Medium Intensity", "High Intensity")
        val adapter = ArrayAdapter(this, R.layout.item_spinner, intensities)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        binding.spinnerIntensity.adapter = adapter

        // Set initial selection based on viewModel
        when (viewModel.intensity) {
            "low" -> binding.spinnerIntensity.setSelection(0)
            "medium" -> binding.spinnerIntensity.setSelection(1)
            "high" -> binding.spinnerIntensity.setSelection(2)
        }

        binding.spinnerIntensity.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                val newIntensity = when (position) {
                    0 -> "low"
                    1 -> "medium"
                    else -> "high"
                }

                if (newIntensity != viewModel.intensity) {
                    handleIntensityChange(newIntensity)
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Do nothing
            }
        }
    }

    // Rest of the code remains the same...

    private fun setupExerciseList() {
        val adapter = CardioExerciseAdapter(
            onExerciseCompleted = { exerciseId ->
                completedExercises.add(exerciseId)
                updateProgress()
            }
        )
        binding.rvExercises.adapter = adapter
        adapter.submitList(viewModel.filteredExercises)
    }

    private fun setupButtons() {
        binding.btnPlay.setOnClickListener {
            if (isWorkoutActive) {
                pauseWorkout()
            } else {
                startWorkout()
            }
        }

        binding.btnReset.setOnClickListener {
            resetWorkout()
        }

        binding.btnResetWorkout.setOnClickListener {
            resetWorkout()
        }
    }

    private fun setupTabs() {
        binding.tabInstructions.setOnClickListener {
            showInstructions()
        }

        binding.tabWorkoutTips.setOnClickListener {
            showWorkoutTips()
        }

        binding.tabBenefits.setOnClickListener {
            showBenefits()
        }

        // Start with Instructions tab active
        showInstructions()
    }

    private fun showInstructions() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_selected)
        binding.tabWorkoutTips.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_unselected)

        binding.tvTabContent.text = getString(R.string.cardio_instructions)
    }

    private fun showWorkoutTips() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabWorkoutTips.setBackgroundResource(R.drawable.bg_tab_selected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_unselected)

        binding.tvTabContent.text = getString(R.string.cardio_workout_tips)
    }

    private fun showBenefits() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabWorkoutTips.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_selected)

        binding.tvTabContent.text = getString(R.string.cardio_benefits)
    }

    private fun startWorkout() {
        if (workoutComplete) {
            resetWorkout()
        }

        isWorkoutActive = true
        binding.btnPlay.setImageResource(R.drawable.ic_pause)

        startTimer()
    }

    private fun pauseWorkout() {
        isWorkoutActive = false
        binding.btnPlay.setImageResource(R.drawable.ic_play)

        timer?.cancel()
    }

    private fun resetWorkout() {
        pauseWorkout()
        currentExerciseIndex = 0
        workoutComplete = false

        // Reset exercise countdown for the first exercise
        if (viewModel.filteredExercises.isNotEmpty()) {
            updateExerciseCountdown(viewModel.filteredExercises[0].duration)
        }

        // Update UI
        updateExerciseUI()
        binding.progressExercise.progress = 0
    }

    private fun handleIntensityChange(newIntensity: String) {
        // Stop any ongoing workout
        pauseWorkout()

        // Update intensity in viewModel
        viewModel.setIntensity(newIntensity)

        // Reset workout state
        currentExerciseIndex = 0
        workoutComplete = false
        completedExercises.clear()

        // Update exercise list
        (binding.rvExercises.adapter as CardioExerciseAdapter).submitList(viewModel.filteredExercises)

        // Reset exercise countdown for the first exercise
        if (viewModel.filteredExercises.isNotEmpty()) {
            updateExerciseCountdown(viewModel.filteredExercises[0].duration)
        }

        // Update UI
        updateExerciseUI()
        updateProgress()
    }

    private fun startTimer() {
        timer?.cancel()

        val currentExercise = viewModel.filteredExercises.getOrNull(currentExerciseIndex) ?: return
        val remainingTime = viewModel.exerciseCountdown * 1000L

        timer = object : CountDownTimer(remainingTime, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val secondsRemaining = millisUntilFinished / 1000
                updateExerciseCountdown(secondsRemaining.toInt())

                // Update progress bar
                val progress = 100 - (secondsRemaining * 100 / currentExercise.duration)
                binding.progressExercise.progress = progress.toInt()

                // Update workout stats
                viewModel.incrementTotalTime()
                updateCaloriesBurned()
                updateHeartRate()
                updateStats()
            }

            override fun onFinish() {
                // Mark current exercise as completed
                val exerciseId = currentExercise.id
                if (!completedExercises.contains(exerciseId)) {
                    completedExercises.add(exerciseId)
                }

                // Move to next exercise or complete workout
                if (currentExerciseIndex < viewModel.filteredExercises.size - 1) {
                    currentExerciseIndex++
                    val nextExercise = viewModel.filteredExercises[currentExerciseIndex]
                    updateExerciseCountdown(nextExercise.duration)
                    updateExerciseUI()
                    startTimer()
                } else {
                    // Workout complete
                    workoutComplete = true
                    isWorkoutActive = false
                    binding.btnPlay.setImageResource(R.drawable.ic_play)
                    viewModel.incrementCompletedWorkouts()
                    updateStats()
                }

                updateProgress()
            }
        }

        timer?.start()
    }

    private fun updateExerciseCountdown(seconds: Int) {
        viewModel.exerciseCountdown = seconds
        val formattedTime = formatTime(seconds)
        binding.tvTimer.text = formattedTime
    }

    private fun updateExerciseUI() {
        val adapter = binding.rvExercises.adapter as CardioExerciseAdapter
        adapter.setCurrentExerciseIndex(currentExerciseIndex)
        adapter.notifyDataSetChanged()

        // Scroll to current exercise
        binding.rvExercises.smoothScrollToPosition(currentExerciseIndex)
    }

    private fun updateCaloriesBurned() {
        val currentExercise = viewModel.filteredExercises.getOrNull(currentExerciseIndex) ?: return
        val caloriesPerSecond = currentExercise.caloriesPerMinute[viewModel.intensity]!! / 60.0
        viewModel.incrementCaloriesBurned(caloriesPerSecond)
    }

    private fun updateHeartRate() {
        val intensityFactor = when (viewModel.intensity) {
            "low" -> 1.0
            "medium" -> 1.5
            else -> 2.0
        }

        val randomChange = Random.nextDouble(-1.0, 1.0) * 3
        val newRate = viewModel.heartRate + randomChange * intensityFactor
        viewModel.heartRate = min(max(round(newRate).toInt(), 70), 180)
    }

    private fun updateProgress() {
        val totalExercises = viewModel.filteredExercises.size
        val completedCount = completedExercises.count { id ->
            viewModel.filteredExercises.any { it.id == id }
        }

        val progress = if (totalExercises > 0) {
            (completedCount.toFloat() / totalExercises.toFloat() * 100).toInt()
        } else {
            0
        }

        viewModel.overallProgress = progress
        updateStats()
    }


    private fun updateStats() {

        // Update top stats
        binding.tvTotalCalories.text = String.format("%.1f", viewModel.totalCaloriesBurned)
        binding.tvTotalTime.text = formatTotalTime(viewModel.totalTime)
        binding.tvCompletedWorkouts.text = viewModel.completedWorkouts.toString()

        // Update workout stats
        binding.tvCaloriesBurned.text = String.format("%.1f kcal", viewModel.caloriesBurned)
        binding.progressCalories.progress = min((viewModel.caloriesBurned / 100.0 * 100).toInt(), 100)

        binding.tvHeartRate.text = "${viewModel.heartRate} BPM"
        binding.progressHeartRate.progress = min((viewModel.heartRate - 60) * 100 / 140, 100)

        binding.tvOverallProgress.text = "${viewModel.overallProgress}%"
        binding.progressOverall.progress = viewModel.overallProgress

        // Update exercise count
        val currentPosition = currentExerciseIndex + 1
        val total = viewModel.filteredExercises.size
        binding.tvExerciseCount.text = "$currentPosition of $total exercises"
    }

    private fun formatTime(seconds: Int): String {
        val mins = seconds / 60
        val secs = seconds % 60
        return String.format(Locale.getDefault(), "%02d:%02d", mins, secs)
    }

    private fun formatTotalTime(seconds: Int): String {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        return "${hours}h ${minutes}m"
    }

    override fun onDestroy() {
        super.onDestroy()
        timer?.cancel()
    }
}