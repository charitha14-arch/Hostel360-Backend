package com.hostel360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hostel360.entity.MessFeedback;
import com.hostel360.service.MessFeedbackService;

@RestController
@RequestMapping("/api/mess-feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class MessFeedbackController {

    private final MessFeedbackService messFeedbackService;

    public MessFeedbackController(MessFeedbackService messFeedbackService) {
        this.messFeedbackService = messFeedbackService;
    }

    @GetMapping
    public List<MessFeedback> getAllFeedback() {
        return messFeedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public MessFeedback getFeedbackById(@PathVariable Long id) {
        return messFeedbackService.getFeedbackById(id);
    }

    @PostMapping
    public MessFeedback addFeedback(
            @RequestBody MessFeedback feedback) {
        return messFeedbackService.addFeedback(feedback);
    }

    @PutMapping("/{id}")
    public MessFeedback updateFeedback(
            @PathVariable Long id,
            @RequestBody MessFeedback feedback) {
        return messFeedbackService.updateFeedback(id, feedback);
    }

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        messFeedbackService.deleteFeedback(id);
    }
}