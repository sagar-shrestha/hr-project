CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'HOME', 'BEREAVEMENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    total_days INTEGER NOT NULL,
    approved_by BIGINT,
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_leave_request_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_leave_request_approver FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS leave_balances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'HOME', 'BEREAVEMENT')),
    total_days DECIMAL(6,1) NOT NULL DEFAULT 0,
    used_days DECIMAL(6,1) NOT NULL DEFAULT 0,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    CONSTRAINT fk_leave_balance_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_user_leave_type_year UNIQUE (user_id, leave_type, year)
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_balances_user_year ON leave_balances(user_id, year);
