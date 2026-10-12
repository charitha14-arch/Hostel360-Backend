package com.hostel360.controller;

import com.hostel360.entity.Warden;
import com.hostel360.repository.WardenRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wardens")
@CrossOrigin(origins = "http://localhost:5173")
public class WardenController {

    private final WardenRepository wardenRepository;
    private final PasswordEncoder passwordEncoder;

    public WardenController(
            WardenRepository wardenRepository,
            PasswordEncoder passwordEncoder) {
        this.wardenRepository = wardenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a warden
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String block = request.get("assignedBlock");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.length() < 8
                || block == null || block.isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "Name, email, password (minimum 8 characters), and assigned block are required.")
            );
        }

        String cleanEmail = email.trim();

        if (wardenRepository.findByEmail(cleanEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", "Warden email already exists.")
            );
        }

        Warden warden = new Warden();
        warden.setName(name.trim());
        warden.setEmail(cleanEmail);
        warden.setPassword(passwordEncoder.encode(password));
        warden.setAssignedBlock(block.trim());

        Warden saved = wardenRepository.save(warden);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            toResponse(saved)
        );
    }

    // Get all wardens
    @GetMapping
    public List<Map<String, Object>> getAllWardens() {
        return wardenRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get one warden
    @GetMapping("/{id}")
    public ResponseEntity<?> getWarden(@PathVariable Long id) {
        return wardenRepository.findById(id)
                .<ResponseEntity<?>>map(w ->
                    ResponseEntity.ok(toResponse(w)))
                .orElseGet(() ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        Map.of("message", "Warden not found.")
                    ));
    }

    // Update warden details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWarden(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        Warden warden = wardenRepository.findById(id)
                .orElse(null);

        if (warden == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "Warden not found.")
            );
        }

        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String block = request.get("assignedBlock");

        if (name != null && !name.isBlank()) {
            warden.setName(name.trim());
        }

        if (email != null && !email.isBlank()) {
            String cleanEmail = email.trim();

            boolean duplicate = wardenRepository
                    .findByEmail(cleanEmail)
                    .filter(other -> !other.getId().equals(id))
                    .isPresent();

            if (duplicate) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "Warden email already exists.")
                );
            }

            warden.setEmail(cleanEmail);
        }

        if (block != null && !block.isBlank()) {
            warden.setAssignedBlock(block.trim());
        }

        if (password != null && !password.isBlank()) {
            if (password.length() < 8) {
                return ResponseEntity.badRequest().body(
                    Map.of("message",
                        "Password must contain at least 8 characters.")
                );
            }

            warden.setPassword(passwordEncoder.encode(password));
        }

        return ResponseEntity.ok(
            toResponse(wardenRepository.save(warden))
        );
    }

    // Delete a warden
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarden(@PathVariable Long id) {
        if (!wardenRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "Warden not found.")
            );
        }

        wardenRepository.deleteById(id);

        return ResponseEntity.ok(
            Map.of("message", "Warden deleted successfully.")
        );
    }

    // Safe response: never return the password
    private Map<String, Object> toResponse(Warden w) {
        return Map.of(
            "id", w.getId(),
            "name", w.getName(),
            "email", w.getEmail(),
            "assignedBlock",
            w.getAssignedBlock() == null
                ? "" : w.getAssignedBlock()
        );
    }
}