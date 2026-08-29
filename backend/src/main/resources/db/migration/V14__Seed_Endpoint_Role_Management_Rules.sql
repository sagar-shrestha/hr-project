-- Self-referential: endpoint-role management controller's own endpoint_roles rules
-- These must be seeded BEFORE the controller is used, since DynamicAuthorizationManager
-- enforces access based on this table.

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/endpoint-roles', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/endpoint-roles/*', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/endpoint-roles', 'POST', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/endpoint-roles/*', 'PUT', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/endpoint-roles/*', 'DELETE', r.id
FROM roles r
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;
