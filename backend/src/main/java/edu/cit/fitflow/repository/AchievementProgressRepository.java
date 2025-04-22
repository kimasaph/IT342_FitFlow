package edu.cit.fitflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

import edu.cit.fitflow.entity.AchievementProgressEntity;
import edu.cit.fitflow.entity.UserEntity;

public interface AchievementProgressRepository extends JpaRepository<AchievementProgressEntity, Integer> {
          Optional<AchievementProgressEntity> findByUserAndTriggerEvent(UserEntity user, String triggerEvent);
          List<AchievementProgressEntity> findByUser(UserEntity user);
}
