CREATE TABLE IF NOT EXISTS shifts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    late_threshold_minutes INTEGER DEFAULT 15,
    night_shift BOOLEAN DEFAULT FALSE,
    night_shift_allowance DECIMAL(12,2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_logs (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    shift_id BIGINT,
    punch_in TIMESTAMP NOT NULL,
    punch_out TIMESTAMP,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    source VARCHAR(20) DEFAULT 'MANUAL' CHECK (source IN ('BIOMETRIC', 'MANUAL', 'MOBILE')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_time_log_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS overtime_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    date DATE NOT NULL,
    regular_hours DECIMAL(5,2) NOT NULL,
    overtime_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
    overtime_rate DECIMAL(3,2) NOT NULL DEFAULT 1.50,
    overtime_amount DECIMAL(12,2),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_overtime_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT uq_overtime_employee_date UNIQUE (employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_time_logs_employee ON time_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_date ON time_logs(punch_in);
CREATE INDEX IF NOT EXISTS idx_overtime_employee ON overtime_records(employee_id);
