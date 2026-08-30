# Employee & User Management (unified model)

Since V33, employees and login accounts live in a single `users` table using JPA `SINGLE_TABLE` inheritance, discriminated by `user_type`. The hierarchy is **`User extends Employee`** (confirmed Option B): `Employee` is the inheritance root holding the primary key + HR profile fields; `User` is the subclass that adds the login fields (`username`, `email`, `password`, `roles`).

## Responsibilities

- `Employee` (root) — HR profile fields: name in English/Nepali, phone, citizenship/PAN/NID, department, designation, employee code, DOB/join dates in A.D. and B.S., status. Holds `@Id`.
- `User` (subclass, `@DiscriminatorValue("USER")`) — login account fields: `username`, `email`, `password`, `roles` (many-to-many via `users_roles_association`).
- A row with `user_type = 'EMPLOYEE'` loads as `Employee` (profile-only, no login columns mapped). A row with `user_type = 'USER'` loads as `User` and can also carry inherited profile fields on the same row.

## Key Components

- `Employee` entity (root) — `@Table("users")`, `@Inheritance(SINGLE_TABLE)`, `@DiscriminatorColumn("user_type")`, `@DiscriminatorValue("EMPLOYEE")`, `@Audited`, `@SuperBuilder`. Lives in `employee.entity`.
- `User` entity (subclass) — `@DiscriminatorValue("USER")`, extends `Employee`, holds `username`/`email`/`password`/`roles`.
- `EmployeeRepository` — single root repository (`JpaRepository<Employee, Long>`); login lookups return `User` via JPQL (`findByUsername`, `findByEmail`, `findUserById`, `existsByUsername/Email`); includes legacy `promoteToEmployee` (native) and TYPE-filtered `findAllEmployees`/`findEmployeeById`.
- `UserService` — create/update/roles/delete operate on `User` (accounts); an account with profile data fills the inherited profile fields on a `USER` row. `createUserFromSignup` disabled-ish — delegates from `AuthService`.
- `UserController` / `EmployeeController` — `/api/v1/users` (full CRUD) and `/api/v1/employees` (read-only).
- `UserMapper` — accepts `User`; `isEmployee = user.getName() != null` (a `User` is always an `Employee`, so `instanceof` can no longer distinguish).
- `LeaveRequest`/`LeaveBalance` — user associations typed as `User`.
- `UserDetailsServiceImpl` / `UserDetailsImpl` — login via `EmployeeRepository.findByUsername` (returns `User`), `build(User, ...)`.

## API Surface

- `POST /api/v1/users` / `PUT /api/v1/users/{id}` — create/update; optional nested `employeeProfile` fills profile fields on the account.
- `GET /api/v1/users`, `GET /api/v1/users/{id}`, `PUT /api/v1/users/{id}/roles`, `DELETE /api/v1/users/{id}`.
- `GET /api/v1/employees`, `GET /api/v1/employees/{id}` — read-only views of `EMPLOYEE`-typed rows.

## Dependencies

- `Department` (ManyToOne) for employee department.
- `Role` (ManyToMany via `users_roles_association`) on `User` (login account).

## Domain Rules

- Employee identity is the user id; no separate employee id.
- An account is a `User`; profile data is stored in the inherited columns on the same `USER` row.
- `user_type='EMPLOYEE'` rows are profile-only (no login columns mapped).
- PAN stored encrypted at rest; citizenship/PAN/NID/employee_code unique via partial indexes.
- A.D. dates use `LocalDate`; B.S. dates use `VARCHAR(10)` `YYYY-MM-DD`.

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/employee/` (entities, repository, controller, service, mapper, DTOs), `backend/src/main/java/com/sagar/hr/usermanagement/` (UserService, UserController, UserMapper, DTOs).
