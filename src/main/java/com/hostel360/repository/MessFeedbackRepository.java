package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.MessFeedback;

public interface MessFeedbackRepository extends JpaRepository<MessFeedback, Long> {
}