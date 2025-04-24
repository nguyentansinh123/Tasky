package com.example.server.service.role;

import com.example.server.enums.Roles;
import com.example.server.exceptions.AlreadyExistException;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Role;
import com.example.server.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    @Override
    public Role createRole(String name) {
        Roles roleEnum = Roles.valueOf(name);

        // Check if role already exists
        if (roleRepository.findByName(roleEnum).isPresent()) {
            throw new AlreadyExistException("Role with name '" + name + "' already exists");
        }

        Role role = new Role();
        role.setName(roleEnum);
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Long id, String name) {
        Role role = getRoleById(id);

        Roles roleEnum = Roles.valueOf(name);

        Optional<Role> existingRole = roleRepository.findByName(roleEnum);
        if (existingRole.isPresent() && !existingRole.get().getId().equals(id)) {
            throw new AlreadyExistException("Another role with name '" + name + "' already exists");
        }

        role.setName(roleEnum);
        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }

    @Override
    public Optional<Role> findByName(String name) {
        Roles roleEnum = Roles.valueOf(name);
        return roleRepository.findByName(roleEnum);
    }
}