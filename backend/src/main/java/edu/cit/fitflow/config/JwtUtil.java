package edu.cit.fitflow.config;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
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

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        try {
            // Decode Base64-encoded secret from application.properties
            byte[] decodedKey = Base64.getDecoder().decode(secret);
            this.key = Keys.hmacShaKeyFor(decodedKey);
            logger.info("JWT signing key initialized from Base64-encoded secret");
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT secret: Must be valid Base64", e);
        }
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
