# 0002 — Hibernate Envers Audit Trail

**Status**: Accepted

**Date**: 2026-08-29

## Context

AGENTS.md requires audit trails for payroll and other sensitive HR data, and an `Audit` module is part of the expected feature set. The `spring-data-envers` dependency was already declared in `pom.xml` but was completely unused — no `@Audited` annotations, no `AuditableEntity` base class, no audit tables. Entities hand-rolled `createdAt`/`updatedAt` via `@PrePersist`/`@PreUpdate` and had no `createdBy`/`updatedBy`. The schema is managed by Flyway with `hibernate.ddl-auto: validate`, so any audit tables must come from migrations.

## Decision

Implement a Hibernate Envers audit trail across all domain and security entities:

1. **`AuditableEntity` base class** (`com.sagar.hr.util.audit`) with Spring Data auditing annotations (`@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`) and an `active` flag, annotated `@Audited` so snapshots include these fields. All 13 entities were refactored to extend it (removing their duplicate timestamp fields and lifecycle callbacks).
2. **Custom revision entity** (`AuditRevisionEntity`) stored in `revinfo` with `rev` (identity), `revtstmp`, and `username`, populated by `AuditRevisionListener` from the security context.
3. **`@Audited` on every entity** — including security entities and their many-to-many join tables (`user_roles_AUD`, `role_permissions_AUD`).
4. **Flyway migrations** `V15` (AuditableEntity columns on existing tables), `V16` (revinfo + `*_AUD` tables, DDL verified by generating it from Hibernate metadata), and `V17` (seeded `AUDIT_VIEW` permission and endpoint role).
5. **Read API** — `GET /api/v1/audit/{entityName}/{id}` via a new `audit` feature module, using `AuditReader` to return revision number, date, username, type, and snapshot.
6. **`jackson-datatype-hibernate6`** dependency (registered via `modulesToInstall`) so revision snapshots serialize lazily-loaded associations safely. `modulesToInstall` was used instead of `modules` to avoid clobbering Spring Boot's default modules (e.g. JSR-310).

## Consequences

### Positive

- Complete, queryable audit history for all tracked entities with zero per-service boilerplate
- `createdBy`/`updatedBy` automatically stamped on every entity
- Join-table changes (role/permission assignments) are tracked
- History survives deletes (`DEL` revisions keep snapshots readable)

### Negative

- Every write now also writes audit rows (storage + write amplification on `*_AUD` tables)
- Auditing security tables means role/permission seeding also produces revisions
- `revinfo.username` is empty for writes performed outside an authenticated context (falls back to `SYSTEM` via the auditor)

## Alternatives Considered

- **Custom audit tables + interceptors**: full control but lots of boilerplate and drift risk.
- **Only created_at/updated_at auditing (no Envers)**: insufficient — no per-change history.
- **Lombok `@SuperBuilder` on entities**: avoided; plain `@Builder` on subclasses works because `AuditableEntity` fields are set via field initializers and the auditing listener.

## Related

- `AuditableEntity`, `AuditRevisionEntity`, `AuditRevisionListener`, `AuditorAwareImpl`, `AuditConfig` — `backend/src/main/java/com/sagar/hr/util/audit/`
- `AuditController`, `AuditService`, `AuditMapper` — `backend/src/main/java/com/sagar/hr/audit/`
- Migrations: `V15__Add_Auditable_Columns.sql`, `V16__Create_Envers_Audit_Tables.sql`, `V17__Seed_Audit_Permissions.sql`
