package com.sagar.hr.department.controller;

import com.sagar.hr.department.exception.DepartmentNotFoundException;
import com.sagar.hr.department.model.Department;
import com.sagar.hr.department.service.DepartmentService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        return ControllerUtil.ok("Departments retrieved", departmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        Department department = departmentService.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));
        return ControllerUtil.ok("Department retrieved", department);
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody Department department) {
        Department saved = departmentService.save(department);
        return ControllerUtil.created("Department created", saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody Department department) {
        department.setId(id);
        Department saved = departmentService.save(department);
        return ControllerUtil.ok("Department updated", saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        departmentService.deleteById(id);
        return ControllerUtil.noContent("Department deleted");
    }
}
