package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}