# Summary: Attendance Report Endpoint

## Task
Added a new REST endpoint `GET /api/v1/reports/attendance-summary` that returns daily attendance counts (present, absent, late, leave) grouped by department for a given date range.

## What was done

### Files Created/Modified

**Controller** (in `com.sagar.hr.reporting`):
- `ReportingController.java` — Added `GET /api/v1/reports/attendance-summary` endpoint with `startDate` and `endDate` query parameters. Already existed with the correct mapping; no changes needed.

**Service:**
- `AttendanceSummaryService.java` — Fixed aggregation logic. The native query returns rows of (department, status, count), and the service aggregates these into `AttendanceSummaryResponse` objects with separate counts per department.

**DTO:**
- `AttendanceSummaryResponse.java` — Contains `department`, `present`, `absent`, `late`, `leave` fields. Added `@Builder` annotation.

**Model:**
- `Attendance.java` — JPA entity mapping to the `attendance` table with fields: `id`, `employeeId`, `date`, `status` (enum), `departmentId`.
- `AttendanceStatus.java` — Enum with values: `PRESENT`, `ABSENT`, `LATE`, `LEAVE`.

**Repository:**
- `AttendanceRepository.java` — Native SQL query that joins `attendance` with `departments` and groups by department name and status to produce the summary counts.

**Flyway Migration:**
- `V8__Seed_Reports_Endpoint_Role.sql` — Seeds the endpoint role mapping so that authenticated users (ROLE_USER) can access the report endpoint via the dynamic authorization manager.

### Endpoint Details

- **URL:** `GET /api/v1/reports/attendance-summary`
- **Query Parameters:** `startDate` (ISO date), `endDate` (ISO date)
- **Response:** JSON array of objects with `department`, `present`, `absent`, `late`, `leave` fields
- **Controller package:** `com.sagar.hr.reporting` (via `ReportingController`)

### Files List

```
backend/src/main/java/com/sagar/hr/reporting/controller/ReportingController.java
backend/src/main/java/com/sagar/hr/reporting/dto/AttendanceSummaryResponse.java
backend/src/main/java/com/sagar/hr/reporting/model/Attendance.java
backend/src/main/java/com/sagar/hr/reporting/model/AttendanceStatus.java
backend/src/main/java/com/sagar/hr/reporting/repository/AttendanceRepository.java
backend/src/main/java/com/sagar/hr/reporting/service/AttendanceSummaryService.java
backend/src/main/resources/db/migration/V8__Seed_Reports_Endpoint_Role.sql
```
