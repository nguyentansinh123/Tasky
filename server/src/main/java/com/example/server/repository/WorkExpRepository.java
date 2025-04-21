package com.example.server.repository;

import com.example.server.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkExpRepository extends JpaRepository<WorkExperience, Long> {
}
