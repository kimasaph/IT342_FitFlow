package com.fitflow.mobile_backend.Controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitflow.mobile_backend.DTO.UserDTO;
import com.fitflow.mobile_backend.Entities.UserEntity;
import com.fitflow.mobile_backend.LoginRequest.LoginRequest;
import com.fitflow.mobile_backend.Repositories.UserRepository;
import com.fitflow.mobile_backend.UserResponse.UserResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        UserEntity user = new UserEntity();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword()); // Encrypt in production!
        user.setGender(userDTO.getGender());

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        System.out.println("Attempting login for email: " + request.getEmail());
    
        Optional<UserEntity> optionalUser = userRepository.findByEmail(request.getEmail());
    
        if (optionalUser.isEmpty()) {
            System.out.println("No user found with email: " + request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    
        UserEntity user = optionalUser.get();
    
        System.out.println("User found. Stored password: " + user.getPassword());
        System.out.println("Entered password: " + request.getPassword());
    
        if (!user.getPassword().equals(request.getPassword())) {
            System.out.println("Passwords do not match");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    
        UserResponse response = new UserResponse(
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getGender()
        );
    
        System.out.println("Login successful!");
        return ResponseEntity.ok(response);
    }
    


    
}
