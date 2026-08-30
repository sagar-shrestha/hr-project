-- Endpoint-role based authorization has been removed.
-- All endpoints now require any authenticated user (see SecurityConfig).
DROP TABLE IF EXISTS endpoint_roles;
DROP TABLE IF EXISTS endpoint_roles_AUD;