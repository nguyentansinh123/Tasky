package com.example.server.service.user;

import com.example.server.dto.UserDto;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Image;
import com.example.server.model.User;
import com.example.server.repository.ImageRepository;
import com.example.server.repository.UserRepository;
import com.example.server.request.CreateUserRequest;
import com.example.server.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User createUser(CreateUserRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setFirstName(req.getFirstname());
                    user.setLastName(req.getLastname());
                    user.setEmail(req.getEmail());
                    user.setPassword(passwordEncoder.encode(req.getPassword()));
                    return userRepository.save(user);
                }).orElseThrow(()-> new ResourceNotFoundException("Oops " + request.getEmail()+ " User Already Exist"));
    }

    @Override
    public User updateUser(Long userId, UpdateUserRequest request) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            existingUser.setDescription(request.getDescription());

            if (request.getWorkExperiences() != null) {
                request.getWorkExperiences().forEach(workExperience -> workExperience.setUser(existingUser));
                existingUser.getWorkExperiences().clear();
                existingUser.getWorkExperiences().addAll(request.getWorkExperiences());
            }

            if (request.getSpecialities() != null) {
                existingUser.getSpecialities().clear();
                existingUser.getSpecialities().addAll(request.getSpecialities());
            }

            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository :: delete, ()-> {
            throw new ResourceNotFoundException("User not found");
        });
    }

    @Override
    public String updateUserProfileImage(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found with email: " + email);
        }

        if (!authenticatedUser.getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to update this profile image");
        }

        return userRepository.findById(userId).map(user -> {
            try {
                Image profileImage = new Image();
                profileImage.setFileName(file.getOriginalFilename());
                profileImage.setFileType(file.getContentType());
                profileImage.setImage(new SerialBlob(file.getBytes()));

                Image savedImage = imageRepository.save(profileImage);

                String downloadUrl = "/api/v1/images/image/download/" + savedImage.getId();
                savedImage.setDownloadUrl(downloadUrl);
                imageRepository.save(savedImage);

                user.setProfileImage(savedImage);
                userRepository.save(user);

                return downloadUrl; // Return the download URL
            } catch (IOException | SQLException e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDto convertUserToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }

}
