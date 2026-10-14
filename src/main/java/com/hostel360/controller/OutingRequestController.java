package com.hostel360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hostel360.entity.OutingRequest;
import com.hostel360.service.OutingRequestService;

@RestController
@RequestMapping("/api/outing-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class OutingRequestController {

    private final OutingRequestService outingRequestService;

    public OutingRequestController(OutingRequestService outingRequestService) {
        this.outingRequestService = outingRequestService;
    }

    @GetMapping
    public List<OutingRequest> getAllOutingRequests() {
        return outingRequestService.getAllOutingRequests();
    }

    @GetMapping("/{id}")
    public OutingRequest getOutingRequestById(@PathVariable Long id) {
        return outingRequestService.getOutingRequestById(id);
    }

    @PostMapping
    public OutingRequest addOutingRequest(
            @RequestBody OutingRequest outingRequest) {
        return outingRequestService.addOutingRequest(outingRequest);
    }

    @PutMapping("/{id}")
    public OutingRequest updateOutingRequest(
            @PathVariable Long id,
            @RequestBody OutingRequest outingRequest) {
        return outingRequestService.updateOutingRequest(id, outingRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteOutingRequest(@PathVariable Long id) {
        outingRequestService.deleteOutingRequest(id);
    }
}