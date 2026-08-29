# ADR-001: Redis Caching for Payroll Calculations

## Status
Accepted

## Context
Payroll calculations are computationally expensive, involving salary structure lookups, tax computations, benefits deductions, and prorated amounts. As the organization grows, repeated recalculations for the same employee and pay period cause unacceptable latency and database load.

The system needs a caching layer that:
- Reduces payroll calculation latency
- Works with the existing Spring Boot stack
- Can be swapped for a different caching provider in the future
- Automatically invalidates when salary structures change

## Decision
Introduce a `PayrollCalculator` interface with two implementations:

1. **`SimplePayrollCalculator`** — the real calculation logic, used when caching is disabled.
2. **`CachedPayrollCalculator`** — a decorator that wraps `SimplePayrollCalculator` with Spring Cache abstraction backed by Redis.

Key design decisions:
- **Interface abstraction** (`PayrollCalculator`) allows swapping implementations without changing callers.
- **Spring Cache `@Cacheable`/`@CacheEvict`** annotations keep caching declarative and provider-agnostic.
- **Redis** is chosen as the initial cache store due to its speed, TTL support, and common availability in cloud deploys.
- **Cache invalidation** happens in `SalaryStructureService` whenever a salary structure is created, updated, or deactivated — ensuring data freshness.
- **Feature toggle** via `app.payroll.cache.enabled` allows instant fallback to uncached calculation without redeployment.
- **TTL of 1 hour** prevents stale data while bounding memory usage.

## Consequences
### Positive
- Payroll calculation latency is drastically reduced for repeated requests.
- The `PayrollCalculator` interface allows future migration to Memcached, Hazelcast, Caffeine, or any JCache-compatible provider.
- Redis is battle-tested and well-supported by Spring Boot.
- Cache invalidation is automatic on salary structure changes.

### Negative
- Added operational dependency on Redis (must be running for cached mode).
- If Redis is unavailable and caching is enabled, calculations will fail unless circuit-breaking is added.
- Slightly more complex deployment setup (Redis container, connection config).

## Alternatives Considered
- **Caffeine (in-process cache)**: Faster for single-instance but doesn't scale horizontally. Data would drift across instances.
- **Database query optimization alone**: Insufficient for the scale of repeated payroll recalculations.
- **No cache**: Acceptable for minimal load, but doesn't meet performance requirements for growth.

## Related
- `PayrollCalculator` interface: `backend/src/main/java/com/sagar/hr/payroll/service/PayrollCalculator.java`
- Redis configuration: `backend/src/main/java/com/sagar/hr/payroll/config/RedisConfig.java`
- Salary structure eviction: `backend/src/main/java/com/sagar/hr/payroll/service/SalaryStructureService.java`
- Flyway migration: `V5__Create_Salary_Structures_Table.sql`
