# Payroll

Computes employee net salary by applying tax, allowances, and deductions against a configurable salary structure. Results are cached using Spring's cache abstraction backed by Redis to avoid repeated recalculation.

## Responsibilities

- Calculate net salary for a given employee and salary structure
- Manage salary structure definitions (CRUD with effective dating)
- Cache calculation results and evict on structure changes

## Key Components

- **PayrollCalculator** — interface with `calculate()` and `invalidateCache()` (`backend/src/main/java/com/sagar/hr/payroll/service/PayrollCalculator.java`)
- **SimplePayrollCalculator** — the actual tax and deduction computation (`backend/src/main/java/com/sagar/hr/payroll/service/SimplePayrollCalculator.java`)
- **CachedPayrollCalculator** — decorator wrapping `SimplePayrollCalculator` with `@Cacheable`/`@CacheEvict` annotations (`backend/src/main/java/com/sagar/hr/payroll/service/CachedPayrollCalculator.java`)
- **RedisConfig** — configures `RedisCacheManager` with 1-hour TTL and JSON serialization (`backend/src/main/java/com/sagar/hr/payroll/config/RedisConfig.java`)
- **PayrollService** — orchestrates salary lookup and calculation dispatch (`backend/src/main/java/com/sagar/hr/payroll/service/PayrollService.java`)
- **SalaryStructureService** — CRUD for salary structures with cache invalidation (`backend/src/main/java/com/sagar/hr/payroll/service/SalaryStructureService.java`)
- **SalaryStructure** — entity defining a pay band (basic, allowances, deductions, tax, effective dating) (`backend/src/main/java/com/sagar/hr/payroll/model/SalaryStructure.java`)

## API Surface

- `GET /api/v1/payroll/calculate?employeeId=&structureName=&periodStart=&periodEnd=` — compute net salary
- `POST /api/v1/payroll/structures` — create salary structure
- `PUT /api/v1/payroll/structures/{id}` — update salary structure (evicts cache)
- `DELETE /api/v1/payroll/structures/{id}` — deactivate salary structure (evicts cache)

## Dependencies

- PostgreSQL (`salary_structures` table)
- Redis (optional — disabled via `app.payroll.cache.enabled=false`)

## Domain Rules

- Net salary = (base + bonuses) − taxes − deductions
- Tax rate is 20% (configurable in `SimplePayrollCalculator`)
- Cache keyed by employee ID via `@Cacheable(value = "payroll", key = "#request.employeeId")`
- Cache evicted for an employee on salary structure create/update/deactivate
- Cache TTL is 1 hour (configurable in `RedisConfig`)

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/payroll/`
