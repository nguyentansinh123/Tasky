package com.example.server.dto;

import lombok.Data;

@Data
public class WorkExperienceDto {
    private Long id;
    private String companyName;
    private String position;
    private String description;
    private int startYear;
    private int endYear;
}