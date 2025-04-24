package com.example.server.controller;

import com.example.server.dto.UserDto;
import com.example.server.exceptions.AlreadyExistException;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.User;
import com.example.server.request.CreateUserRequest;
import com.example.server.request.UpdateUserRequest;
import com.example.server.request.UserRoleRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final IUserService userService;

    @GetMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId){
        try {
            User user = userService.getUserById(userId);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("User found", true,userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false,null));
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsers(){
        try {
            return ResponseEntity.ok(new ApiResponse("Users found", true,userService.getAllUsers()));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false,null));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request){
        try {
            User user = userService.createUser(request);
            UserDto userDto = userService.convertUserToDto(user);

            return ResponseEntity.ok(new ApiResponse("User created successfully", true,userDto));
        } catch (AlreadyExistException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), false,null));
        }
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request){
        try {
            User user = userService.updateUser(userId, request);
            UserDto userDto = userService.convertUserToDto(user);

            return ResponseEntity.ok(new ApiResponse("User updated successfully", true,userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false,null));
        }
    }

    @PutMapping("/{userId}/update-profile-image")
    public ResponseEntity<ApiResponse> updateUserProfileImage(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String url = userService.updateUserProfileImage(userId, file);
            return ResponseEntity.ok(new ApiResponse("Profile image updated successfully", true, url));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), false, null));
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Failed to update profile image", false, null));
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId){
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse("User deleted successfully", true,null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false,null));
        }
    }

    @PostMapping("/assign-role")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> updateUserRole(@RequestBody UserRoleRequest request) {
        try {
            User updatedUser = userService.updateUserRole(request.getUserId(), request.getRoleName());
            return ResponseEntity.ok(new ApiResponse("Role updated successfully", true, updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

}
