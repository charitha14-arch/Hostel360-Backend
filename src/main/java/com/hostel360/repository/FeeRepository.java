package com.hostel360.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hostel360.entity.Fee;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudentEmail(String studentEmail);

}