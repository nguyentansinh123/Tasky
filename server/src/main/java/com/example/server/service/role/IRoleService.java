package com.example.server.service.role;

import com.example.server.model.Role;

import java.util.List;
import java.util.Optional;

public interface IRoleService {
    List<Role> getAllRoles();
    Role getRoleById(Long id);
    Role createRole(String name);
    Role updateRole(Long id, String name);
    void deleteRole(Long id);
    Optional<Role> findByName(String name);
}