package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}