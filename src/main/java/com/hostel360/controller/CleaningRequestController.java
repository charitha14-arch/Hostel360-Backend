package com.hostel360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hostel360.entity.CleaningRequest;
import com.hostel360.service.CleaningRequestService;

@RestController
@RequestMapping("/api/cleaning-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class CleaningRequestController {

    private final CleaningRequestService cleaningRequestService;

    public CleaningRequestController(
            CleaningRequestService cleaningRequestService) {
        this.cleaningRequestService = cleaningRequestService;
    }

    @GetMapping
    public List<CleaningRequest> getAllCleaningRequests() {
        return cleaningRequestService.getAllCleaningRequests();
    }

    @GetMapping("/{id}")
    public CleaningRequest getCleaningRequestById(
            @PathVariable Long id) {
        return cleaningRequestService.getCleaningRequestById(id);
    }

    @PostMapping
    public CleaningRequest addCleaningRequest(
            @RequestBody CleaningRequest cleaningRequest) {
        return cleaningRequestService.addCleaningRequest(cleaningRequest);
    }

    @PutMapping("/{id}")
    public CleaningRequest updateCleaningRequest(
            @PathVariable Long id,
            @RequestBody CleaningRequest cleaningRequest) {
        return cleaningRequestService.updateCleaningRequest(
                id, cleaningRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteCleaningRequest(@PathVariable Long id) {
        cleaningRequestService.deleteCleaningRequest(id);
    }
}