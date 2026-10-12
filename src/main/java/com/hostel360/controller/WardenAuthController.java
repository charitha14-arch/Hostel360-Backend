package com.hostel360.controller;

import com.hostel360.entity.Warden;
import com.hostel360.repository.WardenRepository;
import com.hostel360.service.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/warden-auth")
@CrossOrigin(origins = "http://localhost:5173")
public class WardenAuthController {

    private final WardenRepository wardenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public WardenAuthController(
            WardenRepository wardenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.wardenRepository = wardenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank()
                || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Email and password are required.")
            );
        }

        Warden warden = wardenRepository
                .findByEmail(email.trim())
                .orElse(null);

        if (warden == null
                || !passwordEncoder.matches(
                    password, warden.getPassword())) {
            return ResponseEntity.status(
                    HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message",
                        "Invalid warden email or password."
                    ));
        }

        // Reuse the JWT service already in your project.
        String token = jwtService.generateToken(
        	    warden.getEmail(),
        	    "WARDEN"
        	);
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "token", token,
            "role", "WARDEN",
            "id", warden.getId(),
            "name", warden.getName(),
            "email", warden.getEmail(),
            "assignedBlock",
            warden.getAssignedBlock() == null
                ? "" : warden.getAssignedBlock()
        ));
    }
}