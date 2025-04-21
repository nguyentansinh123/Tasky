package com.example.server.request;

import com.example.server.enums.TaskStatus;
import com.example.server.model.Category;
import com.example.server.model.Image;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AddTaskRequest {
    private Long id;
    private String taskName;
    private boolean flexibleDate;
    private String description;
    private String location;
    private TaskStatus status;
    private LocalDateTime taskDate;
    private LocalDateTime dueDate;
    private BigDecimal budget;
    private Category category;


}
