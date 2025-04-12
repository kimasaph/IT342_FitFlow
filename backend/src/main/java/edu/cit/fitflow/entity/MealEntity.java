package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String time;
    
    @Column(nullable = false)
    private Integer calories;
    
    @Column(nullable = false)
    private Integer protein;
    
    @Column(nullable = false)
    private Integer carbs;
    
    @Column(nullable = false)
    private Integer fats;
    
    private String notes;
    
    private String image;
    
    private String ingredients;
    
    @ManyToOne
    @JoinColumn(name = "diet_plan_id", nullable = false)
    private DietPlanEntity dietPlan;
}