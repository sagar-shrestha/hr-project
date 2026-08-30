# API Reference

## Department Management

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/departments | List all departments | Required |
| GET | /api/v1/departments/{id} | Get a department by id | Required |
| POST | /api/v1/departments | Create a department | Required |
| PUT | /api/v1/departments/{id} | Update a department | Required |
| DELETE | /api/v1/departments/{id} | Soft delete a department | MODERATOR+ |

## Leave Management

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /api/v1/leaves/apply | Apply for leave | Required |
| POST | /api/v1/leaves/{id}/approve | Approve a pending leave | MODERATOR+ |
| POST | /api/v1/leaves/{id}/reject | Reject a pending leave | MODERATOR+ |
| GET | /api/v1/leaves/my | List own leave requests | Required |
| GET | /api/v1/leaves/pending | List all pending leaves | MODERATOR+ |
| GET | /api/v1/leaves/balance | View own leave balance | Required |
| POST | /api/v1/leaves/initialize-balance | Initialize leave balances for the year | ADMIN+ |

## Privileges

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/privileges | List all privileges | MODERATOR+ |
| GET | /api/v1/privileges/{id} | Get a privilege by id | MODERATOR+ |
| POST | /api/v1/privileges | Create a privilege | MODERATOR+ |
| PUT | /api/v1/privileges/{id} | Update a privilege | MODERATOR+ |
| DELETE | /api/v1/privileges/{id} | Soft delete a privilege | MODERATOR+ |

## Modules

Modules CRUD accepts optional `privilegeIds[]`; responses include each module's privileges (id, name, code, status).

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/modules | List all modules (with privileges) | MODERATOR+ |
| GET | /api/v1/modules/{id} | Get a module by id (with privileges) | MODERATOR+ |
| POST | /api/v1/modules | Create a module (optionally map privileges) | MODERATOR+ |
| PUT | /api/v1/modules/{id} | Update a module (optionally replace privilege mapping) | MODERATOR+ |
| DELETE | /api/v1/modules/{id} | Soft delete a module | MODERATOR+ |

## Endpoints

`POST /api/v1/endpoints` (saveEndpoint) accepts an optional `modulePrivileges[]` of `{ moduleId, privilegeId }` pairs and links the endpoint to each module+privilege pair via `modules_privileges_mapping_endpoints_mapping`. Responses include the mapped pairs (module/privilege id, name, code).

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/endpoints | List all endpoints | Required |
| GET | /api/v1/endpoints/{id} | Get an endpoint by id | Required |
| POST | /api/v1/endpoints | Save an endpoint (optionally map module+privilege pairs) | Required |
| PUT | /api/v1/endpoints/{id} | Update an endpoint | Required |
| DELETE | /api/v1/endpoints/{id} | Soft delete an endpoint | Required |

## User Management

Since `Employee extends User` (unified `/users` surface), create/update payloads carry an optional nested `employeeProfile`; providing it creates/promotes an employee profile. Response `UserResponse` exposes `isEmployee` plus a nullable `employeeProfile` (replaces the old `employeeId`).

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/users | List all users | Required |
| GET | /api/v1/users/{id} | Get a user by id | Required |
| POST | /api/v1/users | Create a user (optionally with employee profile) | Required |
| PUT | /api/v1/users/{id} | Update a user (optionally add/promote employee profile) | Required |
| PUT | /api/v1/users/{id}/roles | Replace a user's roles | Required |
| DELETE | /api/v1/users/{id} | Delete a user | Required |

## Employees

Read-only surface. All employee writes are unified under `/api/v1/users`; `/api/v1/employees` only lists/fetches internal employee views.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/employees | List all employees | Required |
| GET | /api/v1/employees/{id} | Get an employee by id | Required |

## Audit Trail

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/audit/{entityName}/{id} | Revision history for an entity instance | Required |