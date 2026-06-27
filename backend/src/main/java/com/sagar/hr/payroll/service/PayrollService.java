package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.PayrollCalculationRequest;
import com.sagar.hr.payroll.model.PayrollCalculationResult;
import com.sagar.hr.payroll.model.SalaryStructure;
import com.sagar.hr.payroll.repository.SalaryStructureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollCalculator payrollCalculator;
    private final SalaryStructureRepository salaryStructureRepository;

    public PayrollCalculationResult calculateNetSalary(Long employeeId, String structureName, LocalDate periodStart, LocalDate periodEnd) {
        SalaryStructure structure = salaryStructureRepository.findByName(structureName)
                .orElseThrow(() -> new IllegalArgumentException("Salary structure not found: " + structureName));

        PayrollCalculationRequest request = PayrollCalculationRequest.builder()
                .employeeId(employeeId)
                .payPeriodStart(periodStart)
                .payPeriodEnd(periodEnd)
                .baseSalary(structure.getBasicSalary())
                .bonuses(structure.getAllowances())
                .deductions(structure.getDeductions())
                .build();

        return payrollCalculator.calculate(request);
    }

    public void evictCacheForEmployee(Long employeeId) {
        payrollCalculator.invalidateCache(employeeId);
    }
}
