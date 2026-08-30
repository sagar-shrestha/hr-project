# Architecture

## Overview

Monolithic Spring Boot backend with a JWT-secured REST API. PostgreSQL for persistence, Redis for caching, Flyway for schema migrations.

## Module Structure

- **Auth / Security** — JWT authentication, role-based & dynamic endpoint authorization
- **User Management / Employee** — unified account + employee profile model (`User extends Employee`, SINGLE_TABLE in `users`, V33); employee writes under `/api/v1/users`, `/api/v1/employees` read-only
- **Permission** — permission management
- **Payroll** — salary computation with decorator-based caching (Spring Cache + Redis)
- **Audit** — Hibernate Envers audit trail; every entity extends `AuditableEntity`, revisions stored in `revinfo` + `*_AUD` tables, history exposed via `/api/v1/audit/{entity}/{id}`
- **Util** — shared exception handling, response wrappers, constants, audit infrastructure

## Key Patterns

- **Decorator-based caching** — `CachedPayrollCalculator` wraps `SimplePayrollCalculator`, selected via `app.payroll.cache.enabled` property using `@ConditionalOnProperty`. Allows swapping caching on/off without changing business logic.
- **Interface abstraction** — `PayrollCalculator` interface with `calculate`/`invalidateCache` enables future provider changes.
- **Spring Cache annotations** — `@Cacheable`/`@CacheEvict` keep caching declarative and provider-agnostic.
- **Global API response** — All endpoints return `GlobalApiResponse` wrapping status, message, and payload.
- **Auditing** — `@Audited` entities + Spring Data `@CreatedBy/@LastModifiedBy` on the shared `AuditableEntity` base; `AuditRevisionListener` records the acting user per revision.

## Technology Stack

- Backend: Java 17, Spring Boot 3.2.x
- Database: PostgreSQL 15
- Cache: Redis 7 (optional, togglable)
- Migrations: Flyway
- Frontend: Angular 21, Tailwind CSS
