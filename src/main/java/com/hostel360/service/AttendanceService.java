
package com.hostel360.service;

import com.hostel360.entity.Attendance;
import com.hostel360.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository repository;

    public AttendanceService(AttendanceRepository repository) {
        this.repository = repository;
    }

    public Attendance markAttendance(Attendance attendance) {
        if (attendance.getStudentId() == null
                || attendance.getStudentId() <= 0) {
            throw new RuntimeException("Valid student ID is required");
        }

        if (attendance.getAttendanceDate() == null) {
            throw new RuntimeException("Attendance date is required");
        }

        if (attendance.getAttendanceDate().isAfter(LocalDate.now())) {
            throw new RuntimeException(
                "Attendance date cannot be in the future"
            );
        }

        if (attendance.getStatus() == null) {
            throw new RuntimeException("Attendance status is required");
        }

        String status = attendance.getStatus().toUpperCase();

        if (!List.of("PRESENT", "ABSENT").contains(status)) {
            throw new RuntimeException(
                "Status must be PRESENT or ABSENT"
            );
        }

        if (repository.findByStudentIdAndAttendanceDate(
                attendance.getStudentId(),
                attendance.getAttendanceDate()).isPresent()) {
            throw new RuntimeException(
                "Attendance already exists for this student and date"
            );
        }

        attendance.setId(null);
        attendance.setStatus(status);

        return repository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return repository.findAll();
    }

    public List<Attendance> getByDate(LocalDate date) {
        return repository.findByAttendanceDate(date);
    }

    public List<Attendance> getByStatus(String status) {
        return repository.findByStatus(status.toUpperCase());
    }

    public List<Attendance> getByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }

    public Attendance updateAttendance(
            Long id, String status) {

        if (status == null ||
                !List.of("PRESENT", "ABSENT")
                    .contains(status.toUpperCase())) {
            throw new RuntimeException(
                "Status must be PRESENT or ABSENT"
            );
        }

        Attendance attendance = repository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Attendance record not found"));

        attendance.setStatus(status.toUpperCase());

        return repository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = repository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Attendance record not found"));

        repository.delete(attendance);
    }
}
