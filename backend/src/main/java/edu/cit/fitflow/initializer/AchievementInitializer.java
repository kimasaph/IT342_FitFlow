package edu.cit.fitflow.initializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import edu.cit.fitflow.repository.AchievementRepository;
import edu.cit.fitflow.entity.AchievementEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class AchievementInitializer implements CommandLineRunner {

    @Autowired
    private AchievementRepository achievementRepository;

    @Override
    public void run(String... args) {
        // Check if achievements already exist
        long count = achievementRepository.count();
        if (count == 0) {
            // Create and save default achievements
            List<AchievementEntity> defaultAchievements = Arrays.asList(
                createAchievement(
                    "First Meal Logged", 
                    "Record your first meal in the app", 
                    "🍽️", 
                    "meal_logged"
                ),
                createAchievement(
                    "Meal Master", 
                    "Create 5 custom meals", 
                    "🍽️", 
                    "meals_created_5"
                ),
                // Add other achievements from your frontend here
                createAchievement(
                    "Early Bird", 
                    "Complete 5 workouts before 8 AM", 
                    "🌅", 
                    "early_workout"
                ),
                createAchievement(
                    "Protein King", 
                    "Meet your protein goal for 7 consecutive days", 
                    "👑", 
                    "protein_streak"
                ),
                createAchievement(
                    "Hydration Hero", 
                    "Drink 3L of water daily for 5 days", 
                    "🌊", 
                    "hydration_streak"
                ),
                createAchievement(
                    "Consistency Champion", 
                    "Log in to FitFlow for 30 days in a row", 
                    "🔥", 
                    "login_streak"
                ),
                createAchievement(
                    "Weight Warrior", 
                    "Record weight 10 days in a row", 
                    "⚖️", 
                    "weight_streak"
                ),
                createAchievement(
                    "Cardio Crusher", 
                    "Complete 10 cardio sessions", 
                    "🏃", 
                    "cardio_completed"
                ),
                createAchievement(
                    "Sleep Expert", 
                    "Get 8 hours of sleep for 7 days", 
                    "💤", 
                    "sleep_streak"
                )
            );
            
            achievementRepository.saveAll(defaultAchievements);
            System.out.println("Default achievements created!");
        } else {
            System.out.println("Achievements already exist. Skipping initialization.");
        }
    }
    
    private AchievementEntity createAchievement(String title, String description, String image, String triggerEvent) {
        AchievementEntity achievement = new AchievementEntity();
        achievement.setTitle(title);
        achievement.setDescription(description);
        achievement.setImage(image);
        achievement.setTriggerEvent(triggerEvent);
        achievement.setCreated_at(new Date());
        return achievement;
    }
}