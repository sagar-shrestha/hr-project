# 2026-08-29 — Department Module: Controller + Interface split + Soft delete

## What was done

- Split `DepartmentService` into an interface + `DepartmentServiceImpl` (mirrors the employee module).
- Added a dedicated `DepartmentController` exposing full CRUD over `/api/v1/departments`.
- Added soft delete for departments (`status` → `INACTIVE`, `active` → `false`).
- Fixed two bugs found during verification:
  - `@Modifying` repository methods must return `void` (Spring Data rejects `boolean`).
  - Soft-delete query set lowercase `'inactive'` which fails enum mapping on re-read — the `Status` enum constant is `INACTIVE`.
- Fixed the same lowercase-enum bug in `EmployeeRepository` and added missing `@Enumerated(EnumType.STRING)` to `Employee.status` (needed for `ddl-auto: validate` to pass).

## Files touched

- `backend/.../department/controller/DepartmentController.java` — new CRUD controller
- `backend/.../department/service/DepartmentService.java` — interface
- `backend/.../department/service/DepartmentServiceImpl.java` — implementation (soft delete)
- `backend/.../department/repository/DepartmentRepository.java` — soft-delete query fixed (`void`, `'INACTIVE'`)
- `backend/.../employee/entity/Employee.java` — added `@Enumerated(EnumType.STRING)` on `status`
- `backend/.../employee/repository/EmployeeRepository.java` — corrected soft-delete query (`'INACTIVE'`, comma syntax)
- `docs/api/Readme.md` — added Department Management endpoints

## Rationale

- Program to interfaces and expose a REST controller for departments, consistent with the employee module.
- Soft delete preserves records for audit/history instead of physical removal.
- Enum stored as string must match the exact enum constant name (`INACTIVE`), and `@Enumerated(EnumType.STRING)` keeps Hibernate's schema validation aligned with `varchar(20)` columns.
