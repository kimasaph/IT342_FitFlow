package edu.cit.fitflow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import edu.cit.fitflow.entity.Role;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email", name = "uk_email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private Float height;

    @Column(nullable = false)
    private Float weight;

    @Column(nullable = false)
    private Integer age = 0; // Default value set to 0

    @Column(nullable = false)
    private String bodyGoal;

    @Column(name = "profile_picture_path")
    private String profilePicturePath;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role; // Add role field

    @Column(nullable = false)
    private boolean isActive = true; // Default value set to true

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = new Date();
    }
}