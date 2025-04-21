package com.example.server.controller;

import com.example.server.model.Speciality;
import com.example.server.response.ApiResponse;
import com.example.server.service.Speciality.ISpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users/{userId}/specialities")
public class SpecialityController {

    private final ISpecialityService specialityService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllSpecialitiesByUserId(@PathVariable Long userId) {
        try {
            List<Speciality> specialities = specialityService.getAllSpecialitiesByUserId(userId);
            return ResponseEntity.ok(new ApiResponse("Specialities retrieved successfully", true, specialities));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> addSpecialityToUser(@PathVariable Long userId, @RequestBody Speciality speciality) {
        try {
            Speciality createdSpeciality = specialityService.addSpecialityToUser(userId, speciality);
            return ResponseEntity.ok(new ApiResponse("Speciality added successfully", true, createdSpeciality));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PutMapping("/{specialityId}")
    public ResponseEntity<ApiResponse> updateUserSpeciality(@PathVariable Long userId, @PathVariable Long specialityId, @RequestBody Speciality speciality) {
        try {
            Speciality updatedSpeciality = specialityService.updateUserSpeciality(userId, specialityId, speciality);
            return ResponseEntity.ok(new ApiResponse("Speciality updated successfully", true, updatedSpeciality));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @DeleteMapping("/{specialityId}")
    public ResponseEntity<ApiResponse> deleteUserSpeciality(@PathVariable Long userId, @PathVariable Long specialityId) {
        try {
            specialityService.deleteUserSpeciality(userId, specialityId);
            return ResponseEntity.ok(new ApiResponse("Speciality deleted successfully", true, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }
}