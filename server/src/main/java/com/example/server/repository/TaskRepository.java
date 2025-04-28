package com.example.server.repository;

import com.example.server.model.Category;
import com.example.server.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByBudget(BigDecimal budget);

    List<Task> findByCategoryName(String category);

    List<Task> findByFlexibleDate(boolean flexibleDate);

    List<Task> findByLocation(String location);

    List<Task> findByDueDate(LocalDateTime dueDate);

    List<Task> findByTaskDate(LocalDateTime taskDate);

    List<Task> findByUploaduserId(Long id);
}
