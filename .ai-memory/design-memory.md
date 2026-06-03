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
- **Structure:** Clean separation of concerns (Controller, Service, Repository).
- **Principles:** STRICT adherence to SOLID principles.
- **Dependency Injection:** Use constructor injection (avoid field injection where possible, as learned from past circular dependency issues).

## Historical Decisions
- Refactored `SecurityConfig` and `DynamicAuthorizationManager` to fix circular dependencies.
- Extracted business logic from Controllers to Services (e.g., `PermissionService`).
- Modified `UserDetailsImpl` to resolve user creation issues by caching roles.
