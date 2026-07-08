-- Hibernate Envers audit tables (generated to match Hibernate 6.4 metadata,
-- PostgreSQL dialect + CamelCaseToUnderscoresNamingStrategy).
-- revinfo holds one row per revision (transaction). Each *_AUD table stores a
-- snapshot of an entity row per revision with a revtype (0=ADD, 1=MOD, 2=DEL).

CREATE TABLE IF NOT EXISTS revinfo (
    rev BIGSERIAL PRIMARY KEY,
    revtstmp BIGINT,
    username VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS employees_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    citizenship_number VARCHAR(255),
    date_of_birth DATE,
    date_of_birth_bs VARCHAR(10),
    designation VARCHAR(255),
    email VARCHAR(255),
    employee_code VARCHAR(255),
    join_date DATE,
    join_date_bs VARCHAR(10),
    name VARCHAR(255),
    name_nepali VARCHAR(255),
    pan_number VARCHAR(255),
    phone VARCHAR(255),
    status VARCHAR(20),
    department_id BIGINT,
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS departments_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    code VARCHAR(20),
    name VARCHAR(100),
    name_nepali VARCHAR(100),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS leave_requests_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    approved_at TIMESTAMP(6),
    end_date DATE,
    leave_type VARCHAR(20),
    reason TEXT,
    rejected_reason TEXT,
    remarks TEXT,
    start_date DATE,
    status VARCHAR(20),
    total_days INTEGER,
    approved_by BIGINT,
    user_id BIGINT,
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS leave_balances_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    leave_type VARCHAR(20),
    total_days NUMERIC(6,1),
    used_days NUMERIC(6,1),
    year INTEGER,
    user_id BIGINT,
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS salary_structures_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    allowances NUMERIC(38,2),
    basic_salary NUMERIC(38,2),
    deductions NUMERIC(38,2),
    effective_from TIMESTAMP(6),
    effective_to TIMESTAMP(6),
    employee_id BIGINT,
    name VARCHAR(255),
    tax_rate NUMERIC(38,2),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS shifts_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    end_time TIME(6),
    late_threshold_minutes INTEGER,
    name VARCHAR(100),
    night_shift BOOLEAN,
    night_shift_allowance NUMERIC(12,2),
    start_time TIME(6),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS time_logs_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    employee_id BIGINT,
    overtime_hours NUMERIC(5,2),
    punch_in TIMESTAMP(6),
    punch_out TIMESTAMP(6),
    source VARCHAR(20),
    total_hours NUMERIC(5,2),
    shift_id BIGINT,
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS overtime_records_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    approved BOOLEAN,
    date DATE,
    employee_id BIGINT,
    overtime_amount NUMERIC(12,2),
    overtime_hours NUMERIC(5,2),
    overtime_rate NUMERIC(3,2),
    regular_hours NUMERIC(5,2),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS attendance_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    date DATE,
    department_id BIGINT,
    employee_id BIGINT,
    status VARCHAR(20),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS users_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS roles_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    name VARCHAR(255),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS permissions_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    code VARCHAR(255),
    name VARCHAR(255),
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS endpoint_roles_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    http_method VARCHAR(255),
    url_pattern VARCHAR(255),
    role_id BIGINT,
    PRIMARY KEY (rev, id)
);

CREATE TABLE IF NOT EXISTS user_roles_AUD (
    rev BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions_AUD (
    rev BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, role_id, permission_id)
);

-- Audit tables reference revinfo (matches Hibernate-generated FK constraints)
ALTER TABLE employees_AUD ADD CONSTRAINT fk_employees_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE departments_AUD ADD CONSTRAINT fk_departments_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE leave_requests_AUD ADD CONSTRAINT fk_leave_requests_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE leave_balances_AUD ADD CONSTRAINT fk_leave_balances_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE salary_structures_AUD ADD CONSTRAINT fk_salary_structures_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE shifts_AUD ADD CONSTRAINT fk_shifts_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE time_logs_AUD ADD CONSTRAINT fk_time_logs_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE overtime_records_AUD ADD CONSTRAINT fk_overtime_records_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE attendance_AUD ADD CONSTRAINT fk_attendance_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE users_AUD ADD CONSTRAINT fk_users_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE roles_AUD ADD CONSTRAINT fk_roles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE permissions_AUD ADD CONSTRAINT fk_permissions_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE endpoint_roles_AUD ADD CONSTRAINT fk_endpoint_roles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE user_roles_AUD ADD CONSTRAINT fk_user_roles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
ALTER TABLE role_permissions_AUD ADD CONSTRAINT fk_role_permissions_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
