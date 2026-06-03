# Coding Standards

## Backend (Java / Spring Boot)
1. **Architecture:** Strictly adhere to the Layered Architecture (Controller → Service → Repository).
2. **SOLID Principles:** Apply single responsibility, open-closed, Liskov substitution, interface segregation, and dependency inversion.
3. **Dependency Injection:** Favor constructor injection over field injection to prevent circular dependencies.
4. **Data Transfer:** Use DTOs for data entering/leaving the API. Use MapStruct or manual mappers for DTO-Entity conversion.
5. **Validation:** Use `jakarta.validation` constraints on DTOs.
6. **Exception Handling:** Utilize a `@ControllerAdvice` for global exception handling.

## Frontend (Angular / TypeScript)
1. **Components:** Use Standalone Components. Keep components small, modular, and focused.
2. **State Management:** Leverage RxJS for reactive programming and state management.
3. **Styling:** Use Tailwind CSS. Strive for rich, premium aesthetics (avoid basic generic designs).
4. **Typing:** Strict TypeScript mode enabled. Avoid `any` types.

## General
- **Technical Debt:** Track missing tests and refactoring opportunities in `.ai-memory/technical-debt/`.
- **Security:** Validate inputs, use stateless JWT auth, and practice defense-in-depth.
