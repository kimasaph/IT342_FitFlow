package edu.cit.fitflow.controller;

import edu.cit.fitflow.entity.WorkoutEntity;
import edu.cit.fitflow.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutEntity> createWorkout(@RequestBody WorkoutEntity workout) {
        WorkoutEntity savedWorkout = workoutService.saveWorkout(workout);
        return ResponseEntity.ok(savedWorkout);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<WorkoutEntity> getWorkoutById(@PathVariable Long userId) {
        Optional<WorkoutEntity> workout = workoutService.getWorkoutById(userId);
        return workout.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
