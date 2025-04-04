package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import edu.cit.fitflow.entity.UserEntity;

@Entity
@Table(name = "workouts")
public class WorkoutEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private String bodyType;
    private String fitnessGoal;
    private String currentFitnessLevel;
    private String preferredWorkoutStyle;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }

    public String getCurrentFitnessLevel() {
        return currentFitnessLevel;
    }

    public void setCurrentFitnessLevel(String currentFitnessLevel) {
        this.currentFitnessLevel = currentFitnessLevel;
    }

    public String getPreferredWorkoutStyle() {
        return preferredWorkoutStyle;
    }

    public void setPreferredWorkoutStyle(String preferredWorkoutStyle) {
        this.preferredWorkoutStyle = preferredWorkoutStyle;
    }
}
