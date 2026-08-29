# Summary: Leave Management Module

## What was done

Built and enhanced a complete leave management module under `com.sagar.hr.leave` for the Nepali HRMS project. The module supports four leave types (ANNUAL, SICK, MATERNITY, PATERNITY) with Nepal Labour Act 2074 compliant accrual rules, and provides REST endpoints for apply, approve, reject, and balance viewing.

## Files created/modified

**Database migration:**
- `backend/src/main/resources/db/migration/V5__Create_Leave_Module_Tables.sql` — created `leave_requests` and `leave_balances` tables with year-based uniqueness, approve/reject audit columns, and proper foreign keys

**Entities:**
- `entity/LeaveType.java` — enum: ANNUAL, SICK, MATERNITY, PATERNITY
- `entity/LeaveStatus.java` — enum: PENDING, APPROVED, REJECTED, CANCELLED
- `entity/LeaveRequest.java` — JPA entity with user, leaveType, status, dates, approvedBy, approvedAt, rejectedReason
- `entity/LeaveBalance.java` — JPA entity with year-based unique constraint

**Repositories:**
- `repository/LeaveRequestRepository.java` — JPA repository with status/employee queries
- `repository/LeaveBalanceRepository.java` — JPA repository with year-based queries

**Service:**
- `service/LeaveRequestService.java` — business logic with Nepali accrual rules (18 annual, 12 sick, 98 maternity, 15 paternity), balance validation, approve/reject workflow

**Controller:**
- `controller/LeaveRequestController.java` — REST endpoints at `/api/v1/leaves/*`

**Exception:**
- `exception/InsufficientLeaveBalanceException.java` — custom exception for insufficient balance
- `util/handler/GlobalExceptionHandler.java` — added handlers for leave-specific exceptions

**Documentation (per feature-documenter skill):**
- `docs/features/leave-management/Readme.md` — feature overview
- `docs/api/Readme.md` — API reference table
- `docs/database/Readme.md` — schema documentation
- `docs/architecture/Readme.md` — architecture update
- `docs/decisions/0001-leave-management-module.md` — ADR
- `docs/changelog/2026-06-27-leave-management-module.md` — session changelog

## Key design decisions

- Year-based balance tracking with `UNIQUE(user_id, leave_type, year)` to prevent cross-year conflicts
- Balance deducted on approval (not application) — consistent with existing project pattern
- Custom exceptions used over generic RuntimeException for better error handling
- `POST /{id}/approve` and `POST /{id}/reject` endpoints (not PUT) to differentiate from updates
- Maternity leave corrected from previous 60 to 98 days per Nepal Labour Act 2074

## Build status

`mvn clean compile` — **BUILD SUCCESS** (67 source files, 0 errors)
