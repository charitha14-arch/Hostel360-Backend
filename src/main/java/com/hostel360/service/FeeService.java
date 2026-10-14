package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.Fee;
import com.hostel360.repository.FeeRepository;

@Service
public class FeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    // Get all fee records
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    // Get fee by ID
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));
    }

    // Get fees of a particular student
    public List<Fee> getFeesByStudentEmail(String studentEmail) {
        return feeRepository.findByStudentEmail(studentEmail);
    }

    // Add new fee
    public Fee addFee(Fee fee) {

        calculatePendingAmount(fee);

        return feeRepository.save(fee);
    }

    // Update fee
    public Fee updateFee(Long id, Fee feeDetails) {

        Fee fee = getFeeById(id);

        fee.setStudentName(feeDetails.getStudentName());
        fee.setStudentEmail(feeDetails.getStudentEmail());
        fee.setFeeType(feeDetails.getFeeType());
        fee.setTotalAmount(feeDetails.getTotalAmount());
        fee.setPaidAmount(feeDetails.getPaidAmount());
        fee.setDueDate(feeDetails.getDueDate());
        fee.setPaymentDate(feeDetails.getPaymentDate());

        calculatePendingAmount(fee);

        return feeRepository.save(fee);
    }

    // Delete fee
    public void deleteFee(Long id) {

        if (!feeRepository.existsById(id)) {
            throw new RuntimeException("Fee record not found");
        }

        feeRepository.deleteById(id);
    }

    // Calculate pending amount and status
    private void calculatePendingAmount(Fee fee) {

        double pending = fee.getTotalAmount() - fee.getPaidAmount();

        if (pending < 0) {
            pending = 0;
        }

        fee.setPendingAmount(pending);

        if (fee.getPaidAmount() <= 0) {
            fee.setStatus("PENDING");
        } else if (fee.getPaidAmount() < fee.getTotalAmount()) {
            fee.setStatus("PARTIAL");
        } else {
            fee.setStatus("PAID");
        }
    }
}