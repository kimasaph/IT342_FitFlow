package edu.cit.fitflow.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import edu.cit.fitflow.service.UserService; // Ensure this matches the actual package of UserService
import edu.cit.fitflow.entity.Role;
import edu.cit.fitflow.entity.UserEntity; // Ensure this matches the actual package of UserEntity
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class OAuth2Config {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2Config.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper;
    }
    
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        
        return request -> {
            OAuth2User oauth2User = delegate.loadUser(request);
            String registrationId = request.getClientRegistration().getRegistrationId();
            
            String email = null;
            String name = null;
            String profilePicture = null;
            
            try {
              Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());
                // Extract user details based on provider
                switch (registrationId) {
                    case "google":
                        email = oauth2User.getAttribute("email");
                        name = oauth2User.getAttribute("name");
                        profilePicture = oauth2User.getAttribute("picture");
                        break;
                    case "github":
                        email = oauth2User.getAttribute("email");
                        if (email == null) {
                            String login = oauth2User.getAttribute("login");
                            email = login + "@github.com";
                            attributes.put("email", email);
                        }
                        name = oauth2User.getAttribute("name") != null 
                            ? oauth2User.getAttribute("name") 
                            : oauth2User.getAttribute("login");
                        profilePicture = oauth2User.getAttribute("avatar_url");
                        break;
                    
                    case "facebook":
                        email = oauth2User.getAttribute("email");
                        name = oauth2User.getAttribute("name");
                        profilePicture = oauth2User.getAttribute("picture.data.url");
                        break;
                    
                    default: // Other providers
                        email = oauth2User.getAttribute("email");
                        name = oauth2User.getAttribute("name");
                        profilePicture = oauth2User.getAttribute("picture");
                        break;
                }

                // Validate email
                if (email == null || email.isEmpty()) {
                    throw new OAuth2AuthenticationException("No email provided");
                }

                // Create or update user
                UserEntity user = userService.findByEmail(email);
                if (user == null) {
                    user = new UserEntity();
                    user.setEmail(email);
                    user.setUsername(email);
                    user.setPassword(passwordEncoder.encode("oauth2user"));
                    user.setCreated_at(new Date());
                    
                    // Set name
                    if (name != null) {
                        String[] nameParts = name.split(" ", 2);
                        user.setFirstName(nameParts[0]);
                        if (nameParts.length > 1) {
                            user.setLastName(nameParts[1]);
                        }
                    }
                    
                    // Set default values for required non-nullable fields
                    user.setPhoneNumber("");
                    
                    // Add these default values for the fields that cannot be null
                    user.setAge(0);  // Default age value
                    user.setGender("");  // Default gender value
                    user.setHeight(0.0F);  // Default height value
                    user.setWeight(0.0F);  // Default weight value
                    user.setBodyGoal("");  // Default body goal value
                    user.setRole(Role.USER); // Default role for OAuth2 users
                    
                    userService.createUser(user);
                }

                // Create a custom OAuth2User that includes our user details
                attributes.put("userId", user.getId());
                attributes.put("firstName", user.getFirstName());
                attributes.put("lastName", user.getLastName());

                return new DefaultOAuth2User(
                    oauth2User.getAuthorities(), 
                    attributes, 
                    registrationId.equals("github") ? "login" : "email"
                );
            } catch (Exception e) {
                logger.error("OAuth2 User Service Error: ", e);
                throw new OAuth2AuthenticationException(new OAuth2Error("authentication_failed"), e.getMessage(), e);
            }
        };
    }
    
    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
            
            // Add the same fallback for GitHub users with private emails
            if (email == null && "github".equals(registrationId)) {
                String login = oauth2User.getAttribute("login");
                if (login != null) {
                    email = login + "@github.com";
                    logger.info("Using fallback email for GitHub user: " + email);
                } else {
                    logger.error("Both email and login are null for OAuth2 GitHub user");
                    response.sendRedirect("http://localhost:5173/login?error=no_email_or_login");
                    return;
                }
            } else if (email == null) {
                logger.error("Email is null for OAuth2 user");
                response.sendRedirect("http://localhost:5173/login?error=no_email");
                return;
            }
            
            try {
                UserEntity user = userService.findByEmail(email);
                if (user == null) {
                    // Create a new user with the provided email
                    user = new UserEntity();
                    user.setEmail(email);
                    user.setUsername(email);
                    user.setPassword(passwordEncoder.encode("oauth2user"));
                    user.setCreated_at(new Date());
                    
                    // Set name from OAuth data
                    String name = oauth2User.getAttribute("name");
                    if (name == null && "github".equals(registrationId)) {
                        name = oauth2User.getAttribute("login");
                    }
                    
                    if (name != null) {
                        String[] nameParts = name.split(" ", 2);
                        user.setFirstName(nameParts[0]);
                        if (nameParts.length > 1) {
                            user.setLastName(nameParts[1]);
                        }
                    }
                    
                    // Set default values for required non-nullable fields
                    user.setPhoneNumber("");
                    user.setAge(0);
                    user.setGender("");
                    user.setHeight(0.0F);
                    user.setWeight(0.0F);
                    user.setBodyGoal("");
                    user.setRole(Role.USER); // Default role for OAuth2 users
                    
                    userService.createUser(user);
                    logger.info("Created new user for OAuth2 login: " + email);
                }
                            
                String token = jwtUtil.generateToken(user);
                logger.info("Generated token for user: " + email);
                
                // Encode user data for URL (using the ObjectMapper defined above)
                String userData = Base64.getUrlEncoder().encodeToString(
                    objectMapper().writeValueAsString(user).getBytes(StandardCharsets.UTF_8)
                );
    
                response.sendRedirect(
                    String.format("http://localhost:5173/oauth2/redirect?token=%s&userId=%s&email=%s&data=%s", 
                        URLEncoder.encode(token, StandardCharsets.UTF_8), 
                        user.getId(), 
                        URLEncoder.encode(email, StandardCharsets.UTF_8),
                        userData
                    )
                );
            } catch (Exception e) {
                logger.error("Error in OAuth2 success handler", e);
                response.sendRedirect("http://localhost:5173/login?error=auth_failed");
            }
        };
    }
}