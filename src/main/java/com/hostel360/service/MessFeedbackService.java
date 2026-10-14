package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.MessFeedback;
import com.hostel360.repository.MessFeedbackRepository;

@Service
public class MessFeedbackService {

    private final MessFeedbackRepository messFeedbackRepository;

    public MessFeedbackService(MessFeedbackRepository messFeedbackRepository) {
        this.messFeedbackRepository = messFeedbackRepository;
    }

    public List<MessFeedback> getAllFeedback() {
        return messFeedbackRepository.findAll();
    }

    public MessFeedback getFeedbackById(Long id) {
        return messFeedbackRepository.findById(id).orElse(null);
    }

    public MessFeedback addFeedback(MessFeedback feedback) {
        return messFeedbackRepository.save(feedback);
    }

    public MessFeedback updateFeedback(Long id, MessFeedback feedback) {

        MessFeedback existing =
                messFeedbackRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStudentName(feedback.getStudentName());
            existing.setRating(feedback.getRating());

            return messFeedbackRepository.save(existing);
        }

        return null;
    }

    public void deleteFeedback(Long id) {
        messFeedbackRepository.deleteById(id);
    }
}