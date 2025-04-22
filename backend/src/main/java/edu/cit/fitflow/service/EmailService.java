package edu.cit.fitflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

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
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("fitflow0000@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Your FitFlow Verification Code");

            // HTML content for the email
            String htmlContent = "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>" +
                "<h2 style='color:rgb(0, 4, 255); text-align: center;'>Welcome to FitFlow!</h2>" +
                "<p>Dear User,</p>" +
                "<p>Thank you for signing up for FitFlow. To complete your registration, please use the verification code below:</p>" +
                "<div style='text-align: center; margin: 20px 0;'>" +
                "<span style='font-size: 24px; font-weight: bold; color:rgb(0, 4, 255);'>" + code + "</span>" +
                "</div>" +
                "<p>This code will expire in <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>" +
                "<p>For any assistance, feel free to contact our support team.</p>" +
                "<br>" +
                "<p style='text-align: center; font-size: 14px; color: #888;'>Best regards,</p>" +
                "<p style='text-align: center; font-size: 14px; color: #888;'><strong>FitFlow Team</strong></p>" +
                "</div>" +
                "</body>" +
                "</html>";

            helper.setText(htmlContent, true); // Enable HTML content

            logger.info("Configured email message, sending to: {}", toEmail);
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}. Error: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage(), e);
        }
    }
}