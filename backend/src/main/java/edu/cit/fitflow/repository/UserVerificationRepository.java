package edu.cit.fitflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.fitflow.entity.VerificationCodeEntity;

public interface UserVerificationRepository extends JpaRepository<VerificationCodeEntity, Long> {
  Optional<VerificationCodeEntity> findByEmailAndCode(String email, String code);
  Optional<VerificationCodeEntity> findByEmail(String email);
}