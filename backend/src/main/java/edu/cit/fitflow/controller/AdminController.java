package edu.cit.fitflow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.ResponseEntity;
import edu.cit.fitflow.config.JwtUtil;
import io.jsonwebtoken.Claims;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.service.UserService;
import java.util.List;
import java.util.stream.Collectors;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") // Restrict access to ADMIN role
public class AdminController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> accessAdminDashboard(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remove "Bearer " prefix
                Claims claims = jwtUtil.validateAndParseToken(token);

                if (claims != null && "ADMIN".equals(claims.get("role"))) {
                    return ResponseEntity.ok(Map.of("message", "Access granted to admin dashboard"));
                }
            }
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to decode token: " + e.getMessage()));
        }
    }

    @GetMapping("/users-by-role")
    public ResponseEntity<?> getUsersByRole(@RequestParam("role") String role) {
        try {
            List<UserEntity> users = userService.getAllUsers().stream()
                .filter(user -> !user.getRole().name().equals("ADMIN") && user.getRole().name().equalsIgnoreCase(role))
                .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/user-stats")
    public ResponseEntity<?> getUserStats() {
        try {
            List<UserEntity> users = userService.getAllUsers();
            long totalMembers = users.stream().filter(user -> user.getRole().name().equals("MEMBER")).count();
            long totalTrainers = users.stream().filter(user -> user.getRole().name().equals("TRAINER")).count();
            long totalUsers = totalMembers + totalTrainers;

            return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalMembers", totalMembers,
                "totalTrainers", totalTrainers
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user stats: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserEntity> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }
}
