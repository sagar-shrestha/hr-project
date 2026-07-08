-- User Management endpoint roles
-- DynamicAuthorizationManager uses role hierarchy: SUPER_ADMIN > ADMIN > MODERATOR > USER

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users/*', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users', 'POST', r.id
FROM roles r
WHERE r.name = 'ROLE_SUPER_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users/*', 'PUT', r.id
FROM roles r
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users/*/roles', 'PUT', r.id
FROM roles r
WHERE r.name = 'ROLE_SUPER_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/users/*', 'DELETE', r.id
FROM roles r
WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;
