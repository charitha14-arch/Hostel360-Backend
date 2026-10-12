
package com.hostel360.service;

import com.hostel360.entity.Cleaning;
import com.hostel360.repository.CleaningRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CleaningService {

    private final CleaningRepository repository;

    public CleaningService(CleaningRepository repository) {
        this.repository = repository;
    }

    public Cleaning createTask(Cleaning task) {
        if (task.getRoomNumber() == null
                || task.getRoomNumber().isBlank()) {
            throw new RuntimeException("Room number is required");
        }

        if (task.getCleaningDate() == null) {
            throw new RuntimeException("Cleaning date is required");
        }

        task.setId(null);
        task.setStatus("PENDING");

        return repository.save(task);
    }

    public List<Cleaning> getAllTasks() {
        return repository.findAll();
    }

    public Cleaning getTaskById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Cleaning task not found: " + id));
    }

    public List<Cleaning> getByStatus(String status) {
        return repository.findByStatus(status.toUpperCase());
    }

    public List<Cleaning> getByRoom(String roomNumber) {
        return repository.findByRoomNumber(roomNumber);
    }

    public Cleaning updateTask(Long id, Cleaning updated) {
        Cleaning task = getTaskById(id);

        if (updated.getStatus() != null) {
            String status = updated.getStatus().toUpperCase();

            if (!List.of("PENDING", "IN_PROGRESS", "COMPLETED")
                    .contains(status)) {
                throw new RuntimeException("Invalid cleaning status");
            }

            task.setStatus(status);
        }

        if (updated.getAssignedTo() != null) {
            task.setAssignedTo(updated.getAssignedTo());
        }

        if (updated.getCleaningDate() != null) {
            task.setCleaningDate(updated.getCleaningDate());
        }

        if (updated.getRemarks() != null) {
            task.setRemarks(updated.getRemarks());
        }

        return repository.save(task);
    }

    public void deleteTask(Long id) {
        repository.delete(getTaskById(id));
    }
}
