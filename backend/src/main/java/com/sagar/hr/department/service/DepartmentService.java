package com.sagar.hr.department.service;

import com.sagar.hr.department.model.Department;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {

    List<Department> findAll();

    Optional<Department> findById(Long id);

    Optional<Department> findByName(String name);

    Optional<Department> findByCode(String code);

    Department save(Department department);

    boolean deleteById(Long id);

}
