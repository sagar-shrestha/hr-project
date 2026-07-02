---
trigger: always_on
---

## Context Directories

When starting any task, read from ALL of these directories for full context:

| Directory | What to read | Purpose |
|---|---|---|
| `.opencode/rules/` | `AGENTS.md`, `hr-project-rrules.md` | Project dev rules, coding standards, architecture |
| `.opencode/skills/` | `nepali-domain/SKILL.md`, `HR-REQUIREMENT.md`, `project-memory.md`, `architecture-memory.md`, `design-memory.md`, `agents/*.json`, `decisions/` | Nepali domain knowledge, project memory, historical decisions |
| `.opencode/` | `AGENTS.md` | OpenCode instructions, MCP PostgreSQL tools |

---

## Agent Memory Auto-Load

Load domain-specific agent memories for context before writing code:

| When working on... | Read this file |
|---|---|
| Backend code (Java, Spring Boot, JPA, Flyway) | `.opencode/skills/agents/backend-engineer-memory.json` — recent tasks, known patterns, circular dependency risks, API conventions |
| Frontend code (Angular, TypeScript, Tailwind, RxJS) | `.opencode/skills/agents/frontend-engineer-memory.json` — component patterns, build risks, UI conventions |

These files store recent task history, known risks, and open issues for each domain. Reading them prevents regression and preserves context across sessions.

---

# HRMS AI Development Guide

## Project Context

This is a Human Resource Management System (HRMS).

Current Stack:

Backend:
- Java 17
- Spring Boot 3.x
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Flyway
- OpenAPI / Swagger

Frontend:
- Angular
- TypeScript
- Angular Router
- Reactive Forms

Architecture:
- Feature-Based Modular Monolith

The objective is long-term maintainability, consistency, scalability, and security.

Base Package:
`com.sagar.hr`

All backend classes must reside under `com.sagar.hr.*`.
- Business feature packages (e.g., `com.sagar.hr.auth`, `com.sagar.hr.permission`, `com.sagar.hr.security`).
- Global utilities, exceptions, handlers, and shared POJOs under `com.sagar.hr.util`.

---

# Nepali Market Context

This project targets the Nepali market. All generated code must comply with:

1. Labour Act, 2074 (2017)
2. Contribution-based Social Security Act, 2074
3. Nepali tax laws and IRD guidelines
4. Bikram Sambat calendar support

## Key Domain Considerations

- **Dual calendar support** — B.S. and A.D. dates throughout the system
- **SSF contributions** — 31% total (20% employer + 11% employee)
- **Multi-slab income tax** — 1%, 10%, 20%, 30%, 36% brackets
- **Festival bonus** — 1 month's salary, auto-triggered for Dashain
- **Biometric integration** — patterns for device integration
- **Nepali Unicode** — `NVARCHAR` columns for Nepali text fields
- **Local bank export** — Nabil and Global IME format support

## Compliance Rules

- SSF must be exactly 31% (20% employer + 11% employee)
- Festival bonus must be exactly 1 month's salary
- Maternity leave: 98 days (60 fully paid)
- Paternity leave: 15 days fully paid
- Overtime: 1.5x for >8 hours/day or >48 hours/week
- Home leave: 1 day per 20 working days
- All monetary calculations must use `BigDecimal`
- PAN numbers must be encrypted at rest
- Audit trails mandatory for payroll changes

---

# AI Operating Rules

Before writing any code:

1. Search the codebase for existing implementations.
2. Reuse existing patterns.
3. Follow existing naming conventions.
4. Avoid introducing new frameworks.
5. Avoid duplicate functionality.
6. Preserve architecture consistency.
7. Generate production-ready code.
8. Generate secure code by default.
9. Generate maintainable code over clever code.
10. If multiple approaches exist, choose the simplest maintainable solution.

Never assume.

Always inspect related files before modifying code.

---

# Project Architecture

Every business module must follow:

feature
├── controller
├── service
├── repository
├── dto
│   ├── request
│   └── response
├── entity
├── mapper
├── exception
└── validator

Example:

employee
├── controller
├── service
├── repository
├── dto
├── entity
├── mapper
└── exception

leave
├── controller
├── service
├── repository
├── dto
├── entity
├── mapper
└── exception

attendance
├── controller
├── service
├── repository
├── dto
├── entity
├── mapper
└── exception

Do not create new global controller/service/repository packages.

New functionality belongs to the appropriate feature module.

---

# Backend Rules

## Controllers

Controllers must:

- Handle HTTP requests only
- Validate requests
- Call services
- Return DTOs
- Return proper HTTP status codes

Controllers must NOT:

- Access repositories directly
- Perform business logic
- Perform calculations
- Construct entities manually

Good:

Controller -> Service

Bad:

Controller -> Repository

---

## Services

Services must:

- Contain all business logic
- Handle transactions
- Coordinate repositories
- Enforce business rules

Services must NOT:

- Return JPA entities
- Handle HTTP concerns
- Contain presentation logic

---

## Repositories

Repositories must:

- Handle persistence only

Repositories must NOT:

- Contain business logic
- Perform authorization checks
- Perform DTO mapping

---

## DTO Rules

Every API endpoint must use DTOs.

Examples:

CreateEmployeeRequest

UpdateEmployeeRequest

EmployeeResponse

LeaveRequestResponse

Never expose entities through APIs.

Forbidden:

```java
return employee;
```

Required:

```java
return employeeMapper.toResponse(employee);
```

---

## Entity Rules

Entities represent database tables only.

Entities must not:

- Call services
- Perform authorization
- Contain complex business logic

Use:

```java
@MappedSuperclass
public abstract class AuditableEntity
```

All entities should inherit:

- createdAt
- updatedAt
- createdBy
- updatedBy
- active

### Nepali Entity Patterns

For entities that need Nepali text, include a dedicated field:

```java
@Column(columnDefinition = "NVARCHAR(255)")
private String nameNepali;
```

For dual-calendar entities, store both A.D. and B.S. dates:

- A.D. dates use `LocalDate`
- B.S. dates use `String` with format `YYYY-MM-DD` (or a dedicated type when implemented)

### Monetary Calculations

All salary, tax, SSF, and monetary fields must use `BigDecimal`.

### Banking Exports

Support Nabil Bank and Global IME Bank export formats for salary disbursement.

---

## Exception Rules

Never throw:

```java
RuntimeException
Exception
```

Always create or use specific exceptions.

Common utilities/exceptions are defined under `com.sagar.hr.util.exception`:
- `NotFoundException` (use when resource is not found)
- `AlreadyInUseException` (use when resource/email/username is already in use)
- `NotAbleTOAssignException` (use when operation/role assignment is invalid or disallowed)

For feature-specific exceptions, inherit from appropriate base/custom exceptions.

Use:

```java
@RestControllerAdvice
```

in `com.sagar.hr.util.handler.GlobalExceptionHandler` for centralized exception handling. All exceptions caught by the handler must return a `ResponseEntity` enclosing a `GlobalApiResponse` (`com.sagar.hr.util.pojo.response.GlobalApiResponse`):

```java
public class GlobalApiResponse {
    private Integer httpStatus;
    private String message;
    private Object data;
    private boolean status;
}
```

Use standard message strings defined in `com.sagar.hr.util.util.CommonMessages` (such as `SOMETHING_WENT_WRONG`) where applicable.

---

## Validation Rules

Use Bean Validation.

Examples:

```java
@NotBlank
@NotNull
@Email
@Size
```

Validation belongs in DTOs.

Avoid manual validation whenever possible.

---

## Transaction Rules

Use:

```java
@Transactional
```

Only on service methods.

Never on:

- Controllers
- Repositories

---

## Logging Rules

Use:

```java
@Slf4j
```

Log:

- Authentication events
- Authorization failures
- Business events
- Errors

Never log:

- Passwords
- JWT tokens
- Secrets
- Sensitive employee information

---

# Security Rules

Authentication:

JWT

Authorization:

Role + Permission Based

Rules:

- No hardcoded permissions
- No hardcoded roles
- Permissions stored in database
- All protected endpoints require authorization

Example permissions:

EMPLOYEE_VIEW

EMPLOYEE_CREATE

EMPLOYEE_UPDATE

EMPLOYEE_DELETE

PAYROLL_VIEW

PAYROLL_GENERATE

LEAVE_APPROVE

---

# Database Rules

Database:

PostgreSQL

Migration Tool:

Flyway

Rules:

Every schema change requires migration.

Examples:

V1__initial_schema.sql

V2__employee_table.sql

V3__leave_table.sql

Never modify existing migrations.

Always create a new migration.

Nepali-specific schema changes (B.S. date fields, `NVARCHAR` columns, compliance tables) must also go through Flyway migrations (e.g., `V4__add_employee_nepali_fields.sql`).

---

# API Design Rules

Base URL:

/api/v1

Examples:

/api/v1/employees

/api/v1/leave

/api/v1/payroll

/api/v1/attendance

/api/v1/auth

Use plural resources.

Use proper HTTP verbs.

GET

POST

PUT

PATCH

DELETE

Avoid verbs in URLs.

Bad:

/getEmployee

/createEmployee

Good:

GET /employees

POST /employees

---

# Mapper Rules

Use mappers for entity ↔ DTO conversion.

Examples:

EmployeeMapper

LeaveMapper

PayrollMapper

Controllers and services should not manually copy fields.

---

# Angular Rules

Folder Structure:

src/app

core
shared
features

Example:

features

├── auth
├── employee
├── leave
├── payroll
├── attendance
└── organization

---

## Angular Components

Components must:

- Have a single responsibility
- Be reusable
- Be small and focused

Prefer:

Standalone Components

OnPush Change Detection

Avoid:

Massive components

Business logic in templates

---

## Angular Services

All HTTP requests go through services.

Required:

Component
→ Service
→ Backend API

Forbidden:

Component
→ HttpClient

---

## Angular Forms

Use:

Reactive Forms

Do not use Template Driven Forms unless explicitly required.

---

## Angular State Management

Prefer:

Signals

RxJS

Introduce NgRx only when complexity requires it.

Do not introduce NgRx prematurely.

---

# Code Quality Rules

Priorities:
1. Correctness
2. Security
3. Maintainability
4. Readability
5. Performance

- Never sacrifice maintainability for cleverness.
- Prefer explicit code over magic.
- Cleanliness: Always remove unused imports and keep import statements clean and organized.

---

# HRMS Domain Rules

Expected Modules:

- Authentication
- User Management
- Role Management
- Permission Management
- Employee Management
- Department Management
- Designation Management
- Attendance
- Leave
- Payroll
- Organization
- Notification
- Audit

## Module Details (Nepali Market)

### employee_management

Centralized employee data with:
- Citizenship and PAN number storage (PAN encrypted at rest)
- Document management for legal documents
- Emergency contacts with Nepali phone formats
- Dual-language names (English + Nepali)

Entities: `Employee`, `Address`, `Document`, `EmergencyContact`, `EmploymentHistory`

### payroll

Nepali-specific payroll processing:
- SSF integration (Social Security Fund)
- Income tax slab calculation
- Festival bonus automation (Dashain)
- CIT, PF deductions
- E-TDS reporting

Entities: `Payroll`, `SalaryStructure`, `TaxSlab`, `SSFContribution`, `Deduction`, `Bonus`

### leave_attendance

Leave accrual per Labour Act 2074:
- Maternity leave: 98 days (60 fully paid)
- Paternity leave: 15 days fully paid
- Home leave: 1 day per 20 worked days
- Sick leave: 15 days (half-paid)
- Bereavement leave: 13 days

Entities: `Leave`, `LeaveType`, `LeaveBalance`, `Attendance`, `Holiday`

### time_attendance

- Biometric device integration
- Overtime: 1.5x after 8 hours/day or 48 hours/week
- Shift management
- Night shift allowances

Entities: `Shift`, `TimeLog`, `OvertimeRecord`, `BiometricLog`, `ShiftAllowance`

New functionality must belong to an existing module or a clearly defined new module.

Do not place unrelated logic into existing modules.

---

# AI Change Checklist

Before creating code:

□ Search for existing implementation

□ Check similar modules

□ Follow existing naming conventions

□ Follow existing package structure

□ Reuse existing DTO patterns

□ Reuse existing exception patterns

□ Reuse existing security patterns

□ Reuse existing mapper patterns

□ Verify Flyway migration requirements

□ Verify API consistency

Before finishing:

□ Code compiles

□ Imports cleaned

□ No duplicate logic

□ DTOs used

□ Validation added

□ Exception handling added

□ Security considered

□ Logging considered

□ Tests added if applicable
