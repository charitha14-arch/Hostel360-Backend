
package com.hostel360.repository;

import com.hostel360.entity.Outing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OutingRepository
        extends JpaRepository<Outing, Long> {

    List<Outing> findByStudentId(Long studentId);

    List<Outing> findByStatus(String status);
}
