package com.sagar.hr.payroll.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSalaryStructureRequest {

    private String name;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal taxRate;
    private Long employeeId;
    private Boolean active;
    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;
}
