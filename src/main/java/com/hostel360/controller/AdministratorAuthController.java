
package com.hostel360.controller;

import com.hostel360.entity.Administrator;
import com.hostel360.repository.AdministratorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/administrator-auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AdministratorAuthController {

    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministratorAuthController(
            AdministratorRepository administratorRepository,
            PasswordEncoder passwordEncoder) {
        this.administratorRepository = administratorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Email and password are required.")
            );
        }

        Administrator admin = administratorRepository
                .findByEmail(email.trim())
                .orElse(null);

        if (admin == null ||
                !passwordEncoder.matches(
                    password, admin.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", "Invalid administrator email or password.")
            );
        }

        return ResponseEntity.ok(Map.of(
            "message", "Administrator login successful.",
            "role", "ADMIN",
            "name", admin.getName(),
            "email", admin.getEmail()
        ));
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.length() < 8) {

            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "Name, email and a password of at least 8 characters are required.")
            );
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (administratorRepository
                .findByEmail(normalizedEmail).isPresent()) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message",
                    "Administrator email is already registered.")
            );
        }

        Administrator admin = new Administrator();
        admin.setName(name.trim());
        admin.setEmail(normalizedEmail);
        admin.setPassword(passwordEncoder.encode(password));

        administratorRepository.save(admin);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "message", "Administrator registered successfully.",
                "name", admin.getName(),
                "email", admin.getEmail(),
                "role", "ADMIN"
            )
        );
    }
}
