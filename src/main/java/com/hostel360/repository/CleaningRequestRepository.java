package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.CleaningRequest;

public interface CleaningRequestRepository extends JpaRepository<CleaningRequest, Long> {
}