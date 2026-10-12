package com.hostel360.repository;

import com.hostel360.entity.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdministratorRepository
        extends JpaRepository<Administrator, Long> {

    Optional<Administrator> findByEmail(String email);
}