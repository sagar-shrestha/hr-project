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

## modules_privileges_mapping

| Column | Type | Constraints | Description |
|---|---|---|---|
| module_id | BIGINT | PK, FK → modules(id) | Module in the mapping |
| privilege_id | BIGINT | PK, FK → privileges(id) | Privilege in the mapping |

Many-to-many join table (Modules ↔ Privileges); composite PK `(module_id, privilege_id)`. Audited via `modules_privileges_mapping_AUD`.

## modules_privileges_mapping_endpoints_mapping

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Auto-generated ID |
| module_id | BIGINT | NOT NULL, FK → modules(id) | Module in the pair |
| privilege_id | BIGINT | NOT NULL, FK → privileges(id) | Privilege in the pair |
| endpoint_id | BIGINT | NOT NULL, FK → endpoints(id) | Linked endpoint |
| active | BOOLEAN | NOT NULL, DEFAULT true | Row active flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Row update timestamp |

Many-to-many link between `modules_privileges_mapping` module+privilege pairs and `endpoints`; one row per (module, privilege) pair linked to an endpoint. UNIQUE `(module_id, privilege_id, endpoint_id)`, indexed on `endpoint_id`. Audited via `modules_privileges_mapping_endpoints_mapping_AUD`.

## users

Since V33, `users` is the single table for both authentication accounts and employee profiles via JPA `SINGLE_TABLE` inheritance (`User extends Employee`). Row type is discriminated by `user_type` (`USER` or `EMPLOYEE`). The former `employees` table was dropped.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | User (and employee) identity |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Login username |
| email | VARCHAR(50) | NOT NULL, UNIQUE | Login email |
| password | VARCHAR(255) | NOT NULL | Encoded password |
| user_type | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | Discriminator: USER / EMPLOYEE |
| name | VARCHAR(255) | | Employee name (English) |
| name_nepali | VARCHAR(255) | | Employee name (Nepali / NVARCHAR) |
| phone | VARCHAR(20) | | Employee phone |
| citizenship_number | VARCHAR(50) | UNIQUE (partial) | Citizenship number |
| pan_number | VARCHAR(20) | UNIQUE (partial) | PAN (encrypted at rest) |
| nid_number | VARCHAR(50) | UNIQUE (partial) | NID number |
| department_id | BIGINT | FK → departments(id) | Employee department |
| designation | VARCHAR(100) | | Employee designation |
| employee_code | VARCHAR(50) | UNIQUE (partial) | Employee code |
| date_of_birth | DATE | | A.D. date of birth |
| date_of_birth_bs | VARCHAR(10) | | B.S. date of birth (YYYY-MM-DD) |
| join_date | DATE | | A.D. join date |
| join_date_bs | VARCHAR(10) | | B.S. join date (YYYY-MM-DD) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | Employee status |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditing timestamps |
| created_by / updated_by | VARCHAR(100) | | Auditing user |
| active | BOOLEAN | NOT NULL, DEFAULT true | Row active flag |

`users_AUD` (V33) now includes all employee profile columns. FKs from `attendance`, `time_logs`, `overtime_records`, `salary_structures` that previously pointed at `employees(id)` now point at `users(id)`.

## Audit Trail (Hibernate Envers)

Every audited entity gets a `*_AUD` table holding one row per revision (`revtype`: 0=ADD, 1=MOD, 2=DEL). All domain and security entities are audited: `departments_AUD`, `leave_requests_AUD`, `leave_balances_AUD`, `salary_structures_AUD`, `shifts_AUD`, `time_logs_AUD`, `overtime_records_AUD`, `attendance_AUD`, `users_AUD`, `roles_AUD`, `permissions_AUD`, `screens_AUD`, `modules_AUD`, `privileges_AUD`, `endpoints_AUD`, `modules_privileges_mapping_endpoints_mapping_AUD`, plus join tables `users_roles_association_AUD`, `role_permissions_AUD`, and `modules_privileges_mapping_AUD`. (`employees_AUD` was dropped with the `employees` table in V33; `endpoint_roles_AUD` was removed with the `endpoint_roles` table in V31.) `users_AUD` now also carries the employee profile columns added in V33.

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
| V21 | V21__User_Employee_Link.sql | Link users to employees |
| V22 | V22__Add_User_Id_To_Employees_Aud.sql | Add user_id to employees_AUD |
| V23 | V23__Create_Screens_Table.sql | Create screens table + screens_AUD |
| V24 | V24__Seed_Screens_Endpoint_Roles.sql | Seed endpoint roles for screens endpoints |
| V25 | V25__Create_Modules_Table.sql | Create modules table + modules_AUD (screens_id FK) |
| V26 | V26__Seed_Modules_Endpoint_Roles.sql | Seed endpoint roles for modules endpoints |
| V27 | V27__Create_Privileges_Table.sql | Create privileges table + privileges_AUD |
| V28 | V28__Seed_Privileges_Endpoint_Roles.sql | Seed endpoint roles for privileges endpoints |
| V29 | V29__Create_Modules_Privileges_Mapping_Table.sql | Create modules_privileges_mapping join table + AUD |
| V30 | V30__Create_Endpoints_Table.sql | Create endpoints table + endpoints_AUD |
| V31 | V31__Drop_Endpoint_Roles.sql | Drop endpoint_roles + endpoint_roles_AUD (auth now = any authenticated user) |
| V32 | V32__Create_Modules_Privileges_Mapping_Endpoints_Mapping_Table.sql | Create modules_privileges_mapping_endpoints_mapping link table (module+privilege pairs ↔ endpoints) + AUD |
| V33 | V33__Merge_Employees_Into_Users.sql | Merge employees into users via SINGLE_TABLE inheritance (Employee extends User); add user_type + employee columns to users, re-point employee_id FKs, drop employees + employees_AUD |
| V34 | V34__Create_Users_Roles_Association.sql | Explicitly create users_roles_association join table (user_id/role_id, PK, FKs); migrate data from legacy user_roles then drop it; rename user_roles_AUD to users_roles_association_AUD |
