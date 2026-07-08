# 2026-08-29 — Hibernate Envers Audit Trail

## What was done

- Implemented Hibernate Envers audit trail across all entities (the `spring-data-envers` dependency was declared but unused)
- Added `AuditableEntity` base class (createdAt/updatedAt/createdBy/updatedBy/active) with Spring Data auditing; refactored all 13 entities to extend it and removed their hand-rolled timestamp fields/lifecycle callbacks
- Added custom `AuditRevisionEntity` (revinfo: rev/revtstmp/username) with `AuditRevisionListener` stamping the acting user
- Added `@Audited` to every entity, including security entities and their join tables
- Added Flyway migrations V15 (auditable columns), V16 (revinfo + `*_AUD` tables), V17 (AUDIT_VIEW permission + endpoint role)
- Added `audit` feature module with `GET /api/v1/audit/{entityName}/{id}` history endpoint
- Added `jackson-datatype-hibernate6` (registered via `modulesToInstall`) for lazy-safe snapshot serialization

## Files touched

- `backend/pom.xml` — added `jackson-datatype-hibernate6`
- `backend/src/main/java/com/sagar/hr/util/audit/` — new: AuditableEntity, AuditRevisionEntity, AuditRevisionListener, AuditorAwareImpl, AuditConfig
- `backend/src/main/java/com/sagar/hr/audit/` — new: AuditController, AuditService, AuditMapper, dto/response/*
- `backend/src/main/java/com/sagar/hr/{employee,department,leave,payroll,attendance,reporting,security}` entity files — `@Audited` + extend AuditableEntity
- `backend/src/main/java/com/sagar/hr/payroll/mapper/SalaryStructureMapper.java` — `isActive()` → `getActive()`
- `backend/src/main/resources/db/migration/V15__Add_Auditable_Columns.sql`, `V16__Create_Envers_Audit_Tables.sql`, `V17__Seed_Audit_Permissions.sql` — new migrations
- `backend/src/main/resources/db/migration/V18__Align_Schema_With_Entities.sql` — generated from the Hibernate schema migrator diff: aligns `salary_structures` money columns to `NUMERIC(38,2)` and adds the missing `time_logs.shift_id` FK

## Rationale

AGENTS.md requires audit trails (mandatory for payroll changes) and an Audit module. Envers gives complete write-level history with no per-service boilerplate, and a shared auditable base class satisfies the "all entities inherit AuditableEntity" convention. `_AUD` DDL was generated from Hibernate metadata to guarantee `ddl-auto: validate` passes.

## Verification

- Backend compiles cleanly
- App booted against PostgreSQL 15 (Docker `auth_db`): Flyway applied V15–V17, Hibernate `validate` passed
- E2E: login → create/update/delete employee produced ADD/MOD/DEL revisions in `employees_AUD` with `revinfo.username = adminuser`; audit API returned full history; unknown entity/ID returned 404
- Join-table auditing verified on `user_roles_AUD` when changing a user's roles
- Endpoint is access-controlled (ROLE_USER denied; ROLE_SUPER_ADMIN allowed), consistent with existing endpoint-role enforcement

## Notes

- The 401-on-denied response for non-super-admin roles is pre-existing app security behavior (affects all protected endpoints equally, including `/api/v1/users`); no security files were modified.
- PostgreSQL 15 container `auth_db` was started to run the verification.
