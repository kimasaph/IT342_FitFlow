package edu.cit.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietPlanDTO {
    private Integer id;
    private String name;
    private String calorieProgram;
    private Integer totalCalories;
    private Integer userId;
    private List<MealDTO> meals;
}