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
        EmployeeResponse response = new EmployeeResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setNameNepali(entity.getNameNepali());
        response.setEmail(entity.getEmail());
        response.setPhone(entity.getPhone());
        response.setCitizenshipNumber(entity.getCitizenshipNumber());
        response.setPanNumber(entity.getPanNumber());
        response.setDesignation(entity.getDesignation());
        response.setEmployeeCode(entity.getEmployeeCode());
        response.setDateOfBirth(entity.getDateOfBirth());
        response.setDateOfBirthBS(entity.getDateOfBirthBS());
        response.setJoinDate(entity.getJoinDate());
        response.setJoinDateBS(entity.getJoinDateBS());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getDepartment() != null) {
            response.setDepartmentId(entity.getDepartment().getId());
            response.setDepartmentName(entity.getDepartment().getName());
        }
        return response;
    }
}
