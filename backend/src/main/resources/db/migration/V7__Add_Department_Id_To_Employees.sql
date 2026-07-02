CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_nepali VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    citizenship_number VARCHAR(50) UNIQUE,
    pan_number VARCHAR(20) UNIQUE,
    department_id BIGINT,
    designation VARCHAR(100),
    employee_code VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    date_of_birth_bs VARCHAR(10),
    join_date DATE,
    join_date_bs VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
