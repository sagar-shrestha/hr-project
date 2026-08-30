# 2026-09-01 — Endpoint ↔ Module+Privilege Mapping

## What was done

- Added `modules_privileges_mapping_endpoints_mapping` link table (V32) tying `modules_privileges_mapping` module+privilege pairs to `endpoints` (many-to-many).
- Created `ModulesPrivilegesMappingEndpoints` entity in the `endpoint` entity package with `@ManyToOne` to Modules, Privileges, and Endpoint.
- Added cascade-managed `mappings` collection to the `Endpoint` entity (`@OneToMany`, `orphanRemoval`).
- Renamed `EndpointController.create` → `saveEndpoint`; `CreateEndpointRequest` now accepts optional `modulePrivileges[]` of `{ moduleId, privilegeId }` pairs.
- `EndpointServiceImpl.create` validates unique endpoint fields, saves the endpoint, then attaches the requested module+privilege pairs (duplicate + existence checks, cascade persist via `endpoint.getMappings()`).
- `EndpointResponse` exposes mapped module+privilege pairs (id, name, code) via `EndpointModulePrivilegeResponse`.

## Files touched

- `backend/src/main/resources/db/migration/V32__Create_Modules_Privileges_Mapping_Endpoints_Mapping_Table.sql` — new link table + `_AUD`
- `backend/src/main/java/com/sagar/hr/endpoint/entity/ModulesPrivilegesMappingEndpoints.java` — new link entity
- `backend/src/main/java/com/sagar/hr/endpoint/entity/Endpoint.java` — added `mappings` collection
- `backend/src/main/java/com/sagar/hr/endpoint/repository/ModulesPrivilegesMappingEndpointsRepository.java` — new repository (dup-pair existence check)
- `backend/src/main/java/com/sagar/hr/endpoint/dto/request/ModulePrivilegeRequest.java` — new request DTO
- `backend/src/main/java/com/sagar/hr/endpoint/dto/request/CreateEndpointRequest.java` — added `modulePrivileges`
- `backend/src/main/java/com/sagar/hr/endpoint/dto/response/EndpointModulePrivilegeResponse.java` — new response DTO
- `backend/src/main/java/com/sagar/hr/endpoint/dto/response/EndpointResponse.java` — added `modulePrivileges`
- `backend/src/main/java/com/sagar/hr/endpoint/mapper/EndpointMapper.java` — map mappings in `toResponse`
- `backend/src/main/java/com/sagar/hr/endpoint/service/EndpointServiceImpl.java` — attach mappings on create
- `backend/src/main/java/com/sagar/hr/endpoint/controller/EndpointController.java` — `saveEndpoint`
- `docs/database/Readme.md`, `docs/api/Readme.md`, `docs/features/endpoint/Readme.md` — updated
- `.opencode/skills/agents/backend-engineer-memory.json` — memory updated

## Rationale

Enables permissions-style authorization data: an endpoint can be associated with specific (module, privilege) pairs so protected routes can later be authorized by matching privilege sets rather than a removed `endpoint_roles` model.