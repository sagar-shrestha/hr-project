package com.sagar.hr.employee.repository;

import com.sagar.hr.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByCitizenshipNumber(String citizenshipNumber);

    Optional<Employee> findByPanNumber(String panNumber);
}
