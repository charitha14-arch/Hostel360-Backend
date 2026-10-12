
package com.hostel360.service;

import com.hostel360.entity.Outing;
import com.hostel360.repository.OutingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutingService {

    private final OutingRepository outingRepository;

    public OutingService(OutingRepository outingRepository) {
        this.outingRepository = outingRepository;
    }

    public Outing createRequest(Outing outing) {
        if (outing.getStudentId() == null
                || outing.getStudentId() <= 0) {
            throw new RuntimeException("Valid student ID is required");
        }

        if (outing.getReason() == null
                || outing.getReason().isBlank()) {
            throw new RuntimeException("Reason is required");
        }

        if (outing.getOutingDate() == null
                || outing.getReturnDate() == null) {
            throw new RuntimeException("Outing and return dates are required");
        }

        if (!outing.getReturnDate().isAfter(outing.getOutingDate())) {
            throw new RuntimeException("Return date must be after outing date");
        }

        outing.setId(null);
        outing.setStatus("PENDING");

        return outingRepository.save(outing);
    }

    public List<Outing> getAllRequests() {
        return outingRepository.findAll();
    }

    public Outing getRequestById(Long id) {
        return outingRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Outing request not found: " + id));
    }

    public List<Outing> getRequestsByStudent(Long studentId) {
        return outingRepository.findByStudentId(studentId);
    }

    public List<Outing> getRequestsByStatus(String status) {
        return outingRepository.findByStatus(status.toUpperCase());
    }

    public Outing updateRequest(Long id, String status, String remark) {
        if (status == null ||
                !List.of("APPROVED", "REJECTED", "PENDING")
                        .contains(status.toUpperCase())) {
            throw new RuntimeException(
                    "Status must be APPROVED, REJECTED, or PENDING");
        }

        Outing outing = getRequestById(id);
        outing.setStatus(status.toUpperCase());
        outing.setWardenRemark(remark);

        return outingRepository.save(outing);
    }

    public void deleteRequest(Long id) {
        Outing outing = getRequestById(id);
        outingRepository.delete(outing);
    }
}
