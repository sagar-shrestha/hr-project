package com.sagar.hr.employee.service;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.department.repository.DepartmentRepository;
import com.sagar.hr.employee.dto.request.CreateEmployeeRequest;
import com.sagar.hr.employee.dto.request.UpdateEmployeeRequest;
import com.sagar.hr.employee.dto.response.EmployeeResponse;
import com.sagar.hr.employee.entity.Employee;
import com.sagar.hr.employee.exception.EmployeeNotFoundException;
import com.sagar.hr.employee.mapper.EmployeeMapper;
import com.sagar.hr.employee.repository.EmployeeRepository;
import com.sagar.hr.util.exception.AlreadyInUseException;
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
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Override
    public EmployeeResponse findById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return employeeMapper.toResponse(employee);
    }

    @Transactional
    @Override
    public EmployeeResponse create(CreateEmployeeRequest request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyInUseException("Email already in use: " + request.getEmail());
        }
        if (request.getEmployeeCode() != null && employeeRepository.findByEmployeeCode(request.getEmployeeCode()).isPresent()) {
            throw new AlreadyInUseException("Employee code already in use: " + request.getEmployeeCode());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + request.getDepartmentId()));
        }

        Employee employee = employeeMapper.toEntity(request, department);
        Employee saved = employeeRepository.save(employee);
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    @Override
    public EmployeeResponse update(Long id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())
                && employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyInUseException("Email already in use: " + request.getEmail());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + request.getDepartmentId()));
        }

        employeeMapper.updateEntity(employee, request, department);
        Employee saved = employeeRepository.save(employee);
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        if (!employeeRepository.existsByIdAndActiveIsTrue(id)) {
            throw new EmployeeNotFoundException("Employee not found with id: " + id);
        }
        log.info("Delete employee with id: " + id);
        employeeRepository.deleteEmployeeById(id);
    }
}
