
package com.hostel360.repository;

import com.hostel360.entity.Cleaning;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CleaningRepository
        extends JpaRepository<Cleaning, Long> {

    List<Cleaning> findByStatus(String status);

    List<Cleaning> findByRoomNumber(String roomNumber);
}
