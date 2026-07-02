# Architecture

## Overview

Monolithic Spring Boot backend with a JWT-secured REST API. PostgreSQL for persistence, Redis for caching, Flyway for schema migrations.

## Module Structure

- **Auth / Security** — JWT authentication, role-based & dynamic endpoint authorization
- **Permission** — permission management
- **Payroll** — salary computation with decorator-based caching (Spring Cache + Redis)
- **Util** — shared exception handling, response wrappers, constants

## Key Patterns

- **Decorator-based caching** — `CachedPayrollCalculator` wraps `SimplePayrollCalculator`, selected via `app.payroll.cache.enabled` property using `@ConditionalOnProperty`. Allows swapping caching on/off without changing business logic.
- **Interface abstraction** — `PayrollCalculator` interface with `calculate`/`invalidateCache` enables future provider changes.
- **Spring Cache annotations** — `@Cacheable`/`@CacheEvict` keep caching declarative and provider-agnostic.
- **Global API response** — All endpoints return `GlobalApiResponse` wrapping status, message, and payload.

## Technology Stack

- Backend: Java 17, Spring Boot 3.2.x
- Database: PostgreSQL 15
- Cache: Redis 7 (optional, togglable)
- Migrations: Flyway
- Frontend: Angular 21, Tailwind CSS
