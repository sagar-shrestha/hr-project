-- Screens endpoint roles.
-- DynamicAuthorizationManager uses role hierarchy: SUPER_ADMIN > ADMIN > MODERATOR > USER.
-- Seeding ROLE_MODERATOR covers SUPER_ADMIN + ADMIN + MODERATOR via hierarchy.

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/screens', 'GET', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/screens/*', 'GET', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/screens', 'POST', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/screens/*', 'PUT', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/screens/*', 'DELETE', r.id FROM roles r WHERE r.name = 'ROLE_MODERATOR'
ON CONFLICT DO NOTHING;
