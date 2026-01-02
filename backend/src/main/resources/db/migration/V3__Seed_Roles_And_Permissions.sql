-- Seed additional roles
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_MODERATOR') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;

-- Seed User Management Permission
INSERT INTO permissions (name, code) VALUES ('Manage Users', 'USER_MANAGE') ON CONFLICT (name) DO NOTHING;

-- Link ROLE_SUPER_ADMIN to USER_MANAGE permission
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ROLE_SUPER_ADMIN' AND p.code = 'USER_MANAGE'
ON CONFLICT DO NOTHING;
