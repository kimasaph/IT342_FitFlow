package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;


@Entity
@Table(name = "user_meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMealEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String time;
    
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    
    private String image;

    private Date created_at;
}
