# Design Memory

## User Interface Guidelines
- **Framework:** Angular with Tailwind CSS
- **Aesthetics:** 
  - Vibrant colors and sophisticated dark modes.
  - Smooth gradients and dynamic micro-animations.
  - Modern typography (e.g., Inter, Roboto).
  - Premium, state-of-the-art look and feel (no simple/generic minimum viable product designs).
- **Icons:** Lucide-angular

## Backend Design Guidelines
- **Structure:** Clean separation of concerns (Controller, Service, Repository) under the `com.sagar.hr` package layout.
- **Principles:** STRICT adherence to SOLID principles.
- **Dependency Injection:** Use constructor injection (avoid field injection where possible, as learned from past circular dependency issues).
- **Responses and Exceptions:** Intercept exceptions globally using `GlobalExceptionHandler` and wrap all success/error responses in `GlobalApiResponse`.

## Historical Decisions
- Refactored `SecurityConfig` and `DynamicAuthorizationManager` to fix circular dependencies.
- Extracted business logic from Controllers to Services (e.g., `PermissionService`).
- Modified `UserDetailsImpl` to resolve user creation issues by caching roles.
- Renamed application base package to `com.sagar.hr` to resolve default namespace naming.
- Implemented global/centralized Exception handling under `com.sagar.hr.util.handler.GlobalExceptionHandler` and unified `GlobalApiResponse` wrapper.
- Versioned all REST API paths under `/api/v1/...` in both frontend and backend configurations.
