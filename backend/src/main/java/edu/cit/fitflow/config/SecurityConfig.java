package edu.cit.fitflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import edu.cit.fitflow.service.UserService;
import edu.cit.fitflow.entity.UserEntity;
import java.util.Date;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // Allow all requests
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Your frontend URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Remove the generateToken method that takes OAuth2User
    private String generateToken(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        UserEntity user = userService.findByEmail(email);
        return jwtUtil.generateToken(user);  // Use JwtUtil instead
    }

    private SecretKey getSigningKey() {
        // If you want to keep using your application.properties secret but make it secure:
        // (Note: this will only work if your secret is sufficiently long)
        // return Keys.hmacShaKeyFor(jwtSecretString.getBytes(StandardCharsets.UTF_8));
        
        // Or, better approach: generate a secure key
        return Keys.secretKeyFor(SignatureAlgorithm.HS512);
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
                // Extract user details based on provider
                switch (registrationId) {
                    case "github":
                        email = oauth2User.getAttribute("email");
                        if (email == null) {
                            String login = oauth2User.getAttribute("login");
                            email = login + "@github.com";
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
                    
                    default: // Google and others
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
                    user.setPassword(passwordEncoder().encode("oauth2user"));
                    user.setCreated_at(new Date());
                    
                    // Set name
                    if (name != null) {
                        String[] nameParts = name.split(" ", 2);
                        user.setFirstName(nameParts[0]);
                        if (nameParts.length > 1) {
                            user.setLastName(nameParts[1]);
                        }
                    }
                    
                    // Set default values for required fields
                    user.setPhoneNumber("");
                    
                    userService.createUser(user);
                }

                // Create a custom OAuth2User that includes our user details
                Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());
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
            
            try {
                UserEntity user = userService.findByEmail(email);
                if (user == null) {
                    logger.error("No user found for email: " + email);
                    response.sendRedirect("http://localhost:5173/login?error=no_user");
                    return;
                }
                
                String token = jwtUtil.generateToken(user);  // Use JwtUtil here
                logger.info("Generated token for user: " + email);
    
                response.sendRedirect(
                String.format("http://localhost:5173/oauth2/redirect?token=%s&userId=%s&email=%s", 
                    token, 
                    user.getId(), 
                    URLEncoder.encode(email, StandardCharsets.UTF_8)
                )
            );
            } catch (Exception e) {
                logger.error("Error in OAuth2 success handler", e);
                response.sendRedirect("http://localhost:5173/login?error=auth_failed");
            }
        };
    }
}