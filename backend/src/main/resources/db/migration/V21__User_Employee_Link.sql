-- Link Employee records to a User account.
-- When an admin creates a user flagged as an employee, the service creates a
-- linked employees row whose user_id points at the new user.

ALTER TABLE employees
    ADD COLUMN user_id BIGINT;

CREATE UNIQUE INDEX uk_employees_user_id ON employees(user_id);

ALTER TABLE employees
    ADD CONSTRAINT fk_employee_user_id FOREIGN KEY (user_id) REFERENCES users (id);

-- Dedicated role auto-assigned to employee users.
INSERT INTO roles (name) VALUES ('ROLE_EMPLOYEE') ON CONFLICT (name) DO NOTHING;

-- Employee self-service (read) endpoints. Both ROLE_EMPLOYEE and ROLE_ADMIN
-- keep access so admin management is not locked out (SUPER_ADMIN bypasses all).
INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/employees', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_EMPLOYEE'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/employees', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/employees/*', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_EMPLOYEE'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/employees/*', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;
