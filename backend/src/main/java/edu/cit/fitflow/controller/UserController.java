package edu.cit.fitflow.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.fitflow.config.FileStorageConfig;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import edu.cit.fitflow.entity.Role;

@RestController
@RequestMapping("/api/auth")
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
            response.put("redirectUrl", user.getRole() == Role.ADMIN ? "/admin-dashboard" : "/dashboard");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // Helper method to create a user response map
    private Map<String, Object> getUserResponseMap(UserEntity user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", user.getId());
        userMap.put("email", user.getEmail());
        userMap.put("username", user.getUsername());
        userMap.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
        userMap.put("lastName", user.getLastName() != null ? user.getLastName() : "");
        userMap.put("gender", user.getGender() != null ? user.getGender() : "");
        userMap.put("weight", user.getWeight() != null ? user.getWeight() : 0.0f);
        userMap.put("height", user.getHeight() != null ? user.getHeight() : 0.0f);
        userMap.put("age", user.getAge() != null ? user.getAge() : 0);
        userMap.put("bodyGoal", user.getBodyGoal() != null ? user.getBodyGoal() : "");
        userMap.put("created_at", user.getCreated_at() != null ? user.getCreated_at() : new Date());
        userMap.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        userMap.put("role", user.getRole() != null ? user.getRole().name() : ""); // Include role in response


        // Add the full URL for the profile picture
        String profilePicturePath = user.getProfilePicturePath();
        if (profilePicturePath != null && !profilePicturePath.isEmpty()) {
            // Ensure the path starts with a forward slash
            if (!profilePicturePath.startsWith("/")) {
                profilePicturePath = "/" + profilePicturePath;
            }
            userMap.put("profilePicture", "http://localhost:8080" + profilePicturePath);
        } else {
            userMap.put("profilePicture", ""); // or your default profile picture URL
        }
    
        return userMap;
    }
    
    // Generate JWT token
    private String generateToken(UserEntity user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(Long.toString(user.getId()))
            .claim("role", user.getRole().name())
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    //Create of CRUD
    @PostMapping("/signup")
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
            user.setAge(user.getAge() != null ? user.getAge() : 0); // Default age value
            user.setBodyGoal(user.getBodyGoal() != null ? user.getBodyGoal() : "");
            user.setUsername(user.getUsername() != null ? user.getUsername() : user.getEmail());
            if (user.getRole() == null) {
                user.setRole(Role.MEMBER); // Default role if not provided
            }
            
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

      //Update of User
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
              user.setGender(updatedUserDetails.getGender());
              user.setPhoneNumber(updatedUserDetails.getPhoneNumber());
              user.setUsername(updatedUserDetails.getUsername());

              // Save updated user
              UserEntity updatedUser = userv.createUser(user);

              return ResponseEntity.ok(getUserResponseMap(updatedUser));

          } catch (Exception e) {
              logger.error("Error updating profile: ", e);
              return ResponseEntity.status(500).body(Map.of("error", "Profile update failed: " + e.getMessage()));
          }
      }

      //Setup of User
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
            if (profileData.containsKey("phoneNumber")) {
                user.setPhoneNumber(profileData.get("phoneNumber"));
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
            response.put("phoneNumber", updatedUser.getPhoneNumber());
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

      @PostMapping("/forgot-password")
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

      @PostMapping("/reset-password")
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

      @PostMapping("/upload-profile-picture")
        public ResponseEntity<?> uploadProfilePicture(
        @RequestParam("file") MultipartFile file,
        @RequestParam("userId") int userId) {
        
        try {
            UserEntity user = userv.findById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select a file"));
            }

            String contentType = file.getContentType();
            if (!fileStorageConfig.isValidFileType(contentType)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type"));
            }

            if (file.getSize() > fileStorageConfig.getMaxFileSize()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds limit"));
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
                String publicUrl = "/uploads/" + fileName; // Remove the host and port
                
                String uploadDir = fileStorageConfig.getUploadDir();
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                user.setProfilePicturePath(publicUrl);
                userv.createUser(user);
                
                return ResponseEntity.ok(Map.of(
                    "message", "Profile picture uploaded successfully",
                    "profilePicturePath", publicUrl,
                    "user", getUserResponseMap(user)
                ));
                
            } catch (IOException e) {
                return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to upload profile picture: " + e.getMessage()));
            }
        }
}