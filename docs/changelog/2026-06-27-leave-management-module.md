# 2026-06-27 — Leave Management Module

## What was done

- Enhanced existing leave management module under `com.sagar.hr.leave`
- Updated Flyway V5 migration to add `approved_at`, `rejected_reason`, `CANCELLED` status to leave_requests, and `year` column with year-based unique constraint to leave_balances
- Enhanced `LeaveRequest` entity with `approvedAt`, `rejectedReason` fields
- Enhanced `LeaveBalance` entity with `year` field and year-based unique constraint
- Added `CANCELLED` status to `LeaveStatus` enum
- Added `findByUserIdAndLeaveTypeAndYear` and `findByUserIdAndYear` to `LeaveBalanceRepository`
- Refactored `LeaveRequestService` with proper exception types (`InsufficientLeaveBalanceException`, `IllegalArgumentException`, `IllegalStateException`) instead of generic `RuntimeException`
- Implemented year-based balance tracking and validation
- Updated approve/reject to set `approvedAt`/`rejectedReason` timestamps
- Added `POST /{id}/approve` and `POST /{id}/reject` endpoints to controller
- Created `InsufficientLeaveBalanceException` custom exception
- Wired leave exceptions into `GlobalExceptionHandler`
- Set correct Nepal Labour Act 2074 maternity leave to 98 days
- Created comprehensive documentation (feature, API, database, architecture, ADR, changelog)

## Files touched

- `backend/src/main/resources/db/migration/V5__Create_Leave_Module_Tables.sql` — enhanced schema with approved_at, rejected_reason, year column, CANCELLED status
- `backend/src/main/java/com/sagar/hr/leave/entity/LeaveRequest.java` — added approvedAt, rejectedReason fields
- `backend/src/main/java/com/sagar/hr/leave/entity/LeaveBalance.java` — added year field, updated unique constraint
- `backend/src/main/java/com/sagar/hr/leave/entity/LeaveStatus.java` — added CANCELLED
- `backend/src/main/java/com/sagar/hr/leave/repository/LeaveBalanceRepository.java` — added year-based query methods
- `backend/src/main/java/com/sagar/hr/leave/service/LeaveRequestService.java` — refactored with proper exceptions, year-based balance, approve/reject enhancements
- `backend/src/main/java/com/sagar/hr/leave/controller/LeaveRequestController.java` — added approve/reject endpoints, added try-catch to all endpoints
- `backend/src/main/java/com/sagar/hr/leave/dto/response/LeaveResponse.java` — added approvedAt, rejectedReason fields
- `backend/src/main/java/com/sagar/hr/leave/exception/InsufficientLeaveBalanceException.java` — new custom exception
- `backend/src/main/java/com/sagar/hr/util/handler/GlobalExceptionHandler.java` — added handlers for InsufficientLeaveBalanceException, IllegalArgumentException, IllegalStateException
- `docs/features/leave-management/Readme.md` — feature documentation
- `docs/api/Readme.md` — API reference
- `docs/database/Readme.md` — database schema
- `docs/architecture/Readme.md` — architecture update
- `docs/decisions/0001-leave-management-module.md` — ADR
- `docs/changelog/2026-06-27-leave-management-module.md` — changelog

## Rationale

Leave management is a core HRMS requirement. The existing module skeleton was enhanced with proper Nepali labour law compliance, year-based balance tracking, and robust exception handling. Keeping the existing `entity` package and `LeaveRequestService`/`LeaveRequestController` naming conventions avoided breaking changes while adding all required functionality.
