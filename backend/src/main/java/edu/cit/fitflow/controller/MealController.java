package edu.cit.fitflow.controller;

import edu.cit.fitflow.dto.MealDTO;
import edu.cit.fitflow.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {
    
    @Autowired
    private MealService mealService;
    
    // Get all meals
    @GetMapping
    public ResponseEntity<List<MealDTO>> getAllMeals() {
        List<MealDTO> meals = mealService.getAllMeals();
        return new ResponseEntity<>(meals, HttpStatus.OK);
    }
    
    // Get a specific meal by ID
    @GetMapping("/{id}")
    public ResponseEntity<MealDTO> getMealById(@PathVariable Integer id) {
        MealDTO meal = mealService.getMealById(id);
        return new ResponseEntity<>(meal, HttpStatus.OK);
    }
    
    // Get meals by diet plan ID
    @GetMapping("/diet-plan/{dietPlanId}")
    public ResponseEntity<List<MealDTO>> getMealsByDietPlanId(@PathVariable Integer dietPlanId) {
        List<MealDTO> meals = mealService.getMealsByDietPlanId(dietPlanId);
        return new ResponseEntity<>(meals, HttpStatus.OK);
    }
    
    // Create a new meal
    @PostMapping("/diet-plan/{dietPlanId}")
    public ResponseEntity<MealDTO> createMeal(@PathVariable Integer dietPlanId, @RequestBody MealDTO mealDTO) {
        MealDTO createdMeal = mealService.createMeal(dietPlanId, mealDTO);
        return new ResponseEntity<>(createdMeal, HttpStatus.CREATED);
    }
    
    // Update an existing meal
    @PutMapping("/{id}")
    public ResponseEntity<MealDTO> updateMeal(@PathVariable Integer id, @RequestBody MealDTO mealDTO) {
        MealDTO updatedMeal = mealService.updateMeal(id, mealDTO);
        return new ResponseEntity<>(updatedMeal, HttpStatus.OK);
    }
    
    // Delete a meal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Integer id) {
        mealService.deleteMeal(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}