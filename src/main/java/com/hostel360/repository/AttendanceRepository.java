package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}