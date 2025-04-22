package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.AchievementEntity;
import edu.cit.fitflow.entity.UserAchievementEntity;
import edu.cit.fitflow.entity.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends JpaRepository<UserAchievementEntity, Integer> {
    boolean existsByUserIdAndAchievement_Title(Integer userId, String title);
    List<UserAchievementEntity> findByUser(UserEntity user);
    Optional<UserAchievementEntity> findByUserAndAchievement(UserEntity user, AchievementEntity achievement);
}