
package com.hostel360.controller;

import com.hostel360.entity.Outing;
import com.hostel360.service.OutingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outings")
@CrossOrigin(origins = "http://localhost:5173")
public class OutingController {

    private final OutingService outingService;

    public OutingController(OutingService outingService) {
        this.outingService = outingService;
    }

    @PostMapping
    public Outing createRequest(@RequestBody Outing outing) {
        return outingService.createRequest(outing);
    }

    @GetMapping
    public List<Outing> getAllRequests() {
        return outingService.getAllRequests();
    }

    @GetMapping("/{id}")
    public Outing getRequestById(@PathVariable Long id) {
        return outingService.getRequestById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<Outing> getByStudent(@PathVariable Long studentId) {
        return outingService.getRequestsByStudent(studentId);
    }

    @GetMapping("/status/{status}")
    public List<Outing> getByStatus(@PathVariable String status) {
        return outingService.getRequestsByStatus(status);
    }

    @PutMapping("/{id}/status")
    public Outing updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return outingService.updateRequest(
                id,
                request.get("status"),
                request.get("wardenRemark")
        );
    }

    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        outingService.deleteRequest(id);
        return "Outing request deleted successfully";
    }
}
