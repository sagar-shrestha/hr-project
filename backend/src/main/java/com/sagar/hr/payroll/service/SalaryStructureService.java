package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.SalaryStructure;
import com.sagar.hr.payroll.repository.SalaryStructureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SalaryStructureService {

    private final SalaryStructureRepository repository;
    private final PayrollCalculator payrollCalculator;

    public SalaryStructureService(SalaryStructureRepository repository, PayrollCalculator payrollCalculator) {
        this.repository = repository;
        this.payrollCalculator = payrollCalculator;
    }

    @Transactional
    public SalaryStructure createOrUpdate(SalaryStructure structure) {
        SalaryStructure saved = repository.save(structure);
        payrollCalculator.invalidateCache(saved.getEmployeeId());
        return saved;
    }

    @Transactional
    public void deactivate(Long structureId) {
        SalaryStructure structure = repository.findById(structureId)
                .orElseThrow(() -> new IllegalArgumentException("Salary structure not found: " + structureId));
        structure.setEffectiveTo(LocalDateTime.now());
        repository.save(structure);
        payrollCalculator.invalidateCache(structure.getEmployeeId());
    }
}
