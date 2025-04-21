package com.example.server.service.workExperience;

import com.example.server.model.WorkExperience;

import java.util.List;

public interface IWorkExperienceService {
    List<WorkExperience> getAllWorkExperiencesByUserId(Long userId);
    WorkExperience getWorkExperienceById(Long workExperienceId);
    WorkExperience createWorkExperience(Long userId, WorkExperience workExperience);
    WorkExperience updateWorkExperience(Long workExperienceId, WorkExperience workExperience);
    void deleteWorkExperience(Long workExperienceId);
}
