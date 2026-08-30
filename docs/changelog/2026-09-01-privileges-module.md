# 2026-09-01 — Privileges Module

## What was done

- Added a standalone **Privileges** CRUD module (`com.sagar.hr.privileges`) mirroring the existing `screens`/`departments` pattern: entity, repository, request/response DTOs, mapper, service interface + impl, exception, controller.
- Entity fields: `id`, `name`, `code`, `status` (ACTIVE/INACTIVE), inherits `AuditableEntity` audit fields.
- Soft delete (sets `status = 'INACTIVE'` and `active = false`) on DELETE.
- Added migrations `V27__Create_Privileges_Table.sql` (table + Envers `privileges_AUD` + index) and `V28__Seed_Privileges_Endpoint_Roles.sql` (scoped to `ROLE_MODERATOR+`).

## Files touched

- `backend/.../privileges/entity/Privileges.java` — new entity
- `backend/.../privileges/repository/PrivilegesRepository.java` — new repository (findByName/findByCode, soft-delete)
- `backend/.../privileges/dto/request/CreatePrivilegesRequest.java`, `UpdatePrivilegesRequest.java` — new request DTOs
- `backend/.../privileges/dto/response/PrivilegesResponse.java` — new response DTO
- `backend/.../privileges/mapper/PrivilegesMapper.java` — new mapper
- `backend/.../privileges/service/PrivilegesService.java`, `PrivilegesServiceImpl.java` — new service
- `backend/.../privileges/exception/PrivilegesNotFoundException.java` — new exception
- `backend/.../privileges/controller/PrivilegesController.java` — new REST controller (`/api/v1/privileges`)
- `backend/src/main/resources/db/migration/V27__Create_Privileges_Table.sql` — new migration
- `backend/src/main/resources/db/migration/V28__Seed_Privileges_Endpoint_Roles.sql` — new migration
- `docs/api/Readme.md` — added Privileges endpoints
- `docs/database/Readme.md` — added V21–V28 to migration list (incl. previously undocumented screens/modules)
- `docs/features/privileges/Readme.md` — new feature doc

## Rationale

- The project needed a privilege registry for role-level entitlements; the module reuses the exact conventions established by `screens` and `departments` (builder DTOs/entities, service interface split, soft delete, Envers audit, DB-driven endpoint authorization).
- `ddl-auto: validate` requires the `privileges_AUD` table to exist, so it is created in the same migration.
- Verified with `mvn -o clean compile` under JDK 17 → BUILD SUCCESS.