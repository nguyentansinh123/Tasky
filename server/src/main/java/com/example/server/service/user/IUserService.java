package com.example.server.service.user;

import com.example.server.dto.UserDto;
import com.example.server.model.User;
import com.example.server.request.CreateUserRequest;
import com.example.server.request.UpdateUserRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUserService {
    User getUserById(Long userId);
    User createUser(CreateUserRequest request);
    User updateUser(Long userId, UpdateUserRequest request);
    void deleteUser(Long userId);
    String updateUserProfileImage(Long userId, MultipartFile file);
    List<User> getAllUsers();

    UserDto convertUserToDto(User user);

    User getAuthenticatedUser();


    User updateUserRole(Long userId, String roleName);
}
