package com.sagar.hr.endpointrole.controller;

import com.sagar.hr.endpointrole.dto.request.CreateEndpointRoleRequest;
import com.sagar.hr.endpointrole.dto.request.UpdateEndpointRoleRequest;
import com.sagar.hr.endpointrole.dto.response.EndpointRoleResponse;
import com.sagar.hr.endpointrole.service.EndpointRoleService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/endpoint-roles")
public class EndpointRoleController {

    private final EndpointRoleService endpointRoleService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        List<EndpointRoleResponse> rules = endpointRoleService.findAll();
        return ControllerUtil.ok("Endpoint roles retrieved", rules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        EndpointRoleResponse rule = endpointRoleService.findById(id);
        return ControllerUtil.ok("Endpoint role retrieved", rule);
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody CreateEndpointRoleRequest request) {
        EndpointRoleResponse rule = endpointRoleService.create(request);
        return ControllerUtil.created("Endpoint role created", rule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateEndpointRoleRequest request) {
        EndpointRoleResponse rule = endpointRoleService.update(id, request);
        return ControllerUtil.ok("Endpoint role updated", rule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        endpointRoleService.deleteById(id);
        return ControllerUtil.noContent("Endpoint role deleted");
    }
}
