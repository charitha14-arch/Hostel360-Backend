
package com.hostel360.service;

import com.hostel360.entity.Complaint;
import com.hostel360.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint addComplaint(Complaint complaint) {
        if (complaint.getStudentId() == null
                || complaint.getStudentId() <= 0) {
            throw new RuntimeException("Valid student ID is required");
        }

        if (complaint.getTitle() == null
                || complaint.getTitle().isBlank()) {
            throw new RuntimeException("Complaint title is required");
        }

        if (complaint.getDescription() == null
                || complaint.getDescription().isBlank()) {
            throw new RuntimeException("Description is required");
        }

        complaint.setStatus("PENDING");
        complaint.setId(null);
        complaint.setCreatedAt(null);

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Complaint not found with ID: " + id));
    }

    public List<Complaint> getComplaintsByStudentId(Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status.toUpperCase());
    }

    public Complaint updateStatus(Long id, String status) {
        if (status == null ||
                !List.of("PENDING", "IN_PROGRESS", "RESOLVED")
                    .contains(status.toUpperCase())) {
            throw new RuntimeException(
                "Status must be PENDING, IN_PROGRESS, or RESOLVED");
        }

        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status.toUpperCase());

        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(Long id) {
        Complaint complaint = getComplaintById(id);
        complaintRepository.delete(complaint);
    }
}
