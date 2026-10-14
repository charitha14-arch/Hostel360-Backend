package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.CleaningRequest;
import com.hostel360.repository.CleaningRequestRepository;

@Service
public class CleaningRequestService {

    private final CleaningRequestRepository cleaningRequestRepository;

    public CleaningRequestService(CleaningRequestRepository cleaningRequestRepository) {
        this.cleaningRequestRepository = cleaningRequestRepository;
    }

    public List<CleaningRequest> getAllCleaningRequests() {
        return cleaningRequestRepository.findAll();
    }

    public CleaningRequest getCleaningRequestById(Long id) {
        return cleaningRequestRepository.findById(id).orElse(null);
    }

    public CleaningRequest addCleaningRequest(CleaningRequest cleaningRequest) {
        return cleaningRequestRepository.save(cleaningRequest);
    }

    public CleaningRequest updateCleaningRequest(Long id, CleaningRequest cleaningRequest) {

        CleaningRequest existing =
                cleaningRequestRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setRoomNumber(cleaningRequest.getRoomNumber());
            existing.setStudentName(cleaningRequest.getStudentName());
            existing.setCleaningType(cleaningRequest.getCleaningType());
            existing.setPreferredDate(cleaningRequest.getPreferredDate());
            existing.setPreferredTime(cleaningRequest.getPreferredTime());
            existing.setNote(cleaningRequest.getNote());
            existing.setStatus(cleaningRequest.getStatus());

            return cleaningRequestRepository.save(existing);
        }

        return null;
    }

    public void deleteCleaningRequest(Long id) {
        cleaningRequestRepository.deleteById(id);
    }
}