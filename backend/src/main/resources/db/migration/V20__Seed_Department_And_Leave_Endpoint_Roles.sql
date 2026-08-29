-- Department + Leave endpoint roles.
-- DynamicAuthorizationManager uses role hierarchy: SUPER_ADMIN > ADMIN > MODERATOR > USER.
-- Seeding ROLE_MODERATOR covers SUPER_ADMIN + ADMIN + MODERATOR via hierarchy.

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/departments', 'GET', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/departments/*', 'GET', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/departments', 'POST', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/departments/*', 'PUT', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/departments/*', 'DELETE', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/leaves/*/approve', 'POST', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/leaves/*/reject', 'POST', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/leaves/pending', 'GET', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/leaves/initialize-balance', 'POST', r.id FROM roles r WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;
