# 2026-09-03 — Employee extends User (unified employee/user model)

## What was done

- Merged employee profiles into the `users` table via JPA `SINGLE_TABLE` inheritance (`Employee extends User`), dropping the standalone `employees` table (V33).
- `users` gained a `user_type` discriminator (`USER` / `EMPLOYEE`) plus nullable employee columns (name, name_nepali, phone, citizenship_number, pan_number, nid_number, department_id, designation, employee_code, date_of_birth(+BS), join_date(+BS), status).
- Employee identity is now the user id; FKs from `attendance`, `time_logs`, `overtime_records`, `salary_structures` re-pointed from `employees(id)` to `users(id)`.
- `User`/`Employee`/`AuditableEntity` switched to `@SuperBuilder` so subclass builders set inherited fields; removed invalid `@Builder.Default` on `@SuperBuilder` fields.
- Unified creation/update under `/users`: `POST/PUT /api/v1/users` accept an optional nested `employeeProfile`; updating a plain user with a profile promotes the row in-place to `EMPLOYEE` (native `promoteToEmployee` + clear/reload).
- `/api/v1/employees` is now read-only (GET list/get). Signup delegates to `UserService.createUserFromSignup`.
- Added `EmployeeProfileRequest`, `EmployeeProfileResponse`, `CreateUserRequest`; `UserResponse` now has `isEmployee` + nullable `employeeProfile`.

## Files touched

- `V33__Merge_Employees_Into_Users.sql` — SINGLE_TABLE merge, drop `employees`/`employees_AUD`, re-point FKs, extend `users_AUD`.
- `User.java` / `Employee.java` / `AuditableEntity.java` — inheritance hierarchy + `@SuperBuilder`.
- `UserService.java` / `UserRepository.java` — create (User/Employee), promote-on-update (incl. `nid_number`), `createUserFromSignup`.
- `UserController.java`, `UserMapper.java`, DTOs — unified payloads and nested employee profile.
- `EmployeeController.java` / `EmployeeService` / `EmployeeMapper` / `EmployeeRepository` — trimmed to read-only.
- `AuthService.java` — delegates registration to `UserService.createUserFromSignup`.

## Rationale

Employees are a specialization of a login account, so keeping both in one table with SINGLE_TABLE inheritance removes the redundant user↔employee link, gives employees a stable id, and keeps roles/permissions/leave links intact under the user row.

## Verification

- `mvn -o clean compile` → BUILD SUCCESS.
- Runtime `ddl-auto: validate` (Envers `users_AUD` shape) not yet exercised locally — Postgres/Redis must be running with V33 applied to confirm.
