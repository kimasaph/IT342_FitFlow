package edu.cit.fitflow.config;

import java.util.Arrays;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.entity.Role;
import edu.cit.fitflow.service.UserService;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    
    // Instead of autowiring these, we'll look them up from the application context
    // during the filterChain method execution
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, 
                                          OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService,
                                          AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/oauth2/**").permitAll()
                .anyRequest().permitAll()  // Change this to authenticated() in production
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(oauth2UserService)
                )
                .successHandler(oauth2AuthenticationSuccessHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
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

    @Bean
    public CommandLineRunner createDefaultAdmin(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@fitflow.com";
            if (userService.findByEmail(adminEmail) == null) {
                UserEntity admin = new UserEntity();
                admin.setEmail(adminEmail);
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("Admin1234!")); // Ensure password is hashed
                admin.setRole(Role.ADMIN); // Set role as ADMIN
                admin.setFirstName("Admin");
                admin.setLastName("Admin");
                admin.setPhoneNumber("0000000000"); // Default phone number
                admin.setGender("Not Specified"); // Default gender
                admin.setHeight(0.0F); // Default height
                admin.setWeight(0.0F); // Default weight
                admin.setAge(0); // Default age
                admin.setBodyGoal("Not Specified"); // Default body goal
                admin.setCreated_at(new Date());
                userService.createUser(admin);
                System.out.println("Default admin account created: " + adminEmail);
            }
        };
    }
}