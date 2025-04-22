package edu.cit.fitflow.config;

import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import edu.cit.fitflow.service.UserService;
import edu.cit.fitflow.entity.UserEntity;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;  // Inject JwtUtil instead of jwtSecret

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = extractTokenFromRequest(request);
            
            if (token != null) {
                Claims claims = jwtUtil.validateAndParseToken(token);  // Use JwtUtil
                
                if (claims != null) {
                    String userId = claims.getSubject();
                    String role = claims.get("role", String.class); // Extract role from JWT claims
                    
                    UserEntity user = userService.findById(Integer.parseInt(userId));
                    
                    if (user != null) {
                        // Set role in authentication
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("Authentication set for user ID: {} with role: {}", userId, role);
                    } else {
                        logger.warn("No user found for ID: {}", userId);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Authentication error", e);
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}