package edu.cit.fitflow.controller;

import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.AchievementProgressEntity;
import edu.cit.fitflow.entity.UserAchievementEntity;
import edu.cit.fitflow.repository.UserRepository;
import edu.cit.fitflow.repository.AchievementProgressRepository;
import edu.cit.fitflow.repository.UserMealRepository;
import edu.cit.fitflow.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import edu.cit.fitflow.dto.UserAchievementDTO;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:5173")
public class AchievementController {

  @Autowired
  private AchievementService achievementService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserMealRepository mealRepository;

  @Autowired
  private AchievementProgressRepository progressRepository;

  @GetMapping("/my")
  public List<UserAchievementDTO> getMyAchievements(@RequestParam Integer userId) {
      UserEntity user = userRepository.findById(userId)
              .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

      List<UserAchievementEntity> achievements = achievementService.getUserAchievements(user);

      return achievements.stream()
              .map(ua -> new UserAchievementDTO(
                      ua.getAchievement().getTitle(),
                      ua.getAchievement().getDescription(),
                      ua.getAchievement().getImage(),
                      ua.getDateAchieved()
              ))
              .toList();
  }

  @GetMapping("/progress")
  public Map<String, Integer> getAchievementProgress(@RequestParam Integer userId) {
      UserEntity user = userRepository.findById(userId)
              .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
      
      Map<String, Integer> progressMap = new HashMap<>();
      
      // Add meal counter progress
      long mealCount = mealRepository.countByUser(user);
      progressMap.put("meals_created_5", (int) mealCount);
      
      // Add other achievement progress as needed
      
      return progressMap;
  }

 @GetMapping("/my-progress")
  public ResponseEntity<?> getMyAchievementsWithProgress(@RequestParam Integer userId) {
      UserEntity user = userRepository.findById(userId)
              .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

      List<UserAchievementEntity> unlockedAchievements = achievementService.getUserAchievements(user);
      Map<String, Integer> progress = achievementService.getProgressForUser(user);
      
      // Create a DTO representation to avoid Hibernate proxy serialization issues
      List<Map<String, Object>> unlockedAchievementDTOs = unlockedAchievements.stream()
          .map(ua -> {
              Map<String, Object> dto = new HashMap<>();
              dto.put("id", ua.getId());
              dto.put("achievementId", ua.getAchievement().getId());
              dto.put("title", ua.getAchievement().getTitle());
              dto.put("description", ua.getAchievement().getDescription());
              dto.put("image", ua.getAchievement().getImage());
              dto.put("dateAchieved", ua.getDateAchieved());
              return dto;
          })
          .collect(Collectors.toList());
      
      Map<String, Object> response = new HashMap<>();
      response.put("unlocked", unlockedAchievementDTOs);
      response.put("progress", progress);
      
      return ResponseEntity.ok(response);
  }
}

