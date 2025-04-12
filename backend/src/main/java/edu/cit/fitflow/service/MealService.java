package edu.cit.fitflow.service;

import edu.cit.fitflow.dto.MealDTO;
import edu.cit.fitflow.entity.DietPlanEntity;
import edu.cit.fitflow.entity.MealEntity;
import edu.cit.fitflow.repository.DietPlanRepository;
import edu.cit.fitflow.repository.MealRepository;
import edu.cit.fitflow.repository.UserRepository;
import edu.cit.fitflow.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealService {
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<MealDTO> getAllMeals() {
        List<MealEntity> meals = mealRepository.findAll();
        return meals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get a specific meal by ID
    public MealDTO getMealById(Integer id) {
        MealEntity meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with id: " + id));
        return convertToDTO(meal);
    }
    
    // Get meals by user ID
    public List<MealDTO> getMealsByUserId(Integer userId) {
        List<MealEntity> meals = mealRepository.findByUserId(userId);
        return meals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new meal
    public MealDTO createMeal(MealDTO mealDTO) {
        UserEntity user = userRepository.findById(mealDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + mealDTO.getUserId()));
        
        MealEntity meal = new MealEntity();
        meal.setName(mealDTO.getName());
        meal.setTime(mealDTO.getTime());
        meal.setCalories(mealDTO.getCalories());
        meal.setProtein(mealDTO.getProtein());
        meal.setCarbs(mealDTO.getCarbs());
        meal.setFats(mealDTO.getFats());
        meal.setNotes(mealDTO.getNotes());
        meal.setImage(mealDTO.getImage());
        meal.setIngredients(mealDTO.getIngredients());
        meal.setUser(user);
        
        MealEntity savedMeal = mealRepository.save(meal);
        return convertToDTO(savedMeal);
    }
    
    // Update an existing meal
    public MealDTO updateMeal(Integer id, MealDTO mealDTO) {
        MealEntity meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with id: " + id));
        
        meal.setName(mealDTO.getName());
        meal.setTime(mealDTO.getTime());
        meal.setCalories(mealDTO.getCalories());
        meal.setProtein(mealDTO.getProtein());
        meal.setCarbs(mealDTO.getCarbs());
        meal.setFats(mealDTO.getFats());
        meal.setNotes(mealDTO.getNotes());
        meal.setImage(mealDTO.getImage());
        meal.setIngredients(mealDTO.getIngredients());
        
        MealEntity updatedMeal = mealRepository.save(meal);
        return convertToDTO(updatedMeal);
    }
    
    // Delete a meal
    public void deleteMeal(Integer id) {
        mealRepository.deleteById(id);
    }
    
    // Convert MealEntity to MealDTO
    private MealDTO convertToDTO(MealEntity meal) {
        MealDTO dto = new MealDTO();
        dto.setId(meal.getId());
        dto.setName(meal.getName());
        dto.setTime(meal.getTime());
        dto.setCalories(meal.getCalories());
        dto.setProtein(meal.getProtein());
        dto.setCarbs(meal.getCarbs());
        dto.setFats(meal.getFats());
        dto.setNotes(meal.getNotes());
        dto.setImage(meal.getImage());
        dto.setIngredients(meal.getIngredients());
        dto.setUserId(meal.getUser().getId());
        dto.setCreatedAt(meal.getCreatedAt());
        dto.setUpdatedAt(meal.getUpdatedAt());
        return dto;
    }
}