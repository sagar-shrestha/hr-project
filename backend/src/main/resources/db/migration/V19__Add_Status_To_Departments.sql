ALTER TABLE departments ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE departments_AUD ADD COLUMN status VARCHAR(20);
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);
