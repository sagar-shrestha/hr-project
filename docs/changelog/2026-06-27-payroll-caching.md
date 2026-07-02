# 2026-06-27 — Payroll Caching with Redis

## What was done

- Created `com.sagar.hr.payroll` module with `PayrollCalculator` interface, `SimplePayrollCalculator` (actual logic), and `CachedPayrollCalculator` (decorator with Spring `@Cacheable`/`@CacheEvict`)
- Created `SalaryStructure` entity, repository, `SalaryStructureService` (CRUD with cache invalidation), `PayrollService`, and `PayrollController`
- Added Flyway migration V5 for the `salary_structures` table
- Added `RedisConfig` with `RedisCacheManager` (1-hour TTL, JSON serialization) and `@EnableCaching`
- Added Redis service to docker-compose.yml and Spring Boot Redis configuration
- Wired cache invalidation into salary structure create/update/deactivate operations
- Created documentation: feature doc, architecture doc, API doc, database doc, ADR

## Files touched

- `backend/pom.xml` — added spring-boot-starter-data-redis and spring-boot-starter-cache
- `backend/src/main/java/com/sagar/hr/payroll/service/PayrollCalculator.java` — cache abstraction interface
- `backend/src/main/java/com/sagar/hr/payroll/service/SimplePayrollCalculator.java` — calculation logic
- `backend/src/main/java/com/sagar/hr/payroll/service/CachedPayrollCalculator.java` — caching decorator
- `backend/src/main/java/com/sagar/hr/payroll/service/PayrollService.java` — orchestration service
- `backend/src/main/java/com/sagar/hr/payroll/service/SalaryStructureService.java` — structure CRUD with eviction
- `backend/src/main/java/com/sagar/hr/payroll/config/RedisConfig.java` — Redis cache manager config
- `backend/src/main/java/com/sagar/hr/payroll/controller/PayrollController.java` — REST endpoints
- `backend/src/main/java/com/sagar/hr/payroll/model/SalaryStructure.java` — entity
- `backend/src/main/java/com/sagar/hr/payroll/model/PayrollCalculationRequest.java` — request DTO
- `backend/src/main/java/com/sagar/hr/payroll/model/PayrollCalculationResult.java` — result DTO
- `backend/src/main/java/com/sagar/hr/payroll/repository/SalaryStructureRepository.java` — repository
- `backend/src/main/resources/db/migration/V5__Create_Salary_Structures_Table.sql` — migration
- `backend/src/main/resources/application.yml` — Redis + cache toggle config
- `backend/docker-compose.yml` — added Redis service and env vars

## Rationale

Payroll calculations were slow due to repeated full recomputation. The `PayrollCalculator` interface with a decorator-based caching layer solves the performance problem while keeping the option to toggle caching on/off or swap providers later. Cache invalidation on salary structure changes guarantees data consistency.
