package edu.cit.fitflow;

import edu.cit.fitflow.entity.Role;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class FitflowApplication {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(FitflowApplication.class, args);
    }

    // Create default admin user on application startup
    @Bean
    public CommandLineRunner createDefaultAdmin() {
        return args -> {
            if (userService.getAllUsers().stream().noneMatch(user -> user.getRole() == Role.ADMIN)) {
                UserEntity admin = new UserEntity();
                admin.setEmail("admin@fitflow.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setFirstName("Admin");
                admin.setLastName("");
                admin.setRole(Role.ADMIN);
                admin.setUsername("admin");
                admin.setPhoneNumber("0000000000");
                admin.setGender("N/A");
                admin.setHeight(0.0f);
                admin.setWeight(0.0f);
                admin.setAge(0);
                admin.setBodyGoal("N/A");
                userService.createUser(admin);
                System.out.println("Default admin user created: admin@fitflow.com");
            } else {
                System.out.println("Default admin user already exists.");
            }
        };
    }
}