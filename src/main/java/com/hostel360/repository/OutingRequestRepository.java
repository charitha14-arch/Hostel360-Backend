package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.OutingRequest;

public interface OutingRequestRepository extends JpaRepository<OutingRequest, Long> {
}