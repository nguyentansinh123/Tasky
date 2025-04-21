package com.example.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String description;
    private String profileImageUrl;
    private List<ReviewDto> receivedReviews;
    private List<WorkExperienceDto> workExperiences;
    private List<SpecialityDto> specialities;
}