package com.sagar.hr.payroll.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateSalaryStructureRequest {

    @NotBlank
    private String name;

    @NotNull
    private BigDecimal basicSalary;

    @NotNull
    private BigDecimal allowances;

    @NotNull
    private BigDecimal deductions;

    @NotNull
    private BigDecimal taxRate;

    private Long employeeId;

    private LocalDateTime effectiveFrom;
}
