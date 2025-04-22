package edu.cit.fitflow.dto;

import lombok.Data;

@Data
public class UserMealDTO {
    private Integer userId;
    private String name;
    private String time;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private String description;
    private String notes;
    private String ingredients;
    private String image;
}
