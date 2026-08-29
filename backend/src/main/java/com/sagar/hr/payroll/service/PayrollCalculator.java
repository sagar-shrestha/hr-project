package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.PayrollCalculationRequest;
import com.sagar.hr.payroll.model.PayrollCalculationResult;

public interface PayrollCalculator {

    PayrollCalculationResult calculate(PayrollCalculationRequest request);

    void invalidateCache(Long employeeId);
}
