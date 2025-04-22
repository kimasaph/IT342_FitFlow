package edu.cit.fitflow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;

@RestController
@RequestMapping("/trainer")
@PreAuthorize("hasRole('TRAINER')") // Restrict access to TRAINER role
public class TrainerController {

    @Autowired
    private UserService userService;

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateTrainerProfile(@RequestBody UserEntity updatedTrainerDetails, @RequestParam("trainerId") int trainerId) {
        try {
            // Fetch the trainer by ID
            UserEntity trainer = userService.findById(trainerId);
            if (trainer == null) {
                return ResponseEntity.status(404).body("Trainer not found");
            }

            // Update trainer details
            trainer.setFirstName(updatedTrainerDetails.getFirstName());
            trainer.setLastName(updatedTrainerDetails.getLastName());
            trainer.setPhoneNumber(updatedTrainerDetails.getPhoneNumber());
            trainer.setAge(updatedTrainerDetails.getAge());

            // Save updated trainer details
            UserEntity updatedTrainer = userService.createUser(trainer);

            return ResponseEntity.ok(updatedTrainer);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating trainer profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getTrainerProfile(
        @RequestParam("trainerId") int trainerId,
        @RequestHeader("Authorization") String token // Accept token in the request header
    ) {
        try {
            // Validate token (if applicable)
            // Example: tokenService.validateToken(token);

            UserEntity trainer = userService.findById(trainerId);
            if (trainer == null) {
                return ResponseEntity.status(404).body("Trainer not found");
            }
            return ResponseEntity.ok(trainer);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching trainer profile: " + e.getMessage());
        }
    }
}
