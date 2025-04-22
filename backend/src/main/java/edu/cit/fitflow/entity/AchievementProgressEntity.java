package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "achievement_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementProgressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    @Column(name = "trigger_event", nullable = false)
    private String triggerEvent;
    
    @Column(name = "current_progress", nullable = false)
    private Integer currentProgress;
}