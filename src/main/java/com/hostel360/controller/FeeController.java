
package com.hostel360.controller;

import com.hostel360.entity.Fee;
import com.hostel360.service.FeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "http://localhost:5173")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    // Add a fee
    @PostMapping
    public Fee addFee(@RequestBody Fee fee) {
        return feeService.addFee(fee);
    }

    // Get all fees
    @GetMapping
    public List<Fee> getAllFees() {
        return feeService.getAllFees();
    }

    // Get fee by ID
    @GetMapping("/{id}")
    public Fee getFeeById(@PathVariable Long id) {
        return feeService.getFeeById(id);
    }

    // Get fees by student ID
    @GetMapping("/student/{studentId}")
    public List<Fee> getFeesByStudentId(
            @PathVariable Long studentId) {
        return feeService.getFeesByStudentId(studentId);
    }

    // Get fees by status: PENDING or PAID
    @GetMapping("/status/{status}")
    public List<Fee> getFeesByStatus(
            @PathVariable String status) {
        return feeService.getFeesByStatus(status.toUpperCase());
    }

    // Mark a fee as paid
    @PutMapping("/{id}/pay")
    public Fee markFeeAsPaid(@PathVariable Long id) {
        return feeService.markFeeAsPaid(id);
    }

    // Delete a fee
    @DeleteMapping("/{id}")
    public String deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return "Fee deleted successfully";
    }
}
