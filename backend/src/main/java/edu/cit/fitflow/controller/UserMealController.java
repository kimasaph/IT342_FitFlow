package edu.cit.fitflow.controller;

import edu.cit.fitflow.dto.UserMealDTO;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.UserMealEntity;
import edu.cit.fitflow.repository.UserMealRepository;
import edu.cit.fitflow.repository.UserRepository;
import edu.cit.fitflow.service.UserMealService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import edu.cit.fitflow.service.AchievementService;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class UserMealController {

    private static final Logger logger = LoggerFactory.getLogger(UserMealController.class);

    @Autowired
    private UserMealService userMealService;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMealRepository userMealRepository;

    @PostMapping
    public UserMealEntity createMeal(@RequestBody UserMealDTO mealDTO) {
        logger.info("Received request to create meal for user ID: {}", mealDTO.getUserId());
        
        // Save the meal
        UserMealEntity savedMeal = userMealService.addMeal(mealDTO);
        
        // After successful save, update achievement progress
        try {
            // Get the user
            UserEntity user = userRepository.findById(mealDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Count how many meals the user has created
            long mealCount = userMealRepository.countByUser(user);
            
            // Update the achievement progress
            achievementService.updateAchievementProgress(user, "meals_created_5", (int)mealCount);
            
            logger.info("Updated 'Meal Master' achievement progress for user {}: {}/5", 
                     mealDTO.getUserId(), mealCount);
                     
            // If this was their 5th meal, log the achievement unlock
            if (mealCount == 5) {
                logger.info("User {} unlocked 'Meal Master' achievement!", mealDTO.getUserId());
            }
        } catch (Exception e) {
            // Just log the error but don't prevent meal creation from succeeding
            logger.error("Failed to update achievement progress: {}", e.getMessage());
        }
        
        return savedMeal;
    }

    @GetMapping("/user/{userId}")
    public List<UserMealEntity> getMealsByUserId(@PathVariable Integer userId) {
        logger.info("Fetching meals for user ID: {}", userId);
        return userMealService.getMealsByUserId(userId);
    }
    
    @DeleteMapping("/{mealId}")
    public ResponseEntity<?> deleteMeal(@PathVariable Integer mealId) {
        logger.info("Received request to delete meal with ID: {}", mealId);
        try {
            userMealService.deleteMeal(mealId);
            return ResponseEntity.ok().body(Map.of("message", "Meal deleted successfully"));
        } catch (RuntimeException e) {
            logger.error("Error deleting meal: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error while deleting meal: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to delete meal"));
        }
    }
}