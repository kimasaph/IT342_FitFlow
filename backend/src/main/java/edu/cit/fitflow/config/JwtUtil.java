package edu.cit.fitflow.config;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

import java.util.Base64;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import edu.cit.fitflow.entity.UserEntity;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    private final SecretKey key;
    
    // Token validity period (24 hours in milliseconds)
    private static final long JWT_EXPIRATION = 86400000;
    
    // Inject a strong, fixed secret from application.properties
    public JwtUtil(@Value("${jwt.secret:defaultStrongSecretKey12345678901234567890123456789012}") String secret) {
        // Create a key using the provided secret
        // The secret must be at least 64 bytes for HS512
        if (secret.length() < 64) {
            logger.warn("JWT secret is less than the recommended length of 64 characters");
            // Pad the secret if it's too short (development only - not secure for production)
            while (secret.length() < 64) {
                secret += secret;
            }
            secret = secret.substring(0, 64);
        }
        
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        logger.info("JWT signing key initialized with fixed secret");
    }
    
    public SecretKey getSigningKey() {
        return key;
    }
    
    // Generate token from UserEntity
    public String generateToken(UserEntity user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        
        String userId = String.valueOf(user.getId());
        
        return Jwts.builder()
            .setSubject(userId)
            .claim("role", user.getRole().name()) // Include role in the token
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key)
            .compact();
    }
    
    // Validate token and extract claims
    public Claims validateAndParseToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return null;
        }
    }
    
    // Extract user ID from token
    public Integer getUserIdFromToken(String token) {
        Claims claims = validateAndParseToken(token);
        if (claims != null) {
            return Integer.parseInt(claims.getSubject());
        }
        return null;
    }
}