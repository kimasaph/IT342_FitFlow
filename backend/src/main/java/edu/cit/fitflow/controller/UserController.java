package edu.cit.fitflow.controller;

import edu.cit.fitflow.config.FileStorageConfig;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired
	UserService userv;
  
  @Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private Long jwtExpiration;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  @Autowired
  private FileStorageConfig fileStorageConfig;

  @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            logger.info("Login attempt for email: {}", email);

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                logger.warn("No user found with email: {}", email);
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
            }

            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                logger.warn("Invalid password for email: {}", email);
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
            }

            // Generate JWT token
            String token = generateToken(user);
            logger.info("Successfully generated token for user: {}", email);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", getUserResponseMap(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    private Map<String, Object> getUserResponseMap(UserEntity user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", user.getId());
        userMap.put("email", user.getEmail());
        userMap.put("username", user.getUsername());
        userMap.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
        userMap.put("lastName", user.getLastName() != null ? user.getLastName() : "");
        
        return userMap;
    }

    private String generateToken(UserEntity user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(Long.toString(user.getId()))
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    //Create of CRUD
    @PostMapping("/signupuser")
      public ResponseEntity<?> postStudentRecord(@RequestBody UserEntity user) {
          try {
              logger.info("Received registration request for email: {}", user.getEmail());
              
              // Validate required fields
              if (user.getEmail() == null || user.getEmail().isEmpty()) {
                  return ResponseEntity.badRequest().body("Email is required");
              }
              if (user.getPassword() == null || user.getPassword().isEmpty()) {
                  return ResponseEntity.badRequest().body("Password is required");
              }
              if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
                  return ResponseEntity.badRequest().body("Phone number is required");
              }
              
              // Encrypt the password before saving
              String encryptedPassword = passwordEncoder.encode(user.getPassword());
              user.setPassword(encryptedPassword);
              
              // Set username and created_at
              user.setUsername(user.getEmail());
              user.setCreated_at(new Date());

              // Initialize profile fields with default values
              user.setFirstName(user.getFirstName() != null ? user.getFirstName() : "");
              user.setLastName(user.getLastName() != null ? user.getLastName() : "");
              
              UserEntity savedUser = userv.createUser(user);
              
              // Don't send the encrypted password back in the response
              savedUser.setPassword(null);
              
              return ResponseEntity.ok(savedUser);
              
          } catch (Exception e) {
              logger.error("Error creating user: ", e);
              return ResponseEntity.badRequest()
                  .body("Error creating user: " + e.getMessage());
          }
      }

      @PutMapping("/update-profile")
      public ResponseEntity<?> updateProfile(@RequestBody UserEntity updatedUserDetails, @RequestParam("userId") int userId) {
          try {
              logger.info("Received profile update request for user: {}", userId);

              // Validate user
              UserEntity user = userv.findById(userId);
              if (user == null) {
                  return ResponseEntity.status(404).body(Map.of("error", "User not found"));
              }

              // Update user details
              user.setFirstName(updatedUserDetails.getFirstName());
              user.setLastName(updatedUserDetails.getLastName());

              // Save updated user
              UserEntity updatedUser = userv.createUser(user);

              return ResponseEntity.ok(getUserResponseMap(updatedUser));

          } catch (Exception e) {
              logger.error("Error updating profile: ", e);
              return ResponseEntity.status(500).body(Map.of("error", "Profile update failed: " + e.getMessage()));
          }
      }


}