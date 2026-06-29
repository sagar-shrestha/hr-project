package com.sagar.hr.payroll.mapper;

import com.sagar.hr.payroll.dto.response.SalaryStructureResponse;
import com.sagar.hr.payroll.model.SalaryStructure;
import org.springframework.stereotype.Component;

@Component
public class SalaryStructureMapper {

    public SalaryStructureResponse toResponse(SalaryStructure s) {
        return SalaryStructureResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .basicSalary(s.getBasicSalary())
                .allowances(s.getAllowances())
                .deductions(s.getDeductions())
                .taxRate(s.getTaxRate())
                .active(s.isActive())
                .employeeId(s.getEmployeeId())
                .effectiveFrom(s.getEffectiveFrom())
                .effectiveTo(s.getEffectiveTo())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
