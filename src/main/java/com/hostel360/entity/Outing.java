
package com.hostel360.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "outing_requests")
public class Outing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private String reason;

    private LocalDateTime outingDate;

    private LocalDateTime returnDate;

    private String status;

    private String wardenRemark;

    public Outing() {
    }

    @PrePersist
    public void beforeSave() {
        if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getOutingDate() {
        return outingDate;
    }

    public void setOutingDate(LocalDateTime outingDate) {
        this.outingDate = outingDate;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getWardenRemark() {
        return wardenRemark;
    }

    public void setWardenRemark(String wardenRemark) {
        this.wardenRemark = wardenRemark;
    }
}
