package com.example.server.service.workExperience;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.User;
import com.example.server.model.WorkExperience;
import com.example.server.repository.UserRepository;
import com.example.server.repository.WorkExpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkExperienceService implements IWorkExperienceService {

    private final WorkExpRepository workExpRepository;
    private final UserRepository userRepository;

    @Override
    public List<WorkExperience> getAllWorkExperiencesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return user.getWorkExperiences();
    }

    @Override
    public WorkExperience getWorkExperienceById(Long workExperienceId) {
        return workExpRepository.findById(workExperienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found with id: " + workExperienceId));
    }

    @Override
    public WorkExperience createWorkExperience(Long userId, WorkExperience workExperience) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        workExperience.setUser(user);
        return workExpRepository.save(workExperience);
    }

    @Override
    public WorkExperience updateWorkExperience(Long workExperienceId, WorkExperience workExperience) {
        WorkExperience existingWorkExperience = workExpRepository.findById(workExperienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found with id: " + workExperienceId));
        existingWorkExperience.setCompanyName(workExperience.getCompanyName());
        existingWorkExperience.setPosition(workExperience.getPosition());
        existingWorkExperience.setDescription(workExperience.getDescription());
        existingWorkExperience.setStartYear(workExperience.getStartYear());
        existingWorkExperience.setEndYear(workExperience.getEndYear());
        return workExpRepository.save(existingWorkExperience);
    }

    @Override
    public void deleteWorkExperience(Long workExperienceId) {
        WorkExperience workExperience = workExpRepository.findById(workExperienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found with id: " + workExperienceId));
        workExpRepository.delete(workExperience);
    }
}
