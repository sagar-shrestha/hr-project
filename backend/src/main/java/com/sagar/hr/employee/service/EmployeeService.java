package com.sagar.hr.employee.service;

import com.sagar.hr.employee.dto.request.CreateEmployeeRequest;
import com.sagar.hr.employee.dto.request.UpdateEmployeeRequest;
import com.sagar.hr.employee.dto.response.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    List<EmployeeResponse> findAll();

    EmployeeResponse findById(Long id);

    EmployeeResponse create(CreateEmployeeRequest request);

    EmployeeResponse update(Long id, UpdateEmployeeRequest request);

    void delete(Long id);
}
