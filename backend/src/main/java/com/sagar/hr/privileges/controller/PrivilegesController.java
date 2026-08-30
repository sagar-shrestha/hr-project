package com.sagar.hr.privileges.controller;

import com.sagar.hr.privileges.dto.request.CreatePrivilegesRequest;
import com.sagar.hr.privileges.dto.request.UpdatePrivilegesRequest;
import com.sagar.hr.privileges.service.PrivilegesService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/privileges")
@RequiredArgsConstructor
public class PrivilegesController {

    private final PrivilegesService privilegesService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        return ControllerUtil.ok("Privileges retrieved", privilegesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        return ControllerUtil.ok("Privilege retrieved", privilegesService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody CreatePrivilegesRequest request) {
        return ControllerUtil.created("Privilege created", privilegesService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody UpdatePrivilegesRequest request) {
        return ControllerUtil.ok("Privilege updated", privilegesService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        privilegesService.deleteById(id);
        return ControllerUtil.noContent("Privilege deleted");
    }
}
