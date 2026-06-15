# API Catalog

> **Status:** Initial Discovery Phase
> **Documentation Tool:** Springdoc OpenAPI (Swagger)

## Current APIs (Discovered via Modules)
- `Auth API`: Handles stateless authentication (JWT) and User registration.
  - POST `/api/v1/auth/signin`
  - POST `/api/v1/auth/signup`
- `User API`: Handles User roles management and lifecycle.
  - GET `/api/v1/users`
  - POST `/api/v1/users`
  - PUT `/api/v1/users/{id}/roles`
  - DELETE `/api/v1/users/{id}`
- `Permission API`: Endpoints managed by `PermissionController` using `PermissionService`.
  - GET `/api/v1/permissions`
  - POST `/api/v1/permissions`
  - DELETE `/api/v1/permissions/{id}`

*Detailed request/response contracts will be synced here from Swagger docs.*
