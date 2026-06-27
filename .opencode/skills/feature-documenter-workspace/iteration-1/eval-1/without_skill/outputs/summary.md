# Leave Management Module — Implementation Summary

## Task
Created a complete leave management backend module under `com.sagar.hr.leave` for a Nepali-market HRMS project.

## What Was Done

### 1. Flyway Migration
- **File:** `V5__Create_Leave_Module_Tables.sql`
- Creates `leave_requests` table (user_id, leave_type, status, date range, reason, total_days, approver references, remarks, timestamps)
- Creates `leave_balances` table (user_id, leave_type, total_days, used_days) with unique constraint on (user_id, leave_type)

### 2. Entities (`entity/`)
- `LeaveType` — enum: ANNUAL, SICK, MATERNITY, PATERNITY
- `LeaveStatus` — enum: PENDING, APPROVED, REJECTED
- `LeaveRequest` — JPA entity mapped to `leave_requests`, with `@ManyToOne` to User (FK: user_id, approved_by)
- `LeaveBalance` — JPA entity mapped to `leave_balances`, with `@ManyToOne` to User (FK: user_id)

### 3. Repositories (`repository/`)
- `LeaveRequestRepository` — findByUserId, findByStatus, findByApprovedById
- `LeaveBalanceRepository` — findByUserIdAndLeaveType, findByUserId

### 4. Service (`service/`)
- `LeaveRequestService` — full business logic:
  - `applyLeave()` — validates balance, creates PENDING request
  - `approveLeave()` — sets APPROVED + remarks, deducts from leave balance
  - `rejectLeave()` — sets REJECTED + remarks
  - `viewBalance()` — returns all 4 leave types with total/used/remaining days
  - `initializeLeaveBalance()` — creates initial balances for a user
  - Accrual rules (Nepali-market): ANNUAL=18d, SICK=12d, MATERNITY=60d, PATERNITY=15d

### 5. Controller (`controller/`)
- `LeaveRequestController` — REST endpoints under `/api/v1/leaves`:
  - `POST /apply` — apply for leave (authenticated user)
  - `PUT /{id}/approve` — approve (Admin/Moderator)
  - `PUT /{id}/reject` — reject (Admin/Moderator)
  - `GET /balance` — view own leave balance
  - `GET /my` — view own leave requests
  - `GET /pending` — view pending leaves (Admin/Moderator)
  - `POST /initialize-balance` — init balances (Admin)

### 6. DTOs
- `request/ApplyLeaveRequest` — validated (FutureOrPresent, NotBlank)
- `request/ApproveRejectRequest` — optional remarks
- `response/LeaveResponse` — full leave request representation
- `response/LeaveBalanceResponse` — balance with remaining calculation

### 7. Exception
- `InsufficientLeaveBalanceException` — thrown when balance insufficient, handled by `GlobalExceptionHandler` (returns 400 BAD_REQUEST)

### 8. Documentation
- Updated `API_CATALOG.md` with all leave endpoints
- Updated `DATABASE_SCHEMA.md` with leave_requests and leave_balances table schemas

## Files Created (12 new files)
| # | File | Purpose |
|---|------|---------|
| 1 | `db/migration/V5__Create_Leave_Module_Tables.sql` | Flyway migration |
| 2 | `leave/entity/LeaveType.java` | Leave type enum |
| 3 | `leave/entity/LeaveStatus.java` | Leave status enum |
| 4 | `leave/entity/LeaveRequest.java` | Leave request entity |
| 5 | `leave/entity/LeaveBalance.java` | Leave balance entity |
| 6 | `leave/repository/LeaveRequestRepository.java` | Leave request repository |
| 7 | `leave/repository/LeaveBalanceRepository.java` | Leave balance repository |
| 8 | `leave/dto/request/ApplyLeaveRequest.java` | Apply leave DTO |
| 9 | `leave/dto/request/ApproveRejectRequest.java` | Approve/reject DTO |
| 10 | `leave/dto/response/LeaveResponse.java` | Leave response DTO |
| 11 | `leave/dto/response/LeaveBalanceResponse.java` | Balance response DTO |
| 12 | `leave/service/LeaveRequestService.java` | Leave business logic |
| 13 | `leave/controller/LeaveRequestController.java` | REST controller |
| 14 | `leave/exception/InsufficientLeaveBalanceException.java` | Custom exception |

## Build Status
`mvn clean compile` — **BUILD SUCCESS** (no leave-related errors)
