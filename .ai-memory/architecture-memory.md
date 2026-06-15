# Architecture Memory

## Domain Model
- Employee / User
- Roles (Admin, Moderator, User)
- Permissions
- Attendance

## Architectural Patterns
- **Backend:** Layered Architecture (Controller -> Service -> Repository)
  - Base Package: `com.sagar.hr`
  - RESTful APIs (versioned under `/api/v1`)
  - Stateless Authentication
  - Centralized Exception Handling: `@RestControllerAdvice` (`com.sagar.hr.util.handler.GlobalExceptionHandler`) mapping to a unified `GlobalApiResponse` format.
- **Frontend:** Component-based SPA
  - Standalone Components (Angular 21)
  - Reactive Programming with RxJS
  - Route Guards for Authentication/Authorization

## Integration Boundaries
- **Database Layer:** PostgreSQL accessed via Spring Data JPA. Database versioning managed by Flyway.
- **Authentication Layer:** Spring Security and JJWT.
- **Frontend-Backend Boundary:** JSON over REST HTTP APIs (wrapping success/error payloads in `GlobalApiResponse`).
