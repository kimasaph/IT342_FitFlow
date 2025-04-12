package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.MealEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<MealEntity, Integer> {
    List<MealEntity> findByDietPlanId(Integer dietPlanId);
}