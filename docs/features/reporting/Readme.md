# Reporting

Provides aggregated views over HR operational data for dashboards and downstream consumers. Currently supports daily attendance summaries grouped by department.

## Responsibilities

- Aggregate attendance records (present, absent, late, leave) by department for a given date range
- Expose structured JSON responses suitable for charting and reporting UIs

## Key Components

- **ReportingController** — REST entry point (`reporting/controller/ReportingController.java`)
- **AttendanceSummaryService** — query logic and DTO mapping (`reporting/service/AttendanceSummaryService.java`)
- **AttendanceRepository** — custom JPQL aggregation query (`reporting/repository/AttendanceRepository.java`)

## API Surface

- `GET /api/v1/reports/attendance-summary?startDate=...&endDate=...` — daily attendance counts grouped by department

## Dependencies

- **Attendance** and **Department** entities (`reporting/model/`)
- Attendance data must be recorded per-employee per-day via the attendance table

## Domain Rules

- Attendance statuses are constrained to: PRESENT, ABSENT, LATE, LEAVE
- One attendance record per employee per day (unique constraint on employee_id + date)
- Date range is inclusive on both start and end

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/reporting/`
