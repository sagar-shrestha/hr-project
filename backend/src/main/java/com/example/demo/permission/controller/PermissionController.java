package com.example.demo.permission.controller;

import com.example.demo.permission.entity.Permission;
import com.example.demo.permission.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public List<Permission> getAllPermissions() {
        return permissionService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPermission(@RequestBody Permission permission) {
        if (permissionService.findByName(permission.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Permission name is already taken!");
        }
        Permission savedPermission = permissionService.save(permission);
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
