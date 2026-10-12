
package com.hostel360.controller;

import com.hostel360.entity.Cleaning;
import com.hostel360.service.CleaningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaning")
@CrossOrigin(origins = "http://localhost:5173")
public class CleaningController {

    private final CleaningService service;

    public CleaningController(CleaningService service) {
        this.service = service;
    }

    @PostMapping
    public Cleaning createTask(@RequestBody Cleaning task) {
        return service.createTask(task);
    }

    @GetMapping
    public List<Cleaning> getAllTasks() {
        return service.getAllTasks();
    }

    @GetMapping("/{id}")
    public Cleaning getTaskById(@PathVariable Long id) {
        return service.getTaskById(id);
    }

    @GetMapping("/status/{status}")
    public List<Cleaning> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/room/{roomNumber}")
    public List<Cleaning> getByRoom(
            @PathVariable String roomNumber) {
        return service.getByRoom(roomNumber);
    }

    @PutMapping("/{id}")
    public Cleaning updateTask(
            @PathVariable Long id,
            @RequestBody Cleaning task) {
        return service.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        return "Cleaning task deleted successfully";
    }
}
