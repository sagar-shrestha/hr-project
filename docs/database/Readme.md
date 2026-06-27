# Database Schema

## salary_structures

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Auto-generated ID |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Structure name |
| basic_salary | DECIMAL(19,2) | NOT NULL | Base pay |
| allowances | DECIMAL(19,2) | NOT NULL | Total allowances |
| deductions | DECIMAL(19,2) | NOT NULL | Total deductions |
| tax_rate | DECIMAL(5,4) | NOT NULL | Tax rate (e.g. 0.01 = 1%) |
| active | BOOLEAN | NOT NULL, DEFAULT true | Whether structure is active |
| employee_id | BIGINT | | Employee this structure applies to |
| effective_from | TIMESTAMP | NOT NULL, DEFAULT NOW() | When structure takes effect |
| effective_to | TIMESTAMP | | When structure was deactivated |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row update timestamp |

## Migrations

| Version | File | Description |
|---|---|---|
| V1 | V1__Initial_Schema.sql | Initial schema (roles, users, permissions, mappings) |
| V2 | V2__Create_Super_Admin.sql | Seed super admin user |
| V3 | V3__Seed_Roles_And_Permissions.sql | Seed roles and permissions |
| V4 | V4__Create_Endpoint_Roles_Table.sql | Create endpoint_roles table |
| V5 | V5__Create_Salary_Structures_Table.sql | Create salary_structures table for payroll |
