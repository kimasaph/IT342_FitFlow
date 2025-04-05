package edu.cit.fitflow.service;

import edu.cit.fitflow.entity.WorkoutEntity;
import edu.cit.fitflow.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    public WorkoutEntity saveWorkout(WorkoutEntity workout) {
        return workoutRepository.save(workout);
    }

    public Optional<WorkoutEntity> getWorkoutById(Long userId) {
        return workoutRepository.findById(userId);
    }
}
