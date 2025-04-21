package com.example.server.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskDto {
    private Long id;
    private String taskName;
    private boolean flexibleDate;
    private String description;
    private String location;
    private String status;
    private LocalDateTime taskDate;
    private LocalDateTime dueDate;
    private BigDecimal budget;
    private Long categoryId;
    private String categoryName;
    private Long uploadUserId;
    private String uploadUserName;
    private Long acceptedUserId;
    private String acceptedUserName;
    private List<ImageDto> images;
}