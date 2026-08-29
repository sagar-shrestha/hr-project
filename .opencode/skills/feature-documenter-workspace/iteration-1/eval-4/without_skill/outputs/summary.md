# Summary: Redis Caching for Payroll Calculations

## Task
Introduce Redis caching for slow payroll calculations behind an interface, with automatic cache invalidation on salary structure changes, plus an ADR.

## What Was Done

### New Files Created

| File | Purpose |
|------|---------|
| `backend/src/main/java/com/sagar/hr/payroll/service/PayrollCalculator.java` | Interface abstraction for payroll calculation (swap implementations later) |
| `backend/src/main/java/com/sagar/hr/payroll/service/SimplePayrollCalculator.java` | Core calculation logic (tax, deductions) |
| `backend/src/main/java/com/sagar/hr/payroll/service/CachedPayrollCalculator.java` | Redis-cached decorator via `@Cacheable`/`@CacheEvict` |
| `backend/src/main/java/com/sagar/hr/payroll/model/PayrollCalculationRequest.java` | Request DTO |
| `backend/src/main/java/com/sagar/hr/payroll/model/PayrollCalculationResult.java` | Result DTO |
| `backend/src/main/java/com/sagar/hr/payroll/model/SalaryStructure.java` | JPA entity for salary structure table |
| `backend/src/main/java/com/sagar/hr/payroll/repository/SalaryStructureRepository.java` | JPA repository with active-structure query |
| `backend/src/main/java/com/sagar/hr/payroll/service/SalaryStructureService.java` | Service that triggers cache invalidation on salary changes |
| `backend/src/main/java/com/sagar/hr/payroll/config/RedisConfig.java` | Redis cache manager config (1h TTL, JSON serialization) |
| `backend/src/main/resources/db/migration/V5__Create_Salary_Structures_Table.sql` | Flyway migration for salary_structures table |
| `docs/decisions/001-redis-caching-for-payroll.md` | Architecture Decision Record |

### Existing Files Modified

| File | Change |
|------|--------|
| `backend/pom.xml` | Added `spring-boot-starter-data-redis` dependency |
| `backend/src/main/resources/application.yml` | Added Redis connection config and `app.payroll.cache.enabled` toggle |

### Architecture
- **Interface**: `PayrollCalculator` defines `calculate()` and `invalidateCache()`
- **Decorator pattern**: `CachedPayrollCalculator` wraps `SimplePayrollCalculator`, activated by `app.payroll.cache.enabled=true`
- **Invalidation**: `SalaryStructureService.createOrUpdate()` and `.deactivate()` call `invalidateCache(employeeId)` to evict stale entries
- **Feature toggle**: `@ConditionalOnProperty` on `CachedPayrollCalculator` — falls back to `SimplePayrollCalculator` when Redis is unavailable
