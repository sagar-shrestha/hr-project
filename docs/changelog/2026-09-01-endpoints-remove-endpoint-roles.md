# 2026-09-01 — Endpoints Module + Remove endpoint_roles

## What was done

- Added a standalone **Endpoints** CRUD module (`com.sagar.hr.endpoint`): entity (`id / name / code / url_pattern / http_method / status`), repository, request/response DTOs, mapper, service interface + impl, exception, controller (`/api/v1/endpoints`).
- **Removed the `endpoint_roles` authorization system entirely**:
  - Deleted the `endpointrole` module (controller, service, mapper, repository, DTOs).
  - Deleted `security/model/EndpointRole.java`.
  - Deleted `security/auth_manager/DynamicAuthorizationManager.java`.
  - `SecurityConfig` now uses `.anyRequest().authenticated()` instead of the DB-backed manager.
  - `AuditService` no longer registers `endpoint-role`; now registers `endpoint`.
- Migrations: `V30__Create_Endpoints_Table.sql` (table + `endpoints_AUD`), `V31__Drop_Endpoint_Roles.sql` (drops `endpoint_roles` + `endpoint_roles_AUD`).

## Files touched

- `backend/.../endpoint/**` — new module (8 files)
- `backend/.../endpointrole/**` — deleted
- `backend/.../security/model/EndpointRole.java` — deleted
- `backend/.../security/auth_manager/DynamicAuthorizationManager.java` — deleted
- `backend/.../security/config/SecurityConfig.java` — anyRequest().authenticated()
- `backend/.../audit/service/AuditService.java` — endpoint-role entry removed, endpoint added
- `backend/src/main/resources/db/migration/V30__Create_Endpoints_Table.sql` — new migration
- `backend/src/main/resources/db/migration/V31__Drop_Endpoint_Roles.sql` — new migration
- `docs/database/Readme.md`, `docs/api/Readme.md`, `docs/features/endpoint/Readme.md` — updated/added

## Rationale

- Per request, roles associated with endpoints were removed: authorization is now simply "any authenticated user" for all protected endpoints. The `endpoint_roles` table and its DB-backed authorization manager are no longer needed.
- `ddl-auto: validate` requires `endpoints_AUD` to exist (created in V30); the obsolete `endpoint_roles*` tables are dropped in V31 (Flyway runs them in order).

## Notes

- Frontend still references the `/endpoint-roles` page and `EndpointRoleService` — those will 404 now that the backend endpoint is gone. A future frontend task should replace them with an Endpoints page.
- Verified with `mvn -o clean compile` under JDK 17 → BUILD SUCCESS.