package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_workout_user"))
    private UserEntity user;

    @Column(nullable = false)
    private String bodyType;

    @Column(nullable = false)
    private String fitnessGoal;

    @Column(nullable = false)
    private String fitnessLevel;

    @Column(nullable = false)
    private String workoutStyle;

    @Column(columnDefinition = "TEXT")
    private String healthConcerns;

    @Column(nullable = false)
    private String currentFitnessLevel;
}
