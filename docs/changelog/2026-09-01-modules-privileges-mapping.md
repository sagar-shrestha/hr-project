# 2026-09-01 — Modules ↔ Privileges Mapping

## What was done

- Added a unidirectional **Many-to-Many** mapping from `Modules` (owning side) to `Privileges` via `@JoinTable(name = "modules_privileges_mapping")`.
- `CreateModulesRequest` / `UpdateModulesRequest` now accept optional `privilegeIds[]`; `ModulesResponse` includes each module's mapped privileges (id, name, code, status) — "codes shown" in responses.
- Added migration `V29__Create_Modules_Privileges_Mapping_Table.sql` (join table + Envers `modules_privileges_mapping_AUD`).

## Files touched

- `backend/.../modules/entity/Modules.java` — added `Set<Privileges> privileges` (`@ManyToMany`, `@Builder.Default`, `@ToString.Exclude`)
- `backend/.../modules/dto/request/CreateModulesRequest.java`, `UpdateModulesRequest.java` — added `privilegeIds`
- `backend/.../modules/dto/response/ModulesResponse.java` — added `privileges` list
- `backend/.../modules/mapper/ModulesMapper.java` — builds/ maps the privileges collection
- `backend/.../modules/service/ModulesServiceImpl.java` — injects `PrivilegesRepository`, resolves IDs (`PrivilegesNotFoundException` on missing), read-only transactions on reads, replace-on-update only when `privilegeIds` provided
- `backend/src/main/resources/db/migration/V29__Create_Modules_Privileges_Mapping_Table.sql` — new migration
- `docs/database/Readme.md`, `docs/api/Readme.md` — updated
- `.opencode/skills/agents/backend-engineer-memory.json` — noted the mapping

## Rationale

- Mirrors the existing User→Role / Role→Permission `@ManyToMany` + `@JoinTable` pattern.
- Envers audits the join table since `Modules` is `@Audited`, so `modules_privileges_mapping_AUD` is created in the same migration (`ddl-auto: validate`).
- Mapping rides on existing `/api/v1/modules` CRUD — no new endpoint-role seeds needed.

Verified with `mvn -o clean compile` under JDK 17 → BUILD SUCCESS.