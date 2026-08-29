package com.sagar.hr.permission.service;

import com.sagar.hr.permission.dto.request.CreatePermissionRequest;
import com.sagar.hr.permission.dto.response.PermissionResponse;
import com.sagar.hr.permission.mapper.PermissionMapper;
import com.sagar.hr.permission.repository.PermissionRepository;
import com.sagar.hr.security.model.Permission;
import com.sagar.hr.util.exception.AlreadyInUseException;
import com.sagar.hr.util.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public List<PermissionResponse> findAll() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toResponse)
                .toList();
    }

    @Transactional
    public PermissionResponse create(CreatePermissionRequest request) {
        if (permissionRepository.findByName(request.getName()).isPresent()) {
            throw new AlreadyInUseException("Permission name is already taken: " + request.getName());
        }
        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setCode(request.getCode());
        return permissionMapper.toResponse(permissionRepository.save(permission));
    }

    @Transactional
    public void deleteById(Long id) {
        if (!permissionRepository.existsById(id)) {
            throw new NotFoundException("Permission not found with id: " + id);
        }
        permissionRepository.deleteById(id);
    }
}
