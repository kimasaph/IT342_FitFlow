package edu.cit.fitflow.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.fitflow.entity.VerificationCodeEntity;
import edu.cit.fitflow.repository.UserVerificationRepository;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.UserRepository;
import edu.cit.fitflow.entity.Role;

@Service
public class VerificationService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);
    
    @Autowired
    private UserVerificationRepository codeRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Generate a random 6-digit code
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
    
    // Save code to database and send email
    public void createAndSendVerificationCode(String email) {
        logger.info("Creating verification code for email: {}", email);
        try {
            // Check if there's an existing code for this email
            Optional<VerificationCodeEntity> existingCode = codeRepository.findByEmail(email);
            existingCode.ifPresent(code -> {
                logger.info("Deleting existing code for email: {}", email);
                codeRepository.delete(code);
            });
            
            // Create new verification code
            String newCode = generateVerificationCode();
            VerificationCodeEntity userVerification = new VerificationCodeEntity(
                email, 
                newCode, 
                LocalDateTime.now().plusMinutes(15) // Code expires in 15 minutes
            );
            
            VerificationCodeEntity savedCode = codeRepository.save(userVerification);
            logger.info("Verification code created and saved with ID: {} for email: {}", 
                        savedCode.getId(), email);
            
            // Send email with code
            logger.info("Attempting to send verification code to: {}", email);
            emailService.sendVerificationEmail(email, newCode);
            logger.info("Successfully completed createAndSendVerificationCode for: {}", email);
        } catch (Exception e) {
            logger.error("Failed to create or send verification code to: {}", email, e);
            throw new RuntimeException("Failed to create or send verification code", e);
        }
    }
    
    // Verify the code
    public boolean verifyCode(String email, String code) {
        logger.info("Verifying code for email: {}", email);
        Optional<VerificationCodeEntity> verificationCode = codeRepository.findByEmailAndCode(email, code);
    
        if (verificationCode.isPresent()) {
            VerificationCodeEntity savedCode = verificationCode.get();
    
            // Check if code has expired
            if (LocalDateTime.now().isAfter(savedCode.getExpiryDate())) {
                logger.info("Code expired for email: {}", email);
                codeRepository.delete(savedCode);
                return false;
            }
    
            // Code is valid, delete it after use
            logger.info("Code verified successfully for email: {}", email);
            codeRepository.delete(savedCode);
            return true;
        }
    
        logger.info("Invalid code provided for email: {}", email);
        return false;
    }
}