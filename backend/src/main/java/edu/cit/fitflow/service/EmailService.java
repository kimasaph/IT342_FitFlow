package edu.cit.fitflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String code) {
        logger.info("Starting to send verification email to: {}", toEmail);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("asaphbacaltos@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Your FitFlow Verification Code");
            message.setText("Hello,\n\nYour verification code is: " + code + 
                          "\n\nThis code will expire in 15 minutes.\n\nThank you,\nFitFlow Team");
            
            logger.info("Configured email message, sending to: {}", toEmail);
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}. Error: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage(), e);
        }
    }
}