# 0001 — Leave Management Module

**Status**: Accepted

**Date**: 2026-06-27

## Context

The HRMS needs a leave management system for the Nepali market. The Nepal Labour Act, 2074 mandates specific leave entitlements (18 days annual, 12 sick, 98 maternity, 15 paternity) with distinct accrual rules. The module must integrate with existing user/security infrastructure and support an apply-approve-reject workflow.

## Decision

Enhanced the existing `com.sagar.hr.leave` package with:

- Year-based balance tracking in `leave_balances` table with `UNIQUE(user_id, leave_type, year)` constraint
- `approved_at` and `rejected_reason` columns on `leave_requests` for audit trail
- Custom `InsufficientLeaveBalanceException` wired into global exception handler
- Role-gated endpoints: apply requires any authenticated user, approve/reject requires MODERATOR+
- Balance deduction on approval (not on application) to match existing pattern
- `POST /{id}/approve` and `POST /{id}/reject` as dedicated endpoints (not PUT)

## Consequences

- Positive: Year-based uniqueness prevents duplicate balance entries across years
- Positive: Audit trail via `approved_at`/`rejected_reason` provides full approval history
- Positive: Nepali-specific rules are centralized in `LeaveRequestService.ACCRUAL_RULES` — easy to adjust
- Negative: Balance is deducted on approval, not on application; leaves in PENDING state do not reduce available balance, potentially allowing over-booking
- Negative: Maternity leave set to 98 days (per Nepal law) — significantly higher than the pre-existing incorrect value of 60
