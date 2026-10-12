
package com.hostel360.controller;

import com.hostel360.entity.Attendance;
import com.hostel360.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @PostMapping
    public Attendance markAttendance(
            @RequestBody Attendance attendance) {
        return service.markAttendance(attendance);
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return service.getAllAttendance();
    }

    @GetMapping("/date/{date}")
    public List<Attendance> getByDate(
            @PathVariable String date) {
        return service.getByDate(LocalDate.parse(date));
    }

    @GetMapping("/status/{status}")
    public List<Attendance> getByStatus(
            @PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getByStudent(
            @PathVariable Long studentId) {
        return service.getByStudent(studentId);
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        return service.updateAttendance(
            id, request.get("status")
        );
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        service.deleteAttendance(id);
        return "Attendance deleted successfully";
    }
}
