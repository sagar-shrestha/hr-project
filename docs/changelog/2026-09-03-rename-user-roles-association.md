# 2026-09-03 — Explicitly create users_roles_association join table

## What was done

- The ManyToMany join table between `users` and `roles` is now explicitly created as `users_roles_association` (instead of being a rename of the legacy `user_roles` table).
- Updated the `@JoinTable(name = "users_roles_association")` on `Employee.roles` (the inheritance root in the `User extends Employee` hierarchy). Columns remain `user_id` / `role_id`.
- Added Flyway `V34__Create_Users_Roles_Association.sql`: creates `users_roles_association` (PK + FKs), migrates any existing `user_roles` rows, drops the legacy `user_roles` table, and renames the Envers audit table `user_roles_AUD` → `users_roles_association_AUD`.

## Files touched

- `backend/src/main/java/com/sagar/hr/employee/entity/Employee.java` — `@JoinTable` name.
- `backend/src/main/resources/db/migration/V34__Create_Users_Roles_Association.sql` — new migration (replaces the earlier rename-based V34, which was never applied).

## Rationale

The join table is now defined under its own name with an explicit `CREATE TABLE` rather than reached via a table rename, so the schema visibly contains a dedicated `users_roles_association` table. Data is preserved from any prior `user_roles` table (fresh DB: the V2 super-admin seed; existing DB: real role assignments). V1/V2/V16 are left untouched to preserve Flyway integrity; `ddl-auto: validate` requires the physical table to match the `@JoinTable`, and the Envers audit table is kept consistent with the joined table.

## Verification

- `mvn -o clean compile` → BUILD SUCCESS.
- Still requires a local run to apply V34 and confirm `ddl-auto: validate` + Envers against the created tables.
