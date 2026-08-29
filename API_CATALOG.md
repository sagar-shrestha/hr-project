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
- `Leave API`: Handles leave management (apply, approve, reject, balance).
  - POST `/api/v1/leaves/apply` — Apply for leave
  - PUT `/api/v1/leaves/{id}/approve` — Approve a leave request (Admin/Moderator)
  - PUT `/api/v1/leaves/{id}/reject` — Reject a leave request (Admin/Moderator)
  - GET `/api/v1/leaves/balance` — View current user's leave balance
  - GET `/api/v1/leaves/my` — View current user's leave requests
  - GET `/api/v1/leaves/pending` — View all pending leaves (Admin/Moderator)
  - POST `/api/v1/leaves/initialize-balance` — Initialize leave balances (Admin)
  
*Leave types: ANNUAL (18 days), SICK (12 days), MATERNITY (60 days), PATERNITY (15 days — Nepali market standard).*

*Detailed request/response contracts will be synced here from Swagger docs.*
