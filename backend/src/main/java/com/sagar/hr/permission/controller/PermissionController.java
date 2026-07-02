package com.sagar.hr.permission.controller;

import com.sagar.hr.permission.dto.request.CreatePermissionRequest;
import com.sagar.hr.permission.dto.response.PermissionResponse;
import com.sagar.hr.permission.service.PermissionService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
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
    public ResponseEntity<GlobalApiResponse> getAllPermissions() {
        List<PermissionResponse> permissions = permissionService.findAll();
        return ControllerUtil.ok("Permissions retrieved", permissions);
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> createPermission(@Valid @RequestBody CreatePermissionRequest request) {
        PermissionResponse response = permissionService.create(request);
        return ControllerUtil.created("Permission created", response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> deletePermission(@PathVariable Long id) {
        permissionService.deleteById(id);
        return ControllerUtil.noContent("Permission deleted");
    }
}
