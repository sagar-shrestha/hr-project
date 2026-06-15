# Coding Standards

## Backend (Java / Spring Boot)
1. **Base Package:** All backend classes must reside under `com.sagar.hr`.
2. **Architecture:** Strictly adhere to the Layered Architecture (Controller → Service → Repository).
3. **SOLID Principles:** Apply single responsibility, open-closed, Liskov substitution, interface segregation, and dependency inversion.
4. **Dependency Injection:** Favor constructor injection over field injection to prevent circular dependencies.
5. **Data Transfer:** Use DTOs for data entering/leaving the API. Use MapStruct or manual mappers for DTO-Entity conversion.
6. **Validation:** Use `jakarta.validation` constraints on DTOs.
7. **Exception & Response Handling:** Utilize a `@ControllerAdvice` (`GlobalExceptionHandler`) in `com.sagar.hr.util.handler` to catch exceptions globally and format them into the unified `GlobalApiResponse` layout. Use common exception types like `NotFoundException`, `AlreadyInUseException`, and `NotAbleTOAssignException` from `com.sagar.hr.util.exception`.

## Frontend (Angular / TypeScript)
1. **Components:** Use Standalone Components. Keep components small, modular, and focused.
2. **State Management:** Leverage RxJS for reactive programming and state management.
3. **Styling:** Use Tailwind CSS. Strive for rich, premium aesthetics (avoid basic generic designs).
4. **Typing:** Strict TypeScript mode enabled. Avoid `any` types.

## General
1. **Technical Debt:** Track missing tests and refactoring opportunities in `.ai-memory/technical-debt/`.
2. **Security:** Validate inputs, use stateless JWT auth, and practice defense-in-depth.
3. **Cleanliness:** Avoid unused imports in both Java and TypeScript files. Always remove unused imports before committing.
