package edu.cit.fitflow.repository;

import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.UserMealEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserMealRepository extends JpaRepository<UserMealEntity, Integer> {
      List<UserMealEntity> findByUser(UserEntity user);
}
