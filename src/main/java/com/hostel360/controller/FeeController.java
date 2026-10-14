package com.hostel360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hostel360.entity.Fee;
import com.hostel360.service.FeeService;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "http://localhost:5173")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
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

    // Get fees by student email
    @GetMapping("/student/{email}")
    public List<Fee> getFeesByStudentEmail(
            @PathVariable String email) {

        return feeService.getFeesByStudentEmail(email);
    }

    // Add fee
    @PostMapping
    public Fee addFee(@RequestBody Fee fee) {
        return feeService.addFee(fee);
    }

    // Update fee
    @PutMapping("/{id}")
    public Fee updateFee(
            @PathVariable Long id,
            @RequestBody Fee fee) {

        return feeService.updateFee(id, fee);
    }

    // Delete fee
    @DeleteMapping("/{id}")
    public void deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
    }
}