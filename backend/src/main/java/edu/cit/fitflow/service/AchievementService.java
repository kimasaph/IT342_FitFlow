package edu.cit.fitflow.service;

import edu.cit.fitflow.entity.AchievementEntity;
import edu.cit.fitflow.entity.AchievementProgressEntity;
import edu.cit.fitflow.entity.UserAchievementEntity;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.AchievementRepository;
import edu.cit.fitflow.repository.AchievementProgressRepository;
import edu.cit.fitflow.repository.UserAchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementService.class);

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final AchievementProgressRepository progressRepository;

    public List<UserAchievementEntity> getUserAchievements(UserEntity user) {
        return userAchievementRepository.findByUser(user);
    }

    public void unlockFirstMealAchievement(UserEntity user) {
        unlockAchievement(user, "First Meal Logged");
    }
    
    public void unlockMealMasterAchievement(UserEntity user) {
        unlockAchievement(user, "Meal Master");
    }

    // Check and unlock achievement if needed
    public void checkAndUnlockAchievement(UserEntity user, String triggerEvent) {
      AchievementEntity achievement = achievementRepository.findByTriggerEvent(triggerEvent)
          .orElse(null);
          
      if (achievement != null) {
          // Check if user already has this achievement
          Optional<UserAchievementEntity> existingAchievement = 
              userAchievementRepository.findByUserAndAchievement(user, achievement);
              
          if (existingAchievement.isEmpty()) {
              // Create new achievement for user
              UserAchievementEntity userAchievement = new UserAchievementEntity();
              userAchievement.setUser(user);
              userAchievement.setAchievement(achievement);
              userAchievement.setDateAchieved(new Date());
              userAchievementRepository.save(userAchievement);
          }
      }
  }
  
   // Update progress-based achievements with progress tracking
    public void updateAchievementProgress(UserEntity user, String triggerEvent, int progress) {
        // Save the progress regardless of achievement status
        AchievementProgressEntity progressEntity = progressRepository
            .findByUserAndTriggerEvent(user, triggerEvent)
            .orElse(new AchievementProgressEntity());
        
        progressEntity.setUser(user);
        progressEntity.setTriggerEvent(triggerEvent);
        progressEntity.setCurrentProgress(progress);
        progressRepository.save(progressEntity);
        
        // Check if achievement should be unlocked
        AchievementEntity achievement = achievementRepository.findByTriggerEvent(triggerEvent)
            .orElse(null);
            
        if (achievement != null) {
            // Get required count from achievement name pattern (e.g., meals_created_5 -> 5)
            int requiredCount = Integer.parseInt(triggerEvent.substring(triggerEvent.lastIndexOf("_") + 1));
            
            // Check if user already has this achievement
            Optional<UserAchievementEntity> existingAchievement = 
                userAchievementRepository.findByUserAndAchievement(user, achievement);
                
            if (existingAchievement.isEmpty() && progress >= requiredCount) {
                // User reached the goal, unlock achievement
                UserAchievementEntity userAchievement = new UserAchievementEntity();
                userAchievement.setUser(user);
                userAchievement.setAchievement(achievement);
                userAchievement.setDateAchieved(new Date());
                userAchievementRepository.save(userAchievement);
            }
        }
    }
    
    private void unlockAchievement(UserEntity user, String achievementTitle) {
        try {
            // Check if already unlocked
            boolean alreadyUnlocked = userAchievementRepository.existsByUserIdAndAchievement_Title(
                    user.getId(), achievementTitle
            );

            if (alreadyUnlocked) {
                logger.info("Achievement '{}' already unlocked for user {}", achievementTitle, user.getId());
                return;
            }

            // Get AchievementEntity
            Optional<AchievementEntity> achievementOptional = achievementRepository.findByTitle(achievementTitle);
            
            if (achievementOptional.isEmpty()) {
                logger.error("Achievement '{}' not found in the database", achievementTitle);
                return; // Skip instead of throwing exception
            }
            
            AchievementEntity achievement = achievementOptional.get();

            // Create new UserAchievementEntity
            UserAchievementEntity userAchievement = new UserAchievementEntity();
            userAchievement.setUser(user);
            userAchievement.setAchievement(achievement);
            userAchievement.setDateAchieved(new Date());

            userAchievementRepository.save(userAchievement);
            logger.info("Achievement '{}' unlocked for user {}", achievementTitle, user.getId());
            
        } catch (Exception e) {
            // Log the error but don't break the main flow
            logger.error("Error while unlocking achievement '{}' for user {}: {}", 
                    achievementTitle, user.getId(), e.getMessage());
        }
    }

    public Map<String, Integer> getProgressForUser(UserEntity user) {
        List<AchievementProgressEntity> progressEntities = 
            progressRepository.findByUser(user);
        
        Map<String, Integer> progressMap = new HashMap<>();
        for (AchievementProgressEntity progress : progressEntities) {
            progressMap.put(progress.getTriggerEvent(), progress.getCurrentProgress());
        }
        
        return progressMap;
    }
}