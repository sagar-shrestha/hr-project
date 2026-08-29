# 2026-06-27 — Attendance Summary Endpoint

## What was done

- Created Flyway migration V5 adding `departments` and `attendance` tables
- Implemented `Department`, `Attendance`, `AttendanceStatus` entities in `reporting` package
- Implemented `AttendanceRepository` with a JPQL aggregation query for attendance counts by department
- Created `AttendanceSummaryResponse` DTO
- Implemented `AttendanceSummaryService` to map query results to DTOs
- Created `ReportingController` exposing `GET /api/v1/reports/attendance-summary` with `startDate` and `endDate` query params
- Wrote documentation: feature doc, API ref, database schema, architecture overview, and changelog

## Files touched

- `backend/src/main/resources/db/migration/V5__Create_Departments_And_Attendance.sql` — new migration
- `backend/src/main/java/com/sagar/hr/reporting/model/Department.java` — new entity
- `backend/src/main/java/com/sagar/hr/reporting/model/Attendance.java` — new entity
- `backend/src/main/java/com/sagar/hr/reporting/model/AttendanceStatus.java` — new enum
- `backend/src/main/java/com/sagar/hr/reporting/repository/AttendanceRepository.java` — new repository
- `backend/src/main/java/com/sagar/hr/reporting/dto/AttendanceSummaryResponse.java` — new DTO
- `backend/src/main/java/com/sagar/hr/reporting/service/AttendanceSummaryService.java` — new service
- `backend/src/main/java/com/sagar/hr/reporting/controller/ReportingController.java` — new controller
- `docs/features/reporting/Readme.md` — created
- `docs/api/Readme.md` — created
- `docs/database/Readme.md` — created
- `docs/architecture/Readme.md` — created
- `docs/changelog/2026-06-27-attendance-summary-endpoint.md` — created

## Rationale

New reporting capability requested for attendance dashboards. The feature is isolated in its own `reporting` package to keep concerns separated from auth/security code. Data is stored in dedicated tables to support future HR features (employees, leaves, payroll) that depend on the same department and attendance primitives.
