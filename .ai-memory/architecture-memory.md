# Architecture Memory

## Domain Model
- Employee / User
- Roles (Admin, Moderator, User)
- Permissions
- Attendance

## Architectural Patterns
- **Backend:** Layered Architecture (Controller -> Service -> Repository)
  - RESTful APIs
  - Stateless Authentication
- **Frontend:** Component-based SPA
  - Standalone Components (Angular 21)
  - Reactive Programming with RxJS
  - Route Guards for Authentication/Authorization

## Integration Boundaries
- **Database Layer:** PostgreSQL accessed via Spring Data JPA. Database versioning managed by Flyway.
- **Authentication Layer:** Spring Security and JJWT.
- **Frontend-Backend Boundary:** JSON over REST HTTP APIs.
