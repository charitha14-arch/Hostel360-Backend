package com.hostel360.service;

import com.hostel360.dto.LoginRequest;
import com.hostel360.dto.RegisterRequest;
import com.hostel360.entity.User;
import com.hostel360.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register a new user
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email is already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Store an encoded password, never the original password
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        // Default new accounts to STUDENT
        String role = request.getRole();

        if (role == null || role.isBlank()) {
            role = "STUDENT";
        }

        user.setRole(role.trim().toUpperCase());

        userRepository.save(user);

        return "Registration successful";
    }

    // Login an existing user and generate a JWT
    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid email or password");
        }

        // Generate a token for the authenticated user
        return jwtService.generateToken(
                user.getEmail(),
                user.getRole());
    }
}