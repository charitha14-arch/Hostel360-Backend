package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.Attendance;
import com.hostel360.repository.AttendanceRepository;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Long id, Attendance attendance) {

        Attendance existing =
                attendanceRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStudentName(attendance.getStudentName());
            existing.setDate(attendance.getDate());
            existing.setStatus(attendance.getStatus());

            return attendanceRepository.save(existing);
        }

        return null;
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}