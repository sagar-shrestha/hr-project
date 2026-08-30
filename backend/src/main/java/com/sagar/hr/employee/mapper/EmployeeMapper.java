package com.sagar.hr.employee.mapper;

import com.sagar.hr.employee.dto.response.EmployeeResponse;
import com.sagar.hr.employee.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(Employee entity) {
        EmployeeResponse.EmployeeResponseBuilder builder = EmployeeResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nameNepali(entity.getNameNepali())
                .phone(entity.getPhone())
                .citizenshipNumber(entity.getCitizenshipNumber())
                .panNumber(entity.getPanNumber())
                .nidNumber(entity.getNidNumber())
                .designation(entity.getDesignation())
                .employeeCode(entity.getEmployeeCode())
                .dateOfBirth(entity.getDateOfBirth())
                .dateOfBirthBS(entity.getDateOfBirthBS())
                .joinDate(entity.getJoinDate())
                .joinDateBS(entity.getJoinDateBS())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt());
        if (entity.getDepartment() != null) {
            builder.departmentId(entity.getDepartment().getId())
                    .departmentName(entity.getDepartment().getName());
        }
        return builder.build();
    }
}
