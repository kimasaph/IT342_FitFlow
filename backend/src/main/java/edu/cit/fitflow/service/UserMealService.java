package edu.cit.fitflow.service;

import edu.cit.fitflow.dto.UserMealDTO;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.UserMealEntity;
import edu.cit.fitflow.repository.UserMealRepository;
import edu.cit.fitflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;
import java.util.List;

@Service
public class UserMealService {

    private static final Logger logger = LoggerFactory.getLogger(UserMealService.class);

    @Autowired
    private UserMealRepository mealRepository;

    @Autowired
    private UserRepository userRepository;

    public UserMealEntity addMeal(UserMealDTO dto) {
        logger.info("Adding meal for user ID: {}", dto.getUserId());
        
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));

        UserMealEntity meal = new UserMealEntity();
        meal.setUser(user);
        meal.setName(dto.getName());
        meal.setTime(dto.getTime());
        meal.setCalories(dto.getCalories());
        meal.setProtein(dto.getProtein());
        meal.setCarbs(dto.getCarbs());
        meal.setFats(dto.getFats());
        meal.setNotes(dto.getNotes());
        meal.setIngredients(dto.getIngredients());
        meal.setImage(dto.getImage());
        meal.setCreated_at(new Date()); // Set the creation date
        
        logger.info("Saving meal: {}", meal.getName());
        return mealRepository.save(meal);
    }
    
    public List<UserMealEntity> getMealsByUserId(Integer userId) {
        logger.info("Retrieving meals for user ID: {}", userId);
        
        // First check if user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                
        // Assuming your repository has a method to find meals by user
        return mealRepository.findByUser(user);
    }
    
    public void deleteMeal(Integer mealId) {
        logger.info("Deleting meal with ID: {}", mealId);
        
        // Check if meal exists
        UserMealEntity meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found with id: " + mealId));
        
        // Delete the meal
        mealRepository.delete(meal);
        logger.info("Meal deleted successfully: {}", mealId);
    }
}