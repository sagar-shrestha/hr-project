package com.sagar.hr.permission.controller;

import com.sagar.hr.permission.dto.request.CreatePermissionRequest;
import com.sagar.hr.permission.service.PermissionService;
import com.sagar.hr.security.model.Permission;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public List<Permission> getAllPermissions() {
        return permissionService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPermission(@Valid @RequestBody CreatePermissionRequest request) {
        if (permissionService.findByName(request.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Permission name is already taken!");
        }
        Permission savedPermission = permissionService.create(request);
        return ResponseEntity.ok(savedPermission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePermission(@PathVariable Long id) {
        if (!permissionService.existsById(id)) {
            return ResponseEntity.badRequest().body("Error: Permission not found!");
        }
        permissionService.deleteById(id);
        return ResponseEntity.ok("Permission deleted successfully!");
    }
}
