package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.PayrollCalculationRequest;
import com.sagar.hr.payroll.model.PayrollCalculationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class NepaliPayrollCalculator implements PayrollCalculator {

    private static final BigDecimal SSF_EMPLOYEE_RATE = new BigDecimal("0.11");
    private static final BigDecimal SSF_EMPLOYER_RATE = new BigDecimal("0.20");

    private static final BigDecimal SLAB_1_LIMIT = new BigDecimal("500000");
    private static final BigDecimal SLAB_1_RATE = new BigDecimal("0.01");
    private static final BigDecimal SLAB_2_LIMIT = new BigDecimal("700000");
    private static final BigDecimal SLAB_2_RATE = new BigDecimal("0.10");
    private static final BigDecimal SLAB_3_LIMIT = new BigDecimal("1000000");
    private static final BigDecimal SLAB_3_RATE = new BigDecimal("0.20");
    private static final BigDecimal SLAB_4_LIMIT = new BigDecimal("2500000");
    private static final BigDecimal SLAB_4_RATE = new BigDecimal("0.30");
    private static final BigDecimal SLAB_5_RATE = new BigDecimal("0.36");

    @Override
    public PayrollCalculationResult calculate(PayrollCalculationRequest request) {
        BigDecimal baseSalary = request.getBaseSalary() != null ? request.getBaseSalary() : BigDecimal.ZERO;
        BigDecimal bonuses = request.getBonuses() != null ? request.getBonuses() : BigDecimal.ZERO;
        BigDecimal otherDeductions = request.getDeductions() != null ? request.getDeductions() : BigDecimal.ZERO;

        BigDecimal ssfEmployee = baseSalary.multiply(SSF_EMPLOYEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal ssfEmployer = baseSalary.multiply(SSF_EMPLOYER_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal festivalBonus = baseSalary;
        BigDecimal annualTaxableIncome = baseSalary.multiply(BigDecimal.valueOf(12))
                .add(festivalBonus)
                .subtract(ssfEmployee.multiply(BigDecimal.valueOf(12)));

        BigDecimal monthlyTax = calculateMonthlyTax(annualTaxableIncome);

        BigDecimal grossPay = baseSalary.add(bonuses);
        BigDecimal totalTaxes = monthlyTax;
        BigDecimal totalDeductions = otherDeductions.add(ssfEmployee).add(monthlyTax);
        BigDecimal netPay = grossPay.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);

        return PayrollCalculationResult.builder()
                .employeeId(request.getEmployeeId())
                .grossPay(grossPay)
                .netPay(netPay)
                .totalDeductions(totalDeductions)
                .totalTaxes(totalTaxes)
                .ssfEmployee(ssfEmployee)
                .ssfEmployer(ssfEmployer)
                .basicSalary(baseSalary)
                .allowances(bonuses)
                .festivalBonus(festivalBonus)
                .calculatedAt(LocalDateTime.now())
                .build();
    }

    private BigDecimal calculateMonthlyTax(BigDecimal annualTaxable) {
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal remaining = annualTaxable;

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal slab1 = min(remaining, SLAB_1_LIMIT);
        tax = tax.add(slab1.multiply(SLAB_1_RATE));
        remaining = remaining.subtract(slab1);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            return tax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        }

        BigDecimal slab2 = min(remaining, SLAB_2_LIMIT.subtract(SLAB_1_LIMIT));
        tax = tax.add(slab2.multiply(SLAB_2_RATE));
        remaining = remaining.subtract(slab2);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            return tax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        }

        BigDecimal slab3 = min(remaining, SLAB_3_LIMIT.subtract(SLAB_2_LIMIT));
        tax = tax.add(slab3.multiply(SLAB_3_RATE));
        remaining = remaining.subtract(slab3);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            return tax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        }

        BigDecimal slab4 = min(remaining, SLAB_4_LIMIT.subtract(SLAB_3_LIMIT));
        tax = tax.add(slab4.multiply(SLAB_4_RATE));
        remaining = remaining.subtract(slab4);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            return tax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        }

        tax = tax.add(remaining.multiply(SLAB_5_RATE));
        return tax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal min(BigDecimal a, BigDecimal b) {
        return a.compareTo(b) < 0 ? a : b;
    }

    @Override
    public void invalidateCache(Long employeeId) {
    }
}
