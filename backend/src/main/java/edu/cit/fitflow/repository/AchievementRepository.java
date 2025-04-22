package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.AchievementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AchievementRepository extends JpaRepository<AchievementEntity, Integer> {
  Optional<AchievementEntity> findByTitle(String title);
  Optional<AchievementEntity> findByTriggerEvent(String triggerEvent);
}
