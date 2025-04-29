package edu.cit.fitflow.workoutPlan.yogaWorkout

import android.os.Bundle
import android.os.CountDownTimer
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import edu.cit.fitflow.R
import edu.cit.fitflow.databinding.ActivityYogaWorkoutBinding
import java.util.Locale

class YogaWorkoutActivity : AppCompatActivity() {
    private lateinit var binding: ActivityYogaWorkoutBinding
    private lateinit var viewModel: YogaWorkoutViewModel

    private var timer: CountDownTimer? = null
    private var isWorkoutActive = false
    private var currentPoseIndex = 0
    private var completedPoses = mutableSetOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityYogaWorkoutBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[YogaWorkoutViewModel::class.java]

        // Get difficulty from intent
        val difficulty = intent.getStringExtra("DIFFICULTY") ?: "beginner"
        viewModel.setDifficulty(difficulty)

        setupDifficultySpinner()
        setupPosesList()
        setupButtons()
        setupTabs()
        updateCurrentPose()

        // Add back button functionality
        binding.backButton.setOnClickListener {
            finish()
        }
    }

    private fun setupDifficultySpinner() {
        val difficulties = arrayOf("Beginner", "Intermediate", "Advanced")
        val adapter = ArrayAdapter(this, R.layout.item_spinner, difficulties)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        binding.spinnerDifficulty.adapter = adapter

        // Set initial selection based on viewModel
        when (viewModel.difficulty) {
            "beginner" -> binding.spinnerDifficulty.setSelection(0)
            "intermediate" -> binding.spinnerDifficulty.setSelection(1)
            "advanced" -> binding.spinnerDifficulty.setSelection(2)
        }

        binding.spinnerDifficulty.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                val newDifficulty = when (position) {
                    0 -> "beginner"
                    1 -> "intermediate"
                    else -> "advanced"
                }

                if (newDifficulty != viewModel.difficulty) {
                    handleDifficultyChange(newDifficulty)
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Do nothing
            }
        }
    }

    private fun setupPosesList() {
        val adapter = YogaPoseAdapter(
            onPoseCompleted = { poseId ->
                completedPoses.add(poseId)
                updateProgress()
            }
        )
        binding.rvPoses.adapter = adapter
        adapter.submitList(viewModel.filteredPoses)

        // Update recommendations based on difficulty
        updateRecommendations()
    }

    private fun updateRecommendations() {
        val recommendations = when (viewModel.difficulty) {
            "beginner" -> listOf(
                "New to yoga or flexibility training",
                "Looking for gentle stretches",
                "Focus on basic poses and alignment"
            )
            "intermediate" -> listOf(
                "Some yoga experience",
                "Looking to deepen your practice",
                "Ready for more challenging poses"
            )
            else -> listOf(
                "Experienced yoga practitioners",
                "Strong foundation in yoga",
                "Ready for advanced balancing poses"
            )
        }

        binding.bulletPoint1.text = recommendations[0]
        binding.bulletPoint2.text = recommendations[1]
        binding.bulletPoint3.text = recommendations[2]
    }

    private fun setupButtons() {
        binding.btnStart.setOnClickListener {
            if (isWorkoutActive) {
                pauseWorkout()
            } else {
                startWorkout()
            }
        }

        binding.btnReset.setOnClickListener {
            resetWorkout()
        }

        binding.btnPrevious.setOnClickListener {
            if (currentPoseIndex > 0) {
                currentPoseIndex--
                updateCurrentPose()
            }
        }

        binding.btnNext.setOnClickListener {
            if (currentPoseIndex < viewModel.filteredPoses.size - 1) {
                currentPoseIndex++
                updateCurrentPose()
            }
        }
    }

    private fun setupTabs() {
        binding.tabInstructions.setOnClickListener {
            showInstructions()
        }

        binding.tabYogaTips.setOnClickListener {
            showYogaTips()
        }

        binding.tabBenefits.setOnClickListener {
            showBenefits()
        }

        // Start with Instructions tab active
        showInstructions()
    }

    private fun showInstructions() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_selected)
        binding.tabYogaTips.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_unselected)

        binding.tvTabContent.text = getString(R.string.yoga_instructions)
    }

    private fun showYogaTips() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabYogaTips.setBackgroundResource(R.drawable.bg_tab_selected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_unselected)

        binding.tvTabContent.text = getString(R.string.yoga_tips)
    }

    private fun showBenefits() {
        binding.tabInstructions.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabYogaTips.setBackgroundResource(R.drawable.bg_tab_unselected)
        binding.tabBenefits.setBackgroundResource(R.drawable.bg_tab_selected)

        binding.tvTabContent.text = getString(R.string.yoga_benefits)
    }

    private fun startWorkout() {
        isWorkoutActive = true
        binding.btnStart.text = "Pause"
        binding.btnStart.icon = getDrawable(R.drawable.ic_pause)

        startTimer()
    }

    private fun pauseWorkout() {
        isWorkoutActive = false
        binding.btnStart.text = "Start"
        binding.btnStart.icon = getDrawable(R.drawable.ic_play)

        timer?.cancel()
    }

    private fun resetWorkout() {
        pauseWorkout()
        viewModel.resetTimer()
        updateTimerDisplay()
    }

    private fun handleDifficultyChange(newDifficulty: String) {
        // Stop any ongoing workout
        pauseWorkout()

        // Update difficulty in viewModel
        viewModel.setDifficulty(newDifficulty)

        // Reset workout state
        currentPoseIndex = 0
        completedPoses.clear()

        // Update pose list
        (binding.rvPoses.adapter as YogaPoseAdapter).submitList(viewModel.filteredPoses)

        // Update current pose
        updateCurrentPose()

        // Update recommendations
        updateRecommendations()

        // Update progress
        updateProgress()
    }

    private fun startTimer() {
        timer?.cancel()

        val currentPose = viewModel.filteredPoses.getOrNull(currentPoseIndex) ?: return
        val totalTime = currentPose.duration * 1000L
        val remainingTime = (totalTime - viewModel.elapsedTime * 1000L).coerceAtLeast(0L)

        timer = object : CountDownTimer(remainingTime, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                viewModel.elapsedTime++
                updateTimerDisplay()
            }

            override fun onFinish() {
                // Mark current pose as completed
                val poseId = currentPose.id
                if (!completedPoses.contains(poseId)) {
                    completedPoses.add(poseId)
                }

                // Move to next pose or complete workout
                if (currentPoseIndex < viewModel.filteredPoses.size - 1) {
                    currentPoseIndex++
                    viewModel.resetTimer()
                    updateCurrentPose()
                    startTimer()
                } else {
                    // Workout complete
                    pauseWorkout()
                    viewModel.incrementCompletedWorkouts()
                }

                updateProgress()
            }
        }

        timer?.start()
    }

    private fun updateTimerDisplay() {
        val currentPose = viewModel.filteredPoses.getOrNull(currentPoseIndex) ?: return
        val elapsedSeconds = viewModel.elapsedTime
        val totalSeconds = currentPose.duration

        val elapsedFormatted = formatTime(elapsedSeconds)
        val totalFormatted = formatTime(totalSeconds)

        binding.tvTimer.text = "$elapsedFormatted / $totalFormatted"
        binding.tvBreaths.text = "${viewModel.breathCount} breaths"
    }

    private fun updateCurrentPose() {
        val currentPose = viewModel.filteredPoses.getOrNull(currentPoseIndex) ?: return

        // Update pose details
        binding.tvPoseName.text = currentPose.name
        binding.tvPoseDescription.text = currentPose.description
        binding.tvPoseBenefits.text = "Benefits: ${currentPose.benefits}"

        // Reset timer for new pose
        viewModel.resetTimer()
        updateTimerDisplay()

        // Update adapter to highlight current pose
        val adapter = binding.rvPoses.adapter as YogaPoseAdapter
        adapter.setCurrentPoseIndex(currentPoseIndex)
        adapter.notifyDataSetChanged()

        // Scroll to current pose
        binding.rvPoses.smoothScrollToPosition(currentPoseIndex)
    }

    private fun updateProgress() {
        val totalPoses = viewModel.filteredPoses.size
        val completedCount = completedPoses.count { id ->
            viewModel.filteredPoses.any { it.id == id }
        }

        val progress = if (totalPoses > 0) {
            (completedCount.toFloat() / totalPoses.toFloat() * 100).toInt()
        } else {
            0
        }

        binding.progressOverall.progress = progress
        binding.tvOverallProgress.text = "$progress%"
        binding.tvPosesCompleted.text = "$completedCount of $totalPoses"
    }

    private fun formatTime(seconds: Int): String {
        val mins = seconds / 60
        val secs = seconds % 60
        return String.format(Locale.getDefault(), "%02d:%02d", mins, secs)
    }

    override fun onDestroy() {
        super.onDestroy()
        timer?.cancel()
    }
}