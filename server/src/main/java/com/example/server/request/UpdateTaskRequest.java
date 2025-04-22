package com.example.server.request;

import com.example.server.enums.TaskStatus;
import com.example.server.model.Category;
import com.example.server.model.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UpdateTaskRequest {
    private Long id;
    private String taskName;
    private boolean flexibleDate;
    private String description;
    private String location;
    private TaskStatus status;
    private LocalDateTime taskDate;
    private LocalDateTime dueDate;
    private BigDecimal budget;
//    private User acceptedUser;
    private Long acceptedUserId;
}
