# Leave Management

Manages employee leave requests and balances for the Nepali HRMS. Supports four leave types with Nepal Labour Act, 2074 compliant accrual rules. Employees can apply for leave, managers/HR can approve or reject, and everyone can view balances.

## Responsibilities

- Leave application, approval, and rejection workflow
- Leave balance tracking and accrual per employee per year
- Nepali labour law compliance for leave entitlements
- Role-based access (employees apply, managers/HR approve)
- Balance initialization endpoint for administrators

## Key Components

- **LeaveRequestController** — REST endpoints for leave operations (`controller/LeaveRequestController.java`)
- **LeaveRequestService** — business logic, balance validation, accrual rules (`service/LeaveRequestService.java`)
- **LeaveRequest** — JPA entity for leave requests (`entity/LeaveRequest.java`)
- **LeaveBalance** — JPA entity for per-employee-year leave balances (`entity/LeaveBalance.java`)
- **LeaveType** — enum: ANNUAL, SICK, MATERNITY, PATERNITY (`entity/LeaveType.java`)
- **LeaveStatus** — enum: PENDING, APPROVED, REJECTED, CANCELLED (`entity/LeaveStatus.java`)

## API Surface

- `POST /api/v1/leaves/apply` — Apply for leave
- `POST /api/v1/leaves/{id}/approve` — Approve a pending leave
- `POST /api/v1/leaves/{id}/reject` — Reject a pending leave
- `GET /api/v1/leaves/my` — List own leave requests
- `GET /api/v1/leaves/pending` — List all pending leaves (managers/HR)
- `GET /api/v1/leaves/balance` — View own leave balance
- `POST /api/v1/leaves/initialize-balance` — Initialize leave balances for current year

## Dependencies

- **User/Security module** — for employee and approver identity
- **Flyway** — database migration V5 creates leave tables

## Domain Rules

- **Annual leave**: 18 days/year, accrues at 1.5 days/month (Nepal Labour Act 2074, Section 105)
- **Sick leave**: 12 days/year, accrues at 1 day/month (Section 106)
- **Maternity leave**: 98 days (14 weeks), full allocation upon eligibility (Section 107)
- **Paternity leave**: 15 days, full allocation after 1 year of service (Section 108)
- Leave balance is checked before application; insufficient balance raises `InsufficientLeaveBalanceException`
- Only PENDING requests can be approved or rejected
- Approve/Reject requires MODERATOR, ADMIN, or SUPER_ADMIN role

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/leave/`
