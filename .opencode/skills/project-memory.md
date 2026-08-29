# Project Memory

## Business Context
- **Domain:** Human Resources Management System (HRMS)
- **Known Modules:** Employee Management, Attendance, User/Role Management, Permissions, Dashboards.
- **Objectives:** Streamline HR processes securely and provide a premium user experience.

## Technical Context
- **Backend Architecture:** Spring Boot Layered Architecture (Controller, Service, Repository) under package prefix `com.sagar.hr` as per project rules. Common utilities and global exception handlers are stored in `com.sagar.hr.util`.
- **Frontend Architecture:** Angular SPA using components, routing, and guards. Styled with Tailwind CSS.
- **Database:** PostgreSQL (managed with Flyway migrations).
- **Security Strategy:** JWT-based stateless authentication using Spring Security and JJWT. Role-based access control (Admin, Moderator, User).
- **API Documentation:** Swagger/OpenAPI configured.

## Constraints
- **Backend Pattern:** Must strictly follow Controller-Service-Repository pattern under `com.sagar.hr`.
- **Java Principle:** Must use SOLID principles.
- **API Design:** All endpoints must be versioned under `/api/v1`.
- **Exception Design:** Centralized exceptions and global API response wrappers (`GlobalApiResponse`) under `com.sagar.hr.util` must be utilized.
- **Frontend Aesthetics:** Must use rich aesthetics, dynamic designs, harmonious color palettes, and Tailwind CSS.
- **AI Rule:** Orchestrator must perform context analysis and memory updates for every task.
