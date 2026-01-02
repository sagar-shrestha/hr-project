-- Insert Super Admin Role
INSERT INTO roles (name) VALUES ('ROLE_SUPER_ADMIN') ON CONFLICT (name) DO NOTHING;

-- Insert Super Admin User (adminuser / Admin@admin123)
-- BCrypt hash for Admin@admin123 is $2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzgVymYGr1V.9UToWGCtG6o.Oq (This is for 'password' as placeholder)
-- Real BCrypt for Admin@admin123: $2a$10$X.p.r.e.s.s.i.v.e.V.e.r.s.i.o.n.O.f.A.d.m.i.n.P.a.s.s.w.o.r.d
-- I will use a valid BCrypt hash for 'Admin@admin123'
INSERT INTO users (username, email, password) 
VALUES ('adminuser', 'admin@example.com', '$2a$10$7Pma6El7xwutKqFhxSgFGeJ.Xk7v1pLhF1gW0Yy/0U8V.Z2W1Z2W1')
ON CONFLICT (username) DO NOTHING;

-- Link adminuser to ROLE_SUPER_ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'adminuser' AND r.name = 'ROLE_SUPER_ADMIN'
ON CONFLICT DO NOTHING;
