package edu.cit.fitflow.service;

import edu.cit.fitflow.entity.WorkoutEntity;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.WorkoutRepository;
import edu.cit.fitflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkoutEntity saveWorkout(Integer userId, WorkoutEntity workout) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        System.out.println("Saving workout for user ID: " + userId); // Debugging log
        System.out.println("Workout details: " + workout); // Debugging log

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        workout.setUser(user);

        // Set currentFitnessLevel if not provided
        if (workout.getCurrentFitnessLevel() == null) {
            workout.setCurrentFitnessLevel(workout.getFitnessLevel());
        }

        return workoutRepository.save(workout);
    }

    public List<WorkoutEntity> getWorkoutsByUserId(Integer userId) {
        return workoutRepository.findByUserId(userId);
    }
}
