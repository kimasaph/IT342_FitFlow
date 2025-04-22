package edu.cit.fitflow

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import edu.cit.fitflow.databinding.FragmentCurrentWorkoutBinding

class CurrentWorkoutFragment : Fragment() {

    private var _binding: FragmentCurrentWorkoutBinding? = null
    private val binding get() = _binding!!
    private val viewModel: WorkoutViewModel by activityViewModels()

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

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnStartEmptyWorkout.setOnClickListener {
            viewModel.startEmptyWorkout()
            // Navigate to active workout screen
        }

        binding.btnUseTemplateFullBody.setOnClickListener {
            viewModel.startTemplateWorkout("full_body")
            // Navigate to active workout screen
        }

        binding.btnUseTemplateUpperBody.setOnClickListener {
            viewModel.startTemplateWorkout("upper_body")
            // Navigate to active workout screen
        }

        binding.btnUseTemplateLowerBody.setOnClickListener {
            viewModel.startTemplateWorkout("lower_body")
            // Navigate to active workout screen
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}