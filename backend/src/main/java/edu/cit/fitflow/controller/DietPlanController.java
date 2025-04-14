package edu.cit.fitflow.controller;

import edu.cit.fitflow.dto.CalorieProgramDTO;
import edu.cit.fitflow.dto.DietPlanDTO;
import edu.cit.fitflow.service.DietPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/diet-plans")
public class DietPlanController {
    
    @Autowired
    private DietPlanService dietPlanService;
    
    // Get all diet plans
    @GetMapping
    public ResponseEntity<List<DietPlanDTO>> getAllDietPlans() {
        List<DietPlanDTO> dietPlans = dietPlanService.getAllDietPlans();
        return new ResponseEntity<>(dietPlans, HttpStatus.OK);
    }
    
    // Get a specific diet plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<DietPlanDTO> getDietPlanById(@PathVariable Integer id) {
        DietPlanDTO dietPlan = dietPlanService.getDietPlanById(id);
        return new ResponseEntity<>(dietPlan, HttpStatus.OK);
    }
    
    // Get diet plans by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DietPlanDTO>> getDietPlansByUserId(@PathVariable Integer userId) {
        List<DietPlanDTO> dietPlans = dietPlanService.getDietPlansByUserId(userId);
        return new ResponseEntity<>(dietPlans, HttpStatus.OK);
    }
    
    // Create a new diet plan
    @PostMapping
    public ResponseEntity<DietPlanDTO> createDietPlan(@RequestBody DietPlanDTO dietPlanDTO) {
        DietPlanDTO createdDietPlan = dietPlanService.createDietPlan(dietPlanDTO);
        return new ResponseEntity<>(createdDietPlan, HttpStatus.CREATED);
    }
    
    // Update an existing diet plan
    @PutMapping("/{id}")
    public ResponseEntity<DietPlanDTO> updateDietPlan(@PathVariable Integer id, @RequestBody DietPlanDTO dietPlanDTO) {
        DietPlanDTO updatedDietPlan = dietPlanService.updateDietPlan(id, dietPlanDTO);
        return new ResponseEntity<>(updatedDietPlan, HttpStatus.OK);
    }
    
    // Delete a diet plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDietPlan(@PathVariable Integer id) {
        dietPlanService.deleteDietPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Get all calorie programs
    @GetMapping("/calorie-programs")
    public ResponseEntity<List<CalorieProgramDTO>> getCaloriePrograms() {
        List<CalorieProgramDTO> programs = dietPlanService.getCaloriePrograms();
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }
}