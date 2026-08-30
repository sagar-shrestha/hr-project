package com.sagar.hr.employee.service;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.department.repository.DepartmentRepository;
import com.sagar.hr.employee.dto.response.EmployeeResponse;
import com.sagar.hr.employee.entity.Employee;
import com.sagar.hr.employee.exception.EmployeeNotFoundException;
import com.sagar.hr.employee.mapper.EmployeeMapper;
import com.sagar.hr.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAllEmployees().stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        Employee employee = employeeRepository.findEmployeeById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return employeeMapper.toResponse(employee);
    }
}
