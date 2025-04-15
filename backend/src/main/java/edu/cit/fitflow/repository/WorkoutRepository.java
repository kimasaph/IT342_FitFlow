package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.WorkoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, Long> {

}
