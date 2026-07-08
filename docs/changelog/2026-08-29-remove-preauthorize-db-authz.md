# 2026-08-29 — Remove @PreAuthorize, rely on DB-backed endpoint authorization

## What was done

- Removed all `@PreAuthorize` / method-level role annotations, replacing them with DB-backed `endpoint_roles` seeds so authorization is governed solely by `DynamicAuthorizationManager` + the `endpoint_roles` table.
- Seeded `endpoint_roles` rows for department and leave endpoints, preserving the access levels the annotations previously enforced (using the role hierarchy SUPER_ADMIN > ADMIN > MODERATOR > USER).
- Updated the project security rules to prohibit `@PreAuthorize`.

## Files touched

- `backend/.../department/controller/DepartmentController.java` — removed `@PreAuthorize` + import
- `backend/.../leave/controller/LeaveRequestController.java` — removed 4 `@PreAuthorize` + import
- `backend/src/main/resources/db/migration/V20__Seed_Department_And_Leave_Endpoint_Roles.sql` — new migration seeding endpoint_roles
- `.opencode/rules/AGENTS.md` — Security Rules: added "Do NOT use @PreAuthorize" guidance
- `docs/database/Readme.md` — added V19, V20 migrations
- `docs/features/departments/Readme.md` — updated to reflect controller, soft delete, endpoint-roles auth

## Rationale

- `DynamicAuthorizationManager` (SecurityConfig) authorizes every request against `endpoint_roles`; with no matching row it allows any authenticated user. Hardcoded `@PreAuthorize` roles were inconsistent with the project's "permissions stored in database" rule and duplicated (partially) the DB mechanism.
- Seeded `ROLE_MODERATOR` for department CRUD + leave approve/reject/pending and `ROLE_ADMIN` for leave initialize-balance, matching prior annotation semantics via the role hierarchy.

## Verification

- Flyway applies V20 cleanly; app boots with `ddl-auto: validate`.
- SUPER_ADMIN can GET/POST departments (200/201); a ROLE_USER is denied (401) on GET/POST/DELETE departments.
- Test data cleaned up after verification.
