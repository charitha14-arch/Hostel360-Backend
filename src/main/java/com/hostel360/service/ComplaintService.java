package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.Complaint;
import com.hostel360.repository.ComplaintRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // Get all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get complaint by ID
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id).orElse(null);
    }

    // Add complaint
    public Complaint addComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Update complaint
    public Complaint updateComplaint(Long id, Complaint complaint) {

        Complaint existingComplaint =
                complaintRepository.findById(id).orElse(null);

        if (existingComplaint != null) {
            existingComplaint.setTitle(complaint.getTitle());
            existingComplaint.setDescription(complaint.getDescription());
            existingComplaint.setCategory(complaint.getCategory());
            existingComplaint.setPriority(complaint.getPriority());
            existingComplaint.setStatus(complaint.getStatus());

            return complaintRepository.save(existingComplaint);
        }

        return null;
    }

    // Delete complaint
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}