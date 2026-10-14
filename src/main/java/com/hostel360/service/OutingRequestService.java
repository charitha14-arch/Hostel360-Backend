package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.OutingRequest;
import com.hostel360.repository.OutingRequestRepository;

@Service
public class OutingRequestService {

    private final OutingRequestRepository outingRequestRepository;

    public OutingRequestService(OutingRequestRepository outingRequestRepository) {
        this.outingRequestRepository = outingRequestRepository;
    }

    public List<OutingRequest> getAllOutingRequests() {
        return outingRequestRepository.findAll();
    }

    public OutingRequest getOutingRequestById(Long id) {
        return outingRequestRepository.findById(id).orElse(null);
    }

    public OutingRequest addOutingRequest(OutingRequest outingRequest) {
        return outingRequestRepository.save(outingRequest);
    }

    public OutingRequest updateOutingRequest(Long id, OutingRequest outingRequest) {

        OutingRequest existing =
                outingRequestRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStudentName(outingRequest.getStudentName());
            existing.setReason(outingRequest.getReason());
            existing.setOutingDate(outingRequest.getOutingDate());
            existing.setReturnDate(outingRequest.getReturnDate());
            existing.setStatus(outingRequest.getStatus());

            return outingRequestRepository.save(existing);
        }

        return null;
    }

    public void deleteOutingRequest(Long id) {
        outingRequestRepository.deleteById(id);
    }
}