package com.example.server.service.Speciality;

import com.example.server.model.Speciality;

import java.util.List;

public interface ISpecialityService {
    List<Speciality> getAllSpecialitiesByUserId(Long userId);
    Speciality addSpecialityToUser(Long userId, Speciality speciality);
    Speciality updateUserSpeciality(Long userId, Long specialityId, Speciality speciality);
    void deleteUserSpeciality(Long userId, Long specialityId);
}