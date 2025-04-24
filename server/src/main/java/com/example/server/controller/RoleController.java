package com.example.server.controller;

import com.example.server.exceptions.AlreadyExistException;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Role;
import com.example.server.request.RoleRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.role.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("${api.prefix}/roles")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final IRoleService roleService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllRoles() {
        try {
            List<Role> roles = roleService.getAllRoles();
            return ResponseEntity.ok(new ApiResponse("Roles retrieved successfully", true, roles));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRoleById(@PathVariable Long id) {
        try {
            Role role = roleService.getRoleById(id);
            return ResponseEntity.ok(new ApiResponse("Role retrieved successfully", true, role));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        try {
            Role role = roleService.updateRole(id, request.getName());
            return ResponseEntity.ok(new ApiResponse("Role updated successfully", true, role));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (AlreadyExistException e) {
            return ResponseEntity.status(CONFLICT)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse("Invalid role name: " + e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRole(@PathVariable Long id) {
        try {
            roleService.deleteRole(id);
            return ResponseEntity.ok(new ApiResponse("Role deleted successfully", true, null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }
}