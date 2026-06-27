package com.sagar.hr.department.service;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.department.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Optional<Department> findById(UUID id) {
        return departmentRepository.findById(id);
    }

    public Optional<Department> findByName(String name) {
        return departmentRepository.findByName(name);
    }

    public Optional<Department> findByCode(String code) {
        return departmentRepository.findByCode(code);
    }

    @Transactional
    public Department save(Department department) {
        return departmentRepository.save(department);
    }

    @Transactional
    public void deleteById(UUID id) {
        departmentRepository.deleteById(id);
    }

    public boolean existsById(UUID id) {
        return departmentRepository.existsById(id);
    }
}
