package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.DietPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlanEntity, Integer> {
    List<DietPlanEntity> findByUserId(Integer userId);
}