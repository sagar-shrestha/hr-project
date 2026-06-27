package com.sagar.hr.payroll.controller;

import com.sagar.hr.payroll.model.PayrollCalculationResult;
import com.sagar.hr.payroll.model.SalaryStructure;
import com.sagar.hr.payroll.service.PayrollService;
import com.sagar.hr.payroll.service.SalaryStructureService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;
    private final SalaryStructureService salaryStructureService;

    @GetMapping("/calculate")
    public ResponseEntity<GlobalApiResponse> calculateNetSalary(
            @RequestParam Long employeeId,
            @RequestParam String structureName,
            @RequestParam(required = false) LocalDate periodStart,
            @RequestParam(required = false) LocalDate periodEnd) {
        LocalDate start = periodStart != null ? periodStart : LocalDate.now().withDayOfMonth(1);
        LocalDate end = periodEnd != null ? periodEnd : LocalDate.now();
        PayrollCalculationResult result = payrollService.calculateNetSalary(employeeId, structureName, start, end);
        return ResponseEntity.ok(GlobalApiResponse.builder()
                .httpStatus(HttpStatus.OK.value())
                .message("Net salary calculated")
                .data(result)
                .status(true)
                .build());
    }

    @PostMapping("/structures")
    public ResponseEntity<GlobalApiResponse> createStructure(@RequestBody SalaryStructure structure) {
        SalaryStructure created = salaryStructureService.createOrUpdate(structure);
        return ResponseEntity.ok(GlobalApiResponse.builder()
                .httpStatus(HttpStatus.CREATED.value())
                .message("Salary structure created")
                .data(created)
                .status(true)
                .build());
    }

    @PutMapping("/structures/{id}")
    public ResponseEntity<GlobalApiResponse> updateStructure(@PathVariable Long id, @RequestBody SalaryStructure structure) {
        structure.setId(id);
        SalaryStructure updated = salaryStructureService.createOrUpdate(structure);
        return ResponseEntity.ok(GlobalApiResponse.builder()
                .httpStatus(HttpStatus.OK.value())
                .message("Salary structure updated")
                .data(updated)
                .status(true)
                .build());
    }

    @DeleteMapping("/structures/{id}")
    public ResponseEntity<GlobalApiResponse> deactivateStructure(@PathVariable Long id) {
        salaryStructureService.deactivate(id);
        return ResponseEntity.ok(GlobalApiResponse.builder()
                .httpStatus(HttpStatus.OK.value())
                .message("Salary structure deactivated and cache evicted")
                .data(null)
                .status(true)
                .build());
    }
}
