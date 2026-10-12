
package com.hostel360.controller;

import com.hostel360.entity.Administrator;
import com.hostel360.repository.AdministratorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/administrators")
@CrossOrigin(origins = "http://localhost:5173")
public class AdministratorController {

    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministratorController(
            AdministratorRepository administratorRepository,
            PasswordEncoder passwordEncoder) {
        this.administratorRepository = administratorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create an administrator account
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Administrator request) {

        if (request.getName() == null ||
            request.getName().isBlank() ||
            request.getEmail() == null ||
            request.getEmail().isBlank() ||
            request.getPassword() == null ||
            request.getPassword().length() < 8) {

            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "Name, email, and a password of at least 8 characters are required.")
            );
        }

        if (administratorRepository
                .findByEmail(request.getEmail().trim())
                .isPresent()) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", "Administrator email already exists.")
            );
        }

        Administrator admin = new Administrator(
            request.getName().trim(),
            request.getEmail().trim(),
            passwordEncoder.encode(request.getPassword())
        );

        administratorRepository.save(admin);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("message", "Administrator created successfully.")
        );
    }
}
