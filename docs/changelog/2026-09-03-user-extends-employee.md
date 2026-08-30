# 2026-09-03 — User extends Employee (login fields moved to User subclass)

## What was done

- Confirmed **Option B**: `class User extends Employee`.
- `Employee` (`com.sagar.hr.employee.entity`) is the SINGLE_TABLE root over the `users` table (`@Inheritance(SINGLE_TABLE)`, `@DiscriminatorColumn("user_type")`, `@DiscriminatorValue("EMPLOYEE")`), holding `@Id` + HR profile fields only.
- `User` (`employee.entity`, `@DiscriminatorValue("USER")`) now extends `Employee` and carries the login fields: `username`, `email`, `password`, and `roles` (ManyToMany via `users_roles_association`).
- `EmployeeRepository` stays the single root repository (`JpaRepository<Employee, Long>`); `findByUsername` / `findByEmail` / `findUserById` / `existsByUsername` / `existsByEmail` now return/query `User` via JPQL (login fields live on the subclass). Legacy native `promoteToEmployee` and TYPE-filtered `findAllEmployees` / `findEmployeeById` kept.
- `UserService` account operations (create/update/roles/delete/get) now resolve and operate on `User` (via `findUserById`). An account with an employee profile simply fills the inherited profile fields on the same `USER` row.
- `UserMapper.toResponse` accepts `User`; `isEmployee` now derived from `user.getName() != null` (a `User` is always an `Employee`, so `instanceof` no longer distinguishes).
- `UserDetailsServiceImpl` / `UserDetailsImpl` log in via `User` (`build(User, ...)`).
- `LeaveRequest` / `LeaveBalance` user associations and `approve`/`reject` approvers retyped to `User`.
- `AuditService` maps `user` → `User.class`, `employee` → `Employee.class`.
- `EmployeeMapper` no longer maps `email` (root `Employee` has none).

## Files touched

- `employee/entity/Employee.java` (root: `@Id` + profile), `employee/entity/User.java` (subclass: login fields + roles)
- `employee/repository/EmployeeRepository.java` (root repo with `User`-typed login queries)
- `usermanagement/service/UserService.java`, `usermanagement/mapper/UserMapper.java`
- `security/services/UserDetailsServiceImpl.java`, `security/services/UserDetailsImpl.java`
- `leave/entity/LeaveRequest.java`, `leave/entity/LeaveBalance.java`, `leave/service/LeaveRequestServiceImpl.java`
- `employee/mapper/EmployeeMapper.java`
- `audit/service/AuditService.java`
- `docs/features/employee-user/Readme.md`

## Rationale

The account is the specialization: a login is a `User` (a kind of `Employee`), and any profile data an account carries lives in the inherited columns of the same single-table row. This keeps one `users` table with `USER`/`EMPLOYEE` discriminators and no new migration.

## Verification

- `mvn -o clean compile` → BUILD SUCCESS.
- Runtime `ddl-auto: validate` (SINGLE_TABLE + Envers `users_AUD`) still needs a local run with V33/V34 applied; the schema itself is unchanged by this refactor.
