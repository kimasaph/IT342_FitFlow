package edu.cit.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private Integer id;
    private String name;
    private String time;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private String notes;
    private String image;
    private String ingredients;
}