package com.sagar.hr.permission.service;

import com.sagar.hr.permission.dto.request.CreatePermissionRequest;
import com.sagar.hr.security.model.Permission;
import com.sagar.hr.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public Optional<Permission> findByName(String name) {
        return permissionRepository.findByName(name);
    }

    @Transactional
    public Permission create(CreatePermissionRequest request) {
        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setCode(request.getCode());
        return permissionRepository.save(permission);
    }

    @Transactional
    public void deleteById(Long id) {
        permissionRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return permissionRepository.existsById(id);
    }
}
