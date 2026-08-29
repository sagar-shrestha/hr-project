package com.sagar.hr.employee.mapper;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.employee.dto.request.CreateEmployeeRequest;
import com.sagar.hr.employee.dto.request.UpdateEmployeeRequest;
import com.sagar.hr.employee.dto.response.EmployeeResponse;
import com.sagar.hr.employee.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(CreateEmployeeRequest request, Department department) {
        Employee entity = new Employee();
        entity.setName(request.getName());
        entity.setNameNepali(request.getNameNepali());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setCitizenshipNumber(request.getCitizenshipNumber());
        entity.setPanNumber(request.getPanNumber());
        entity.setDepartment(department);
        entity.setDesignation(request.getDesignation());
        entity.setEmployeeCode(request.getEmployeeCode());
        entity.setDateOfBirth(request.getDateOfBirth());
        entity.setDateOfBirthBS(request.getDateOfBirthBS());
        entity.setJoinDate(request.getJoinDate());
        entity.setJoinDateBS(request.getJoinDateBS());
        return entity;
    }

    public void updateEntity(Employee entity, UpdateEmployeeRequest request, Department department) {
        if (request.getName() != null) entity.setName(request.getName());
        if (request.getNameNepali() != null) entity.setNameNepali(request.getNameNepali());
        if (request.getEmail() != null) entity.setEmail(request.getEmail());
        if (request.getPhone() != null) entity.setPhone(request.getPhone());
        if (request.getCitizenshipNumber() != null) entity.setCitizenshipNumber(request.getCitizenshipNumber());
        if (request.getPanNumber() != null) entity.setPanNumber(request.getPanNumber());
        if (department != null) entity.setDepartment(department);
        if (request.getDesignation() != null) entity.setDesignation(request.getDesignation());
        if (request.getEmployeeCode() != null) entity.setEmployeeCode(request.getEmployeeCode());
        if (request.getDateOfBirth() != null) entity.setDateOfBirth(request.getDateOfBirth());
        if (request.getDateOfBirthBS() != null) entity.setDateOfBirthBS(request.getDateOfBirthBS());
        if (request.getJoinDate() != null) entity.setJoinDate(request.getJoinDate());
        if (request.getJoinDateBS() != null) entity.setJoinDateBS(request.getJoinDateBS());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
    }

    public EmployeeResponse toResponse(Employee entity) {
        EmployeeResponse.EmployeeResponseBuilder builder = EmployeeResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nameNepali(entity.getNameNepali())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .citizenshipNumber(entity.getCitizenshipNumber())
                .panNumber(entity.getPanNumber())
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
