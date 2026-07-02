CREATE TABLE IF NOT EXISTS salary_structures (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    allowances DECIMAL(12,2) NOT NULL,
    deductions DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    employee_id BIGINT,
    effective_from TIMESTAMP,
    effective_to TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
