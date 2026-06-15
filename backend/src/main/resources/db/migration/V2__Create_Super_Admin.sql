-- Insert Super Admin Role
INSERT INTO roles (name) VALUES ('ROLE_SUPER_ADMIN') ON CONFLICT (name) DO NOTHING;

-- Insert Super Admin User (adminuser / Admin@admin123)
INSERT INTO users (username, email, password) 
VALUES ('adminuser', 'admin@example.com', '$2a$10$65X/VN2fhavA.lt6/QYYROsle9yA7AxJ8SVseZuBnnvI7.ch3itxe')
ON CONFLICT (username) DO NOTHING;

-- Link adminuser to ROLE_SUPER_ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'adminuser' AND r.name = 'ROLE_SUPER_ADMIN'
ON CONFLICT DO NOTHING;
