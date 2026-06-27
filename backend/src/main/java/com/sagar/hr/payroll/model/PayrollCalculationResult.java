package com.sagar.hr.payroll.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollCalculationResult {
    private Long employeeId;
    private BigDecimal grossPay;
    private BigDecimal netPay;
    private BigDecimal totalDeductions;
    private BigDecimal totalTaxes;
    private LocalDateTime calculatedAt;
}
