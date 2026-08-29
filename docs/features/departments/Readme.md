# Departments

Manages organizational departments and links employees to their respective departments. Enables grouping, reporting, and role-based access by department.

## Responsibilities

- Maintain a registry of departments with unique name and code
- Provide CRUD operations for department records (soft delete)
- Link employees to a department for organizational structure
- Expose a REST controller over `/api/v1/departments`

## Key Components

- **Department** — JPA entity mapped to the `departments` table (`model/Department.java`); audited (Envers), has `status` (ACTIVE/INACTIVE) + inherited `active` flag
- **DepartmentRepository** — Spring Data JPA repository with lookup by name/code and a soft-delete query (`repository/DepartmentRepository.java`)
- **DepartmentService / DepartmentServiceImpl** — service interface + implementation (`service/`)
- **DepartmentController** — REST controller, authorization delegated to `endpoint_roles` (`controller/DepartmentController.java`)
- **DepartmentNotFoundException** — feature exception (`exception/DepartmentNotFoundException.java`)

## API Surface

- `GET /api/v1/departments` — list all departments
- `POST /api/v1/departments` — create a new department
- `GET /api/v1/departments/{id}` — get department by ID
- `PUT /api/v1/departments/{id}` — update a department
- `DELETE /api/v1/departments/{id}` — soft delete a department (`status` → INACTIVE, `active` → false)

All department endpoints are seeded in `endpoint_roles` for `ROLE_MODERATOR+` (covers SUPER_ADMIN/ADMIN/MODERATOR via role hierarchy).

## Dependencies

- **PostgreSQL** — persistence via Flyway migrations
- **Employee module** — employees reference departments via `department_id`
- **DynamicAuthorizationManager / endpoint_roles** — endpoint authorization

## Domain Rules

- Department `name` and `code` must be unique
- Dept name stored bilingually: `name` (English) + `nameNepali` (NVARCHAR)
- `status` mirrors `com.sagar.hr.util.enums.Status`; soft delete sets `status = 'INACTIVE'` and `active = false`
- Soft delete keeps the record (auditable/history) rather than physically removing it

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/department/`
