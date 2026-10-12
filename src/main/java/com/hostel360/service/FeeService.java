
package com.hostel360.service;

import com.hostel360.entity.Fee;
import com.hostel360.repository.FeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    // Add a fee
    public Fee addFee(Fee fee) {
        if (fee.getStudentId() == null || fee.getStudentId() <= 0) {
            throw new RuntimeException("Valid student ID is required");
        }

        if (fee.getAmount() <= 0) {
            throw new RuntimeException("Fee amount must be greater than zero");
        }

        fee.setStatus("PENDING");
        fee.setPaymentDate(null);

        return feeRepository.save(fee);
    }

    // Get all fees
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    // Get a fee by ID
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Fee not found with ID: " + id));
    }

    // Get fees for one student
    public List<Fee> getFeesByStudentId(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    // Get fees by status
    public List<Fee> getFeesByStatus(String status) {
        return feeRepository.findByStatus(status);
    }

    // Mark a fee as paid
    public Fee markFeeAsPaid(Long id) {
        Fee fee = getFeeById(id);

        fee.setStatus("PAID");
        fee.setPaymentDate(java.time.LocalDate.now());

        return feeRepository.save(fee);
    }

    // Delete a fee
    public void deleteFee(Long id) {
        Fee fee = getFeeById(id);
        feeRepository.delete(fee);
    }
}
