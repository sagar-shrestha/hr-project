# Database Schema

## departments

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Auto-generated ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Department name (English) |
| name_nepali | VARCHAR(100) | | Department name (Nepali / NVARCHAR) |
| code | VARCHAR(20) | NOT NULL, UNIQUE | Department code |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row update timestamp |

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

## Audit Trail (Hibernate Envers)

Every audited entity gets a `*_AUD` table holding one row per revision (`revtype`: 0=ADD, 1=MOD, 2=DEL). All domain and security entities are audited: `employees_AUD`, `departments_AUD`, `leave_requests_AUD`, `leave_balances_AUD`, `salary_structures_AUD`, `shifts_AUD`, `time_logs_AUD`, `overtime_records_AUD`, `attendance_AUD`, `users_AUD`, `roles_AUD`, `permissions_AUD`, `endpoint_roles_AUD`, plus join tables `user_roles_AUD` and `role_permissions_AUD`.

### revinfo

| Column | Type | Constraints | Description |
|---|---|---|---|
| rev | BIGSERIAL | PK | Revision number (identity) |
| revtstmp | BIGINT | | Revision timestamp (epoch millis) |
| username | VARCHAR(100) | | Acting user |

Each `*_AUD` table: `id BIGINT NOT NULL`, `rev BIGINT NOT NULL` (FK → revinfo), `revtype SMALLINT`, then one nullable column per audited entity field (including `created_at`, `updated_at`, `created_by`, `updated_by`, `active`). PK is `(rev, id)`; join-table audits use `(rev, <join cols>)`.

V15 also added `created_by`, `updated_by`, `active` (and missing `created_at`/`updated_at`) columns to existing tables so all entities inherit the `AuditableEntity` base fields.

## Migrations

| Version | File | Description |
|---|---|---|
| V1 | V1__Initial_Schema.sql | Initial schema (roles, users, permissions, mappings) |
| V2 | V2__Create_Super_Admin.sql | Seed super admin user |
| V3 | V3__Seed_Roles_And_Permissions.sql | Seed roles and permissions |
| V4 | V4__Create_Endpoint_Roles_Table.sql | Create endpoint_roles table |
| V5 | V5__Create_Leave_Module_Tables.sql | Create leave_requests and leave_balances tables |
| V6 | V6__Create_Departments_Table.sql | Create departments table |
| V7 | V7__Add_Department_Id_To_Employees.sql | Create employees table with department_id |
| V8 | V8__Seed_Reports_Endpoint_Role.sql | Seed endpoint role for reports |
| V9 | V9__Create_Attendance_Module.sql | Create shifts, time_logs, overtime_records tables |
| V10 | V10__Create_Attendance_Summary_Table.sql | Create attendance table |
| V11 | V11__Create_Salary_Structures_Table.sql | Create salary_structures table |
| V12 | V12__Add_Name_Nepali_To_Departments.sql | Add name_nepali column to departments |
| V13 | V13__Seed_User_Management_Endpoint_Roles.sql | Seed endpoint roles for user management |
| V14 | V14__Seed_Endpoint_Role_Management_Rules.sql | Seed endpoint roles for endpoint-role management |
| V15 | V15__Add_Auditable_Columns.sql | Add created_by/updated_by/active (+ missing timestamps) to existing tables |
| V16 | V16__Create_Envers_Audit_Tables.sql | Create revinfo and all *_AUD audit tables |
| V17 | V17__Seed_Audit_Permissions.sql | Seed AUDIT_VIEW permission and audit endpoint role |
| V18 | V18__Align_Schema_With_Entities.sql | Align salary_structures money columns to NUMERIC(38,2); add missing time_logs shift_id FK |
| V19 | V19__Add_Status_To_Departments.sql | Add status column to departments (+ departments_AUD) |
| V20 | V20__Seed_Department_And_Leave_Endpoint_Roles.sql | Seed endpoint_roles for department and leave endpoints |
