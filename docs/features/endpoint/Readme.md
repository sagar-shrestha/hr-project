# Endpoints

Registers application endpoints as first-class records (unique name, code, url pattern, HTTP method, status) and links each endpoint to module+privilege pairs. Replaces the old `endpoint_roles` table: endpoint-authorization by role has been removed — all protected endpoints now require only an authenticated user.

## Responsibilities

- Maintain a registry of endpoints with unique name, code, and url pattern
- Provide full CRUD operations over `/api/v1/endpoints` (soft delete)
- Link endpoints to module + privilege pairs via `modules_privileges_mapping_endpoints_mapping` (many-to-many between `modules_privileges_mapping` pairs and endpoints)
- Preserve audit history via Hibernate Envers (`endpoints_AUD`, `modules_privileges_mapping_endpoints_mapping_AUD`)

## Key Components

- **Endpoint** — JPA entity mapped to the `endpoints` table (`entity/Endpoint.java`); audited (Envers), `status` (ACTIVE/INACTIVE) + inherited `active` flag, cascade-managed `mappings` collection
- **ModulesPrivilegesMappingEndpoints** — link entity mapped to `modules_privileges_mapping_endpoints_mapping` (`entity/ModulesPrivilegesMappingEndpoints.java`); `@ManyToOne` to Modules, Privileges, and Endpoint
- **EndpointRepository** — Spring Data JPA repository with lookup by name/code/url pattern and a soft-delete query (`repository/EndpointRepository.java`)
- **ModulesPrivilegesMappingEndpointsRepository** — persistence + duplicate-pair existence check for the link table (`repository/ModulesPrivilegesMappingEndpointsRepository.java`)
- **EndpointService / EndpointServiceImpl** — service interface + implementation (`service/`); `create` validates unique fields, saves the endpoint, and attaches requested module+privilege pairs (via `endpoint.getMappings()` cascade)
- **EndpointMapper** — DTO ↔ entity mapping, builder pattern; `toResponse` exposes mapped module+privilege pairs (`mapper/EndpointMapper.java`)
- **EndpointController** — REST controller; POST handler is `saveEndpoint` (`controller/EndpointController.java`)
- **ModulePrivilegeRequest / EndpointModulePrivilegeResponse** — request/response DTOs for the mapped pairs (`dto/`)
- **EndpointNotFoundException** — feature exception (`exception/EndpointNotFoundException.java`)

## API Surface

- `GET /api/v1/endpoints` — list all endpoints (with mapped module+privilege pairs)
- `POST /api/v1/endpoints` — saveEndpoint: create an endpoint, optionally attaching `modulePrivileges[]` of `{ moduleId, privilegeId }` pairs
- `GET /api/v1/endpoints/{id}` — get endpoint by ID (with mapped pairs)
- `PUT /api/v1/endpoints/{id}` — update an endpoint (mappings not managed here)
- `DELETE /api/v1/endpoints/{id}` — soft delete an endpoint (`status` → INACTIVE, `active` → false)

All endpoints require an authenticated user (see `SecurityConfig` — `anyRequest().authenticated()`).

## Dependencies

- **PostgreSQL** — persistence via Flyway migrations
- **Modules / Privileges modules** — endpoint mapping references `modules` and `privileges` records
- **JWT authentication** — any authenticated user may access any protected endpoint

## Domain Rules

- Endpoint `name`, `code`, and `url_pattern` must be unique
- `http_method` stored uppercased (GET/POST/PUT/DELETE/PATCH)
- `status` mirrors `com.sagar.hr.util.enums.Status`; soft delete sets `status = 'INACTIVE'` and `active = false`
- Duplicate name/code/urlPattern on create/update → `AlreadyInUseException`
- Mapped pairs must reference existing modules and privileges (missing → `ModulesNotFoundException` / `PrivilegesNotFoundException`)
- Duplicate or already-existing (module, privilege, endpoint) pair → `AlreadyInUseException`

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/endpoint/`