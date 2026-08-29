package com.sagar.hr.payroll.controller;

import com.sagar.hr.payroll.dto.request.CreateSalaryStructureRequest;
import com.sagar.hr.payroll.dto.request.UpdateSalaryStructureRequest;
import com.sagar.hr.payroll.dto.response.SalaryStructureResponse;
import com.sagar.hr.payroll.model.PayrollCalculationResult;
import com.sagar.hr.payroll.service.PayrollService;
import com.sagar.hr.payroll.service.SalaryStructureService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
        return ControllerUtil.ok("Net salary calculated", result);
    }

    @PostMapping("/structures")
    public ResponseEntity<GlobalApiResponse> createStructure(@Valid @RequestBody CreateSalaryStructureRequest request) {
        SalaryStructureResponse created = salaryStructureService.create(request);
        return ControllerUtil.created("Salary structure created", created);
    }

    @PutMapping("/structures/{id}")
    public ResponseEntity<GlobalApiResponse> updateStructure(@PathVariable Long id, @Valid @RequestBody UpdateSalaryStructureRequest request) {
        SalaryStructureResponse updated = salaryStructureService.update(id, request);
        return ControllerUtil.ok("Salary structure updated", updated);
    }

    @DeleteMapping("/structures/{id}")
    public ResponseEntity<GlobalApiResponse> deactivateStructure(@PathVariable Long id) {
        salaryStructureService.deactivate(id);
        return ControllerUtil.ok("Salary structure deactivated and cache evicted", null);
    }
}
