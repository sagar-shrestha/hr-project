package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.dto.request.CreateSalaryStructureRequest;
import com.sagar.hr.payroll.dto.request.UpdateSalaryStructureRequest;
import com.sagar.hr.payroll.dto.response.SalaryStructureResponse;
import com.sagar.hr.payroll.mapper.SalaryStructureMapper;
import com.sagar.hr.payroll.model.SalaryStructure;
import com.sagar.hr.payroll.repository.SalaryStructureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SalaryStructureService {

    private final SalaryStructureRepository repository;
    private final PayrollCalculator payrollCalculator;
    private final SalaryStructureMapper salaryStructureMapper;

    @Transactional
    public SalaryStructureResponse create(CreateSalaryStructureRequest request) {
        SalaryStructure structure = new SalaryStructure();
        structure.setName(request.getName());
        structure.setBasicSalary(request.getBasicSalary());
        structure.setAllowances(request.getAllowances());
        structure.setDeductions(request.getDeductions());
        structure.setTaxRate(request.getTaxRate());
        structure.setEmployeeId(request.getEmployeeId());
        structure.setActive(true);
        structure.setEffectiveFrom(request.getEffectiveFrom() != null ? request.getEffectiveFrom() : LocalDateTime.now());
        SalaryStructure saved = repository.save(structure);
        return salaryStructureMapper.toResponse(saved);
    }

    @Transactional
    public SalaryStructureResponse update(Long id, UpdateSalaryStructureRequest request) {
        SalaryStructure structure = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Salary structure not found: " + id));

        if (request.getName() != null) structure.setName(request.getName());
        if (request.getBasicSalary() != null) structure.setBasicSalary(request.getBasicSalary());
        if (request.getAllowances() != null) structure.setAllowances(request.getAllowances());
        if (request.getDeductions() != null) structure.setDeductions(request.getDeductions());
        if (request.getTaxRate() != null) structure.setTaxRate(request.getTaxRate());
        if (request.getEmployeeId() != null) structure.setEmployeeId(request.getEmployeeId());
        if (request.getActive() != null) structure.setActive(request.getActive());
        if (request.getEffectiveFrom() != null) structure.setEffectiveFrom(request.getEffectiveFrom());
        if (request.getEffectiveTo() != null) structure.setEffectiveTo(request.getEffectiveTo());

        SalaryStructure saved = repository.save(structure);
        payrollCalculator.invalidateCache(saved.getEmployeeId());
        return salaryStructureMapper.toResponse(saved);
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
