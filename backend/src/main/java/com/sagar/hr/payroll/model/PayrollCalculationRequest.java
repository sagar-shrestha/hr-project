package com.sagar.hr.payroll.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollCalculationRequest {
    private Long employeeId;
    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private BigDecimal baseSalary;
    private BigDecimal bonuses;
    private BigDecimal deductions;
}
