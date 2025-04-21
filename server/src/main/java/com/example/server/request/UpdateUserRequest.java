package com.example.server.request;

import com.example.server.model.Image;
import com.example.server.model.Speciality;
import com.example.server.model.WorkExperience;
import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String description;
    private List<WorkExperience> workExperiences;
    private List<Speciality> specialities;



}
