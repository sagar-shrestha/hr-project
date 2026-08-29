# 2026-06-27 — Departments Feature

## What was done

- Created Flyway migration V6 to add a `departments` table with UUID PK
- Created Flyway migration V7 to add an `employees` table with `department_id` FK
- Created `Department` JPA entity
- Created `DepartmentRepository` with lookup methods
- Created `DepartmentService` with basic CRUD operations
- Created feature documentation, database schema docs, and changelog

## Files touched

- `backend/src/main/resources/db/migration/V6__Create_Departments_Table.sql` — new departments table
- `backend/src/main/resources/db/migration/V7__Add_Department_Id_To_Employees.sql` — new employees table with FK
- `backend/src/main/java/com/sagar/hr/department/entity/Department.java` — JPA entity
- `backend/src/main/java/com/sagar/hr/department/repository/DepartmentRepository.java` — data access
- `backend/src/main/java/com/sagar/hr/department/service/DepartmentService.java` — business logic
- `docs/features/departments/Readme.md` — feature documentation
- `docs/database/Readme.md` — schema documentation
- `docs/changelog/2026-06-27-departments-feature.md` — this log

## Rationale

Departments are a core organizational structure needed for grouping employees, generating reports, and enforcing domain-level access control. The UUID-based schema follows the project's shift toward distributed-friendly primary keys.
