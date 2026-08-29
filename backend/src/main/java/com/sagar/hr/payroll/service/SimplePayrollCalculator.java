package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.PayrollCalculationRequest;
import com.sagar.hr.payroll.model.PayrollCalculationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class SimplePayrollCalculator implements PayrollCalculator {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.20");

    @Override
    public PayrollCalculationResult calculate(PayrollCalculationRequest request) {
        BigDecimal grossPay = request.getBaseSalary()
                .add(request.getBonuses() != null ? request.getBonuses() : BigDecimal.ZERO);

        BigDecimal totalDeductions = request.getDeductions() != null
                ? request.getDeductions()
                : BigDecimal.ZERO;

        BigDecimal taxes = grossPay.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netPay = grossPay.subtract(taxes).subtract(totalDeductions);

        return PayrollCalculationResult.builder()
                .employeeId(request.getEmployeeId())
                .grossPay(grossPay)
                .netPay(netPay.setScale(2, RoundingMode.HALF_UP))
                .totalDeductions(totalDeductions)
                .totalTaxes(taxes)
                .calculatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public void invalidateCache(Long employeeId) {
        // No-op for the simple implementation
    }
}
