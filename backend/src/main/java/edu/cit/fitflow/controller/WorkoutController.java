package edu.cit.fitflow.controller;

import edu.cit.fitflow.entity.WorkoutEntity;
import edu.cit.fitflow.service.WorkoutService;
import edu.cit.fitflow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> saveWorkout(@RequestHeader("Authorization") String token, @RequestBody WorkoutEntity workout) {
        try {
            // Extract userId from token
            String userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid or missing token"));
            }

            WorkoutEntity savedWorkout = workoutService.saveWorkout(Integer.parseInt(userId), workout);
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
