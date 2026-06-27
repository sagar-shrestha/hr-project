package com.sagar.hr.payroll.repository;

import com.sagar.hr.payroll.model.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {

    Optional<SalaryStructure> findByName(String name);

    Optional<SalaryStructure> findByActiveTrue();
}
