-- SINGLE_TABLE inheritance: merge employees into users.
-- Employee extends User; all employee profile columns move to the users table.
-- The employees table is dropped after data is migrated.
--
-- Pre-condition: every employees row with a user_id must be linked to a valid users row.
-- Orphan employees (user_id IS NULL) will be lost when employees is dropped.
-- Verify: SELECT count(*) FROM employees WHERE user_id IS NULL; -- expect 0

-- 1. Add discriminator column to users
ALTER TABLE users ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'USER';

-- 2. Add nullable employee profile columns to users
ALTER TABLE users ADD COLUMN name VARCHAR(255);
ALTER TABLE users ADD COLUMN name_nepali VARCHAR(255);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN citizenship_number VARCHAR(50);
ALTER TABLE users ADD COLUMN pan_number VARCHAR(20);
ALTER TABLE users ADD COLUMN nid_number VARCHAR(50);
ALTER TABLE users ADD COLUMN department_id BIGINT;
ALTER TABLE users ADD COLUMN designation VARCHAR(100);
ALTER TABLE users ADD COLUMN employee_code VARCHAR(50);
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN date_of_birth_bs VARCHAR(10);
ALTER TABLE users ADD COLUMN join_date DATE;
ALTER TABLE users ADD COLUMN join_date_bs VARCHAR(10);
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- 3. Partial unique indexes (Postgres allows multiple NULLs)
CREATE UNIQUE INDEX uq_users_citizenship_number ON users(citizenship_number) WHERE citizenship_number IS NOT NULL;
CREATE UNIQUE INDEX uq_users_pan_number ON users(pan_number) WHERE pan_number IS NOT NULL;
CREATE UNIQUE INDEX uq_users_nid_number ON users(nid_number) WHERE nid_number IS NOT NULL;
CREATE UNIQUE INDEX uq_users_employee_code ON users(employee_code) WHERE employee_code IS NOT NULL;

-- 4. FK for department_id
ALTER TABLE users ADD CONSTRAINT fk_users_department
    FOREIGN KEY (department_id) REFERENCES departments(id);

-- 5. Merge existing employee data into users rows
UPDATE users u
SET
    name             = e.name,
    name_nepali      = e.name_nepali,
    phone            = e.phone,
    citizenship_number = e.citizenship_number,
    pan_number       = e.pan_number,
    nid_number       = e.nid_number,
    department_id    = e.department_id,
    designation      = e.designation,
    employee_code    = e.employee_code,
    date_of_birth    = e.date_of_birth,
    date_of_birth_bs = e.date_of_birth_bs,
    join_date        = e.join_date,
    join_date_bs     = e.join_date_bs,
    status           = e.status,
    user_type        = 'EMPLOYEE'
FROM employees e
WHERE u.id = e.user_id AND e.user_id IS NOT NULL;

-- 6. Re-point FKs: attendance, time_logs, overtime_records -> employees(id) becomes -> users(id)
UPDATE attendance
SET employee_id = (SELECT e.user_id FROM employees e WHERE e.id = attendance.employee_id)
WHERE employee_id IN (SELECT id FROM employees WHERE user_id IS NOT NULL);

UPDATE time_logs
SET employee_id = (SELECT e.user_id FROM employees e WHERE e.id = time_logs.employee_id)
WHERE employee_id IN (SELECT id FROM employees WHERE user_id IS NOT NULL);

UPDATE overtime_records
SET employee_id = (SELECT e.user_id FROM employees e WHERE e.id = overtime_records.employee_id)
WHERE employee_id IN (SELECT id FROM employees WHERE user_id IS NOT NULL);

UPDATE salary_structures
SET employee_id = (SELECT e.user_id FROM employees e WHERE e.id = salary_structures.employee_id)
WHERE employee_id IN (SELECT id FROM employees WHERE user_id IS NOT NULL);

-- 7. Drop FKs referencing employees(id)
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS fk_attendance_employee;
ALTER TABLE time_logs DROP CONSTRAINT IF EXISTS fk_time_log_employee;
ALTER TABLE overtime_records DROP CONSTRAINT IF EXISTS fk_overtime_employee;

-- 8. Re-add FKs referencing users(id)
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_employee
    FOREIGN KEY (employee_id) REFERENCES users(id);
ALTER TABLE time_logs ADD CONSTRAINT fk_time_log_employee
    FOREIGN KEY (employee_id) REFERENCES users(id);
ALTER TABLE overtime_records ADD CONSTRAINT fk_overtime_employee
    FOREIGN KEY (employee_id) REFERENCES users(id);

-- 9. Add user_type + employee columns to users_AUD
ALTER TABLE users_AUD ADD COLUMN user_type VARCHAR(20);
ALTER TABLE users_AUD ADD COLUMN name VARCHAR(255);
ALTER TABLE users_AUD ADD COLUMN name_nepali VARCHAR(255);
ALTER TABLE users_AUD ADD COLUMN phone VARCHAR(20);
ALTER TABLE users_AUD ADD COLUMN citizenship_number VARCHAR(50);
ALTER TABLE users_AUD ADD COLUMN pan_number VARCHAR(20);
ALTER TABLE users_AUD ADD COLUMN nid_number VARCHAR(50);
ALTER TABLE users_AUD ADD COLUMN department_id BIGINT;
ALTER TABLE users_AUD ADD COLUMN designation VARCHAR(100);
ALTER TABLE users_AUD ADD COLUMN employee_code VARCHAR(50);
ALTER TABLE users_AUD ADD COLUMN date_of_birth DATE;
ALTER TABLE users_AUD ADD COLUMN date_of_birth_bs VARCHAR(10);
ALTER TABLE users_AUD ADD COLUMN join_date DATE;
ALTER TABLE users_AUD ADD COLUMN join_date_bs VARCHAR(10);
ALTER TABLE users_AUD ADD COLUMN status VARCHAR(20);

-- 10. Drop employees audit + employees table
DROP TABLE IF EXISTS employees_AUD;
DROP TABLE IF EXISTS employees;

-- 11. Indexes on new columns
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_employee_code ON users(employee_code);
