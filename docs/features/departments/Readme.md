# Departments

Manages organizational departments and links employees to their respective departments. Enables grouping, reporting, and role-based access by department.

## Responsibilities

- Maintain a registry of departments with unique name and code
- Provide basic CRUD operations for department records
- Link employees to a department for organizational structure

## Key Components

- **Department** — JPA entity mapped to the `departments` table (`entity/Department.java`)
- **DepartmentRepository** — Spring Data JPA repository with lookup by name and code (`repository/DepartmentRepository.java`)
- **DepartmentService** — Service layer with CRUD operations (`service/DepartmentService.java`)

## API Surface

- `GET /api/v1/departments` — list all departments
- `POST /api/v1/departments` — create a new department
- `GET /api/v1/departments/{id}` — get department by ID
- `PUT /api/v1/departments/{id}` — update a department
- `DELETE /api/v1/departments/{id}` — delete a department

## Dependencies

- **PostgreSQL** — persistence via Flyway migrations
- **Employee module** — employees reference departments via `department_id`

## Domain Rules

- Department `name` and `code` must be unique
- Deleting a department should consider existing employee references

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/department/`
