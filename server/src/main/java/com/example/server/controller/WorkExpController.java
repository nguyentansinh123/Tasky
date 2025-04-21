package com.example.server.controller;

import com.example.server.model.WorkExperience;
import com.example.server.response.ApiResponse;
import com.example.server.service.workExperience.IWorkExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/work-experiences")
public class WorkExpController {

    private final IWorkExperienceService workExperienceService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getAllWorkExperiencesByUserId(@PathVariable Long userId) {
        try {
            List<WorkExperience> workExperiences = workExperienceService.getAllWorkExperiencesByUserId(userId);
            return ResponseEntity.ok(new ApiResponse("Work experiences retrieved successfully", true, workExperiences));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getWorkExperienceById(@PathVariable Long id) {
        try {
            WorkExperience workExperience = workExperienceService.getWorkExperienceById(id);
            return ResponseEntity.ok(new ApiResponse("Work experience retrieved successfully", true, workExperience));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PostMapping("/user/{userId}/add")
    public ResponseEntity<ApiResponse> createWorkExperience(@PathVariable Long userId, @RequestBody WorkExperience workExperience) {
        try {
            WorkExperience createdWorkExperience = workExperienceService.createWorkExperience(userId, workExperience);
            return ResponseEntity.ok(new ApiResponse("Work experience created successfully", true, createdWorkExperience));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateWorkExperience(@PathVariable Long id, @RequestBody WorkExperience workExperience) {
        try {
            WorkExperience updatedWorkExperience = workExperienceService.updateWorkExperience(id, workExperience);
            return ResponseEntity.ok(new ApiResponse("Work experience updated successfully", true, updatedWorkExperience));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteWorkExperience(@PathVariable Long id) {
        try {
            workExperienceService.deleteWorkExperience(id);
            return ResponseEntity.ok(new ApiResponse("Work experience deleted successfully", true, null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }
    }
}