package edu.cit.fitflow.controller;

import edu.cit.fitflow.entity.WorkoutEntity;
import edu.cit.fitflow.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import edu.cit.fitflow.config.JwtUtil;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/{userId}")
    public ResponseEntity<?> saveWorkout(@PathVariable Integer userId, @RequestBody WorkoutEntity workout) {
        try {
            WorkoutEntity savedWorkout = workoutService.saveWorkout(userId, workout);
            return ResponseEntity.ok(savedWorkout); // Ensure the full WorkoutEntity is returned
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to save workout: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWorkoutsByUserId(@PathVariable Integer userId) {
        try {
            List<WorkoutEntity> workouts = workoutService.getWorkoutsByUserId(userId);
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to retrieve workouts: " + e.getMessage()));
        }
    }
}
