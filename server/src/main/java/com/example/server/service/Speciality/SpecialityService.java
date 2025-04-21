package com.example.server.service.Speciality;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Speciality;
import com.example.server.model.User;
import com.example.server.repository.SpecialityRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialityService implements ISpecialityService {

    private final SpecialityRepository specialityRepository;
    private final UserRepository userRepository;

    @Override
    public List<Speciality> getAllSpecialitiesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return user.getSpecialities();
    }

    @Override
    public Speciality addSpecialityToUser(Long userId, Speciality speciality) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        speciality = specialityRepository.save(speciality);
        user.getSpecialities().add(speciality);
        userRepository.save(user);
        return speciality;
    }

    @Override
    public Speciality updateUserSpeciality(Long userId, Long specialityId, Speciality speciality) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Speciality existingSpeciality = specialityRepository.findById(specialityId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found with id: " + specialityId));
        if (!user.getSpecialities().contains(existingSpeciality)) {
            throw new ResourceNotFoundException("Speciality does not belong to the user");
        }
        existingSpeciality.setName(speciality.getName());
        return specialityRepository.save(existingSpeciality);
    }

    @Override
    public void deleteUserSpeciality(Long userId, Long specialityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Speciality speciality = specialityRepository.findById(specialityId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found with id: " + specialityId));
        if (!user.getSpecialities().contains(speciality)) {
            throw new ResourceNotFoundException("Speciality does not belong to the user");
        }
        user.getSpecialities().remove(speciality);
        userRepository.save(user);
        specialityRepository.delete(speciality);
    }
}