package com.sagar.hr.modules.controller;

import com.sagar.hr.modules.dto.request.CreateModulesRequest;
import com.sagar.hr.modules.dto.request.UpdateModulesRequest;
import com.sagar.hr.modules.service.ModulesService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
public class ModulesController {

    private final ModulesService modulesService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        return ControllerUtil.ok("Modules retrieved", modulesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        return ControllerUtil.ok("Module retrieved", modulesService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody CreateModulesRequest request) {
        return ControllerUtil.created("Module created", modulesService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateModulesRequest request) {
        return ControllerUtil.ok("Module updated", modulesService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        modulesService.deleteById(id);
        return ControllerUtil.noContent("Module deleted");
    }
}
