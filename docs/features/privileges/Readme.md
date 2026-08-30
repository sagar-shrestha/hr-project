# Privileges

Manages a registry of privileges (permissions granted to roles) with a unique name and code plus lifecycle status. Mirrors the README pattern of the `departments` module — a standalone CRUD resource.

## Responsibilities

- Maintain a registry of privileges with unique name and code
- Provide full CRUD operations (soft delete) over `/api/v1/privileges`
- Preserve audit history via Hibernate Envers (`privileges_AUD`)

## Key Components

- **Privileges** — JPA entity mapped to the `privileges` table (`entity/Privileges.java`); audited (Envers), `status` (ACTIVE/INACTIVE) + inherited `active` flag
- **PrivilegesRepository** — Spring Data JPA repository with lookup by name/code and a soft-delete query (`repository/PrivilegesRepository.java`)
- **PrivilegesService / PrivilegesServiceImpl** — service interface + implementation (`service/`)
- **PrivilegesMapper** — DTO ↔ entity mapping, builder pattern (`mapper/PrivilegesMapper.java`)
- **PrivilegesController** — REST controller, authorization delegated to `endpoint_roles` (`controller/PrivilegesController.java`)
- **PrivilegesNotFoundException** — feature exception (`exception/PrivilegesNotFoundException.java`)

## API Surface

- `GET /api/v1/privileges` — list all privileges
- `POST /api/v1/privileges` — create a new privilege
- `GET /api/v1/privileges/{id}` — get privilege by ID
- `PUT /api/v1/privileges/{id}` — update a privilege
- `DELETE /api/v1/privileges/{id}` — soft delete a privilege (`status` → INACTIVE, `active` → false)

All privilege endpoints are seeded in `endpoint_roles` for `ROLE_MODERATOR+` (covers SUPER_ADMIN/ADMIN/MODERATOR via role hierarchy).

## Dependencies

- **PostgreSQL** — persistence via Flyway migrations
- **DynamicAuthorizationManager / endpoint_roles** — endpoint authorization

## Domain Rules

- Privilege `name` and `code` must be unique
- `status` mirrors `com.sagar.hr.util.enums.Status`; soft delete sets `status = 'INACTIVE'` and `active = false`
- Soft delete keeps the record (auditable/history) rather than physically removing it
- Duplicate name/code on create/update → `AlreadyInUseException`

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/privileges/`