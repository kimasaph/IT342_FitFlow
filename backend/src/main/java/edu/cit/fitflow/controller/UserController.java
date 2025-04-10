package edu.cit.fitflow.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.fitflow.config.FileStorageConfig;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;
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
              user.setGender(user.getGender() != null ? user.getGender() : "");
              user.setHeight(user.getHeight() != null ? user.getHeight() : 0.0f);
              user.setWeight(user.getWeight() != null ? user.getWeight() : 0.0f);
              user.setAge(user.getAge() != null ? user.getAge() : 0);
              user.setBodyGoal(user.getBodyGoal() != null ? user.getBodyGoal() : "");
              
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
              user.setWeight(updatedUserDetails.getWeight());
              user.setHeight(updatedUserDetails.getHeight());
              user.setAge(updatedUserDetails.getAge());
              user.setBodyGoal(updatedUserDetails.getBodyGoal());

              // Save updated user
              UserEntity updatedUser = userv.createUser(user);

              return ResponseEntity.ok(getUserResponseMap(updatedUser));

          } catch (Exception e) {
              logger.error("Error updating profile: ", e);
              return ResponseEntity.status(500).body(Map.of("error", "Profile update failed: " + e.getMessage()));
          }
      }

      @PostMapping("/signup-setup")
        public ResponseEntity<?> setupProfile(@RequestBody Map<String, String> profileData) {
        try {
            // Log the received data
            logger.info("Received profile data: {}", profileData);
            
            if (profileData == null || profileData.isEmpty()) {
                logger.error("Profile data is empty");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "No profile data provided"));
            }
    
            // Get the most recently created user
            List<UserEntity> users = userv.getAllUsers();
            if (users.isEmpty()) {
                logger.error("No users found in database");
                return ResponseEntity.status(404)
                    .body(Map.of("error", "No users found"));
            }
            
            // Get the most recent user
            UserEntity user = users.stream()
                .max((u1, u2) -> u1.getCreated_at().compareTo(u2.getCreated_at()))
                .orElseThrow(() -> new RuntimeException("No users found"));
            
            logger.info("Found user to update: {}", user.getEmail());
    
            // Update profile fields with null checks
            if (profileData.containsKey("firstName")) {
                user.setFirstName(profileData.get("firstName"));
            }
            if (profileData.containsKey("lastName")) {
                user.setLastName(profileData.get("lastName"));
            }
            if (profileData.containsKey("gender")) {
                user.setGender(profileData.get("gender"));
            }
            if (profileData.containsKey("weight")) {
                user.setWeight(profileData.containsKey("weight") && profileData.get("weight") != null 
                    ? Float.parseFloat(profileData.get("weight")) 
                    : null);
            }
            if (profileData.containsKey("height")) {
                user.setHeight(profileData.containsKey("height") && profileData.get("height") != null 
                    ? Float.parseFloat(profileData.get("height")) 
                    : null);
            }
            if (profileData.containsKey("age")) {
                user.setAge(profileData.containsKey("age") && profileData.get("age") != null 
                    ? Integer.parseInt(profileData.get("age")) 
                    : null);
            }
            if (profileData.containsKey("bodyGoal")) {
                user.setBodyGoal(profileData.get("bodyGoal"));
            }
            
            UserEntity updatedUser = userv.createUser(user);
            logger.info("Successfully updated user: {}", updatedUser.getEmail());
            
            // Generate new token
            String token = generateToken(updatedUser);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", updatedUser.getId());
            response.put("email", updatedUser.getEmail());
            response.put("username", updatedUser.getUsername());
            response.put("firstName", updatedUser.getFirstName());
            response.put("lastName", updatedUser.getLastName());
            response.put("gender", updatedUser.getGender());
            response.put("weight", updatedUser.getWeight());
            response.put("height", updatedUser.getHeight());
            response.put("age", updatedUser.getAge());
            response.put("bodyGoal", updatedUser.getBodyGoal());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error during profile setup: ", e);
            logger.error("Stack trace: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Profile setup failed: " + e.getMessage()));
        }
    }

      @PostMapping("/forgot1")
      public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
          try {
              String email = request.get("email");
              logger.info("Email verification attempt for: {}", email);
  
              // Find user by email
              UserEntity user = userv.findByEmail(email);
              
              if (user == null) {
                  logger.warn("No user found with email: {}", email);
                  return ResponseEntity.status(404)
                      .body(Map.of("error", "Email not found"));
              }
  
              // Email exists
              logger.info("Email verification successful for: {}", email);
              return ResponseEntity.ok()
                  .body(Map.of("message", "Email verified successfully"));
  
          } catch (Exception e) {
              logger.error("Email verification error: ", e);
              return ResponseEntity.badRequest()
                  .body(Map.of("error", "Email verification failed: " + e.getMessage()));
          }
      }

      @PostMapping("/forgot2")
      public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
          try {
              String email = request.get("email");
              String newPassword = request.get("newPassword");
              
              logger.info("Password reset attempt for email: {}", email);
  
              // Validate inputs
              if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()) {
                  return ResponseEntity.badRequest()
                      .body(Map.of("error", "Email and new password are required"));
              }
  
              // Find user by email
              UserEntity user = userv.findByEmail(email);
              if (user == null) {
                  logger.warn("No user found with email: {}", email);
                  return ResponseEntity.status(404)
                      .body(Map.of("error", "User not found"));
              }
  
              // Encrypt the new password
              String encryptedPassword = passwordEncoder.encode(newPassword);
              user.setPassword(encryptedPassword);
              
              // Save the updated user
              userv.createUser(user);
  
              logger.info("Password reset successful for email: {}", email);
              return ResponseEntity.ok()
                  .body(Map.of("message", "Password reset successful"));
  
          } catch (Exception e) {
              logger.error("Password reset error: ", e);
              return ResponseEntity.badRequest()
                  .body(Map.of("error", "Password reset failed: " + e.getMessage()));
          }
      }
}