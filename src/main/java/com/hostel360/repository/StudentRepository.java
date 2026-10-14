package com.hostel360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel360.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}