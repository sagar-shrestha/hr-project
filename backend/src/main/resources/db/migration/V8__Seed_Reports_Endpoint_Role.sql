-- Allow authenticated users to access the attendance summary report
INSERT INTO endpoint_roles (url_pattern, http_method, role_id)
SELECT '/api/v1/reports/attendance-summary', 'GET', r.id
FROM roles r
WHERE r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;
