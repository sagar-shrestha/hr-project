package com.sagar.hr.employee.controller;

import com.sagar.hr.employee.dto.request.CreateEmployeeRequest;
import com.sagar.hr.employee.dto.request.UpdateEmployeeRequest;
import com.sagar.hr.employee.dto.response.EmployeeResponse;
import com.sagar.hr.employee.service.EmployeeService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        List<EmployeeResponse> employees = employeeService.findAll();
        return ControllerUtil.ok("Employees retrieved", employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.findById(id);
        return ControllerUtil.ok("Employee retrieved", employee);
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody CreateEmployeeRequest request) {
        EmployeeResponse response = employeeService.create(request);
        return ControllerUtil.created("Employee created", response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest request) {
        EmployeeResponse response = employeeService.update(id, request);
        return ControllerUtil.ok("Employee updated", response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ControllerUtil.noContent("Employee deleted");
    }
}
