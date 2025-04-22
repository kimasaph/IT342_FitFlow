package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.WorkoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, Integer> {
    List<WorkoutEntity> findByUserId(Integer userId);
}
