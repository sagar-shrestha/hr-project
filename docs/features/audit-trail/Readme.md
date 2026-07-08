# Audit Trail

Hibernate Envers-based audit trail for the HRMS. Every write to a tracked entity produces an immutable revision record capturing who changed what, when, and the full before/after snapshot. This satisfies the audit-trail requirement for payroll and other sensitive HR data.

## Responsibilities

- Record an audit revision for every insert, update, and delete on audited entities
- Capture the acting user (`username`) and transaction timestamp for each revision
- Capture the full entity snapshot at each revision (including soft-delete `active` flag)
- Expose revision history through a read-only REST API
- Track membership changes on many-to-many relations (user roles, role permissions)
- Populate `createdBy` / `updatedBy` on entities via Spring Data auditing

## Key Components

- **`AuditableEntity`** (`backend/src/main/java/com/sagar/hr/util/audit/AuditableEntity.java`) — `@MappedSuperclass` providing `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `active`, populated by `AuditingEntityListener`. Annotated `@Audited` so these fields are included in snapshots. Every domain entity extends it.
- **`AuditRevisionEntity`** (`util/audit/AuditRevisionEntity.java`) — custom Envers revision entity stored in `revinfo` with `rev`, `revtstmp`, and `username`.
- **`AuditRevisionListener`** (`util/audit/AuditRevisionListener.java`) — stamps the current username into each new revision from the security context.
- **`AuditorAwareImpl`** (`util/audit/AuditorAwareImpl.java`) — resolves the current user for `@CreatedBy`/`@LastModifiedBy` (falls back to `SYSTEM`).
- **`AuditConfig`** (`util/audit/AuditConfig.java`) — `@EnableJpaAuditing`, `AuditorAware` bean, and Jackson Hibernate6 module (lazy-safe snapshot serialization).
- **`AuditService`** (`audit/service/AuditService.java`) — maps a URL entity name to its class and reads revision history via `AuditReader`.
- **`AuditController`** (`audit/controller/AuditController.java`) — exposes the history endpoint.
- **`AuditMapper`** (`audit/mapper/AuditMapper.java`) — converts revision rows to `RevisionResponse` DTOs (snapshot serialized to a `Map`).

## API Surface

- `GET /api/v1/audit/{entityName}/{id}` — returns revision history (revision number, date, username, ADD/MOD/DEL type, snapshot) for an entity instance. Protected via `endpoint_roles` (seeded for `ROLE_MODERATOR`; `ROLE_SUPER_ADMIN` bypasses).

## Dependencies

- Spring Data Envers (`spring-data-envers`) + Hibernate Envers (already on the classpath)
- `jackson-datatype-hibernate6` — lazy-safe serialization of revision snapshots
- Security module for current-user resolution

## Domain Rules

- Audit is write-only at the persistence layer; history is read through the audit API (never exposes live entities)
- All monetary-sensitive entities (payroll `SalaryStructure`, `Employee`, leave, attendance) are audited
- Security entities (`User`, `Role`, `Permission`, `EndpointRole`) are audited, including join-table membership
- Deletes are captured as `DEL` revisions; snapshots remain queryable after the row is gone
- `createdBy`/`updatedBy` are stamped from the authenticated `UserDetailsImpl` username; system writes use `SYSTEM`

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/util/audit/` (infrastructure) and `backend/src/main/java/com/sagar/hr/audit/` (feature module)
- **DB**: `revinfo` + one `*_AUD` table per audited entity (see `docs/database/Readme.md`)
