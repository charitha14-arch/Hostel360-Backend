package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.LostAndFound;

public interface LostAndFoundRepository extends JpaRepository<LostAndFound, Long> {
}