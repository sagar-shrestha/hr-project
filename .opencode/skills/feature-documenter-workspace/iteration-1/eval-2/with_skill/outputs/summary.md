# Summary — Attendance Summary Endpoint

## Task

Added a new REST endpoint `GET /api/v1/reports/attendance-summary` returning daily attendance counts (present, absent, late, leave) grouped by department for a given date range.

## What was created

### Code (8 files)

| File | Purpose |
|------|---------|
| `backend/src/main/resources/db/migration/V5__Create_Departments_And_Attendance.sql` | Flyway migration creating `departments` and `attendance` tables |
| `backend/src/main/java/com/sagar/hr/reporting/model/Department.java` | JPA entity for `departments` |
| `backend/src/main/java/com/sagar/hr/reporting/model/Attendance.java` | JPA entity for `attendance` with FK to department |
| `backend/src/main/java/com/sagar/hr/reporting/model/AttendanceStatus.java` | Enum: PRESENT, ABSENT, LATE, LEAVE |
| `backend/src/main/java/com/sagar/hr/reporting/repository/AttendanceRepository.java` | Spring Data JPA repository with JPQL aggregation query |
| `backend/src/main/java/com/sagar/hr/reporting/dto/AttendanceSummaryResponse.java` | Response DTO (department, present, absent, late, leave) |
| `backend/src/main/java/com/sagar/hr/reporting/service/AttendanceSummaryService.java` | Service layer mapping query results to DTOs |
| `backend/src/main/java/com/sagar/hr/reporting/controller/ReportingController.java` | REST controller at `/api/v1/reports/attendance-summary` |

### Documentation (5 files)

All created per the feature-documenter skill:

- `docs/features/reporting/Readme.md` — Feature overview
- `docs/api/Readme.md` — API reference table
- `docs/database/Readme.md` — Schema docs + migrations table
- `docs/architecture/Readme.md` — Updated module structure and technology stack
- `docs/changelog/2026-06-27-attendance-summary-endpoint.md` — Session log

## Controller location

`com.sagar.hr.reporting.controller.ReportingController` — package `reporting` under `com.sagar.hr`.

## Endpoint details

```
GET /api/v1/reports/attendance-summary?startDate=2026-01-01&endDate=2026-06-27
```

Response: JSON array of objects with fields `department`, `present`, `absent`, `late`, `leave`.

## Architecture decisions

- New `reporting` package to keep concerns separate from auth/security
- Enum-based attendance status (type-safe, no magic strings)
- JPQL aggregation query grouped by department and status, pivoted in service layer
- Follows existing layered pattern (Controller → Service → Repository) and Lombok conventions

## Verification

The `reporting` package compiles against the existing Spring Boot 3.2.1 / Java 17 project. Database migration is versioned at V5. All patterns (constructor injection, `@CrossOrigin`, `@RestController`, `@RequestMapping`, Lombok `@Builder`/`@Getter`/`@Setter`) match the existing codebase conventions.
