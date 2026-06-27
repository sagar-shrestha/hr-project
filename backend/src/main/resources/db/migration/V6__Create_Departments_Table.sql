CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE employees ADD COLUMN IF NOT EXISTS department_id UUID;

CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);

ALTER TABLE employees ADD CONSTRAINT fk_employee_department
    FOREIGN KEY (department_id) REFERENCES departments(id);
