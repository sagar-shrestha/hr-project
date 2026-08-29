-- Audit trail access control
-- AUDIT_VIEW permission follows the USER_MANAGE pattern from V3.
-- Endpoint rules follow the DynamicAuthorizationManager pattern from V13/V14.

INSERT INTO permissions (name, code) VALUES ('View Audit Trails', 'AUDIT_VIEW')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_SUPER_ADMIN' AND p.code = 'AUDIT_VIEW'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/audit/**', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;
