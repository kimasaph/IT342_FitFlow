package edu.cit.fitflow.service;

import edu.cit.fitflow.dto.CalorieProgramDTO;
import edu.cit.fitflow.dto.DietPlanDTO;
import edu.cit.fitflow.dto.MealDTO;
import edu.cit.fitflow.entity.DietPlanEntity;
import edu.cit.fitflow.entity.MealEntity;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.DietPlanRepository;
import edu.cit.fitflow.repository.MealRepository;
import edu.cit.fitflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DietPlanService {
    
    @Autowired
    private DietPlanRepository dietPlanRepository;
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all diet plans
    public List<DietPlanDTO> getAllDietPlans() {
        List<DietPlanEntity> dietPlans = dietPlanRepository.findAll();
        return dietPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get a specific diet plan by ID
    public DietPlanDTO getDietPlanById(Integer id) {
        DietPlanEntity dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diet plan not found with id: " + id));
        return convertToDTO(dietPlan);
    }
    
    // Get diet plans by user ID
    public List<DietPlanDTO> getDietPlansByUserId(Integer userId) {
        List<DietPlanEntity> dietPlans = dietPlanRepository.findByUserId(userId);
        return dietPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new diet plan
    @Transactional
    public DietPlanDTO createDietPlan(DietPlanDTO dietPlanDTO) {
        UserEntity user = userRepository.findById(dietPlanDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + dietPlanDTO.getUserId()));
        
        DietPlanEntity dietPlan = new DietPlanEntity();
        dietPlan.setName(dietPlanDTO.getName());
        dietPlan.setCalorieProgram(dietPlanDTO.getCalorieProgram());
        dietPlan.setTotalCalories(dietPlanDTO.getTotalCalories());
        dietPlan.setUser(user);
        
        DietPlanEntity savedDietPlan = dietPlanRepository.save(dietPlan);
        
        if (dietPlanDTO.getMeals() != null) {
            for (MealDTO mealDTO : dietPlanDTO.getMeals()) {
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
                meal.setDietPlan(savedDietPlan);
                mealRepository.save(meal);
            }
        }
        
        return convertToDTO(savedDietPlan);
    }
    
    // Update an existing diet plan
    @Transactional
    public DietPlanDTO updateDietPlan(Integer id, DietPlanDTO dietPlanDTO) {
        DietPlanEntity dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diet plan not found with id: " + id));
        
        dietPlan.setName(dietPlanDTO.getName());
        dietPlan.setCalorieProgram(dietPlanDTO.getCalorieProgram());
        dietPlan.setTotalCalories(dietPlanDTO.getTotalCalories());
        
        DietPlanEntity updatedDietPlan = dietPlanRepository.save(dietPlan);
        return convertToDTO(updatedDietPlan);
    }
    
    // Delete a diet plan
    public void deleteDietPlan(Integer id) {
        dietPlanRepository.deleteById(id);
    }
    
    // Get all calorie programs
    public List<CalorieProgramDTO> getCaloriePrograms() {
        List<CalorieProgramDTO> programs = new ArrayList<>();
        programs.add(new CalorieProgramDTO("Detox", "750"));
        programs.add(new CalorieProgramDTO("Decreasing", "750"));
        programs.add(new CalorieProgramDTO("Decreasing", "1000"));
        programs.add(new CalorieProgramDTO("Decreasing", "1500"));
        programs.add(new CalorieProgramDTO("Balance", "2000"));
        programs.add(new CalorieProgramDTO("Muscle Gain", "2500"));
        programs.add(new CalorieProgramDTO("Bulking", "3000"));
        programs.add(new CalorieProgramDTO("Athletic", "3500"));
        return programs;
    }
    
    private DietPlanDTO convertToDTO(DietPlanEntity dietPlan) {
        DietPlanDTO dto = new DietPlanDTO();
        dto.setId(dietPlan.getId());
        dto.setName(dietPlan.getName());
        dto.setCalorieProgram(dietPlan.getCalorieProgram());
        dto.setTotalCalories(dietPlan.getTotalCalories());
        dto.setUserId(dietPlan.getUser().getId());
        
        List<MealDTO> mealDTOs = dietPlan.getMeals().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        dto.setMeals(mealDTOs);
        
        return dto;
    }
    
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
        return dto;
    }
}