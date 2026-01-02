package com.example.demo.permission.service;

import com.example.demo.permission.entity.Permission;
import com.example.demo.permission.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public Optional<Permission> findByName(String name) {
        return permissionRepository.findByName(name);
    }

    @Transactional
    public Permission save(Permission permission) {
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
