
package com.hostel360.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cleaning_tasks")
public class Cleaning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String assignedTo;
    private LocalDate cleaningDate;
    private String status;

    @Column(length = 1000)
    private String remarks;

    public Cleaning() {
    }

    @PrePersist
    public void beforeSave() {
        if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDate getCleaningDate() { return cleaningDate; }
    public void setCleaningDate(LocalDate cleaningDate) {
        this.cleaningDate = cleaningDate;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
