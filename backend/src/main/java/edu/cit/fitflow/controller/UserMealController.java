package edu.cit.fitflow.controller;

import edu.cit.fitflow.dto.UserMealDTO;
import edu.cit.fitflow.entity.UserMealEntity;
import edu.cit.fitflow.service.UserMealService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class UserMealController {

    private static final Logger logger = LoggerFactory.getLogger(UserMealController.class);

    @Autowired
    private UserMealService userMealService;

    @PostMapping
    public UserMealEntity createMeal(@RequestBody UserMealDTO mealDTO) {
        logger.info("Received request to create meal for user ID: {}", mealDTO.getUserId());
        return userMealService.addMeal(mealDTO);
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