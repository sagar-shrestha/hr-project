package com.sagar.hr.employee.service;

import com.sagar.hr.employee.dto.response.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    List<EmployeeResponse> findAll();

    EmployeeResponse findById(Long id);
}
