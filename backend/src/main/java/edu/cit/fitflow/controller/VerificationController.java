package edu.cit.fitflow.controller;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.fitflow.service.VerificationService;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private static final Logger logger = LoggerFactory.getLogger(VerificationController.class);

    @Autowired
    private VerificationService verificationService;
    
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, String> response = new HashMap<>();
        
        if (email == null || email.isEmpty()) {
            logger.warn("Request received with missing email");
            response.put("status", "error");
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            logger.info("Sending verification code to email: {}", email);
            verificationService.createAndSendVerificationCode(email);
            
            response.put("status", "success");
            response.put("message", "Verification code sent to " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error sending verification code to email: {}", email, e);
            response.put("status", "error");
            response.put("message", "Failed to send verification code: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        Map<String, String> response = new HashMap<>();
        
        if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
            logger.warn("Request received with missing email or code");
            response.put("status", "error");
            response.put("message", "Email and code are required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            boolean isValid = verificationService.verifyCode(email, code);
            
            if (isValid) {
                logger.info("Code verified successfully for email: {}", email);
                response.put("status", "success");
                response.put("message", "Code verified successfully");
                return ResponseEntity.ok(response);
            } else {
                logger.info("Invalid or expired code for email: {}", email);
                response.put("status", "error");
                response.put("message", "Invalid or expired code");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Error verifying code for email: {}", email, e);
            response.put("status", "error");
            response.put("message", "Error verifying code: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}