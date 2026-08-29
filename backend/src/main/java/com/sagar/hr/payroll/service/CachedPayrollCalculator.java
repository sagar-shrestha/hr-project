package com.sagar.hr.payroll.service;

import com.sagar.hr.payroll.model.PayrollCalculationRequest;
import com.sagar.hr.payroll.model.PayrollCalculationResult;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@ConditionalOnProperty(name = "app.payroll.cache.enabled", havingValue = "true", matchIfMissing = false)
public class CachedPayrollCalculator implements PayrollCalculator {

    private final PayrollCalculator delegate;

    public CachedPayrollCalculator(SimplePayrollCalculator delegate) {
        this.delegate = delegate;
    }

    @Override
    @Cacheable(value = "payroll", key = "#request.employeeId")
    public PayrollCalculationResult calculate(PayrollCalculationRequest request) {
        return delegate.calculate(request);
    }

    @Override
    @CacheEvict(value = "payroll", key = "#employeeId")
    public void invalidateCache(Long employeeId) {
        // Cache eviction handled by annotation
    }
}
