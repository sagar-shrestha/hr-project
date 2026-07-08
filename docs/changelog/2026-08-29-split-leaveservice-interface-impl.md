# 2026-08-29 — Split LeaveRequestService into interface + impl

## What was done

- Split `LeaveRequestService` into an interface + `LeaveRequestServiceImpl` (mirrors the Employee and Department modules).
- All existing business logic (accrual rules, apply/approve/reject, balance, initialization) lives in the impl with `@Override` on each public method.

## Files touched

- `backend/.../leave/service/LeaveRequestService.java` — now an interface (7 method signatures)
- `backend/.../leave/service/LeaveRequestServiceImpl.java` — new `@Service` implementation

## Rationale

- Program to interfaces, consistent with the employee and department service splits.
- The controller already injected `LeaveRequestService` by interface type, so no controller change was required — Spring resolves the single `LeaveRequestServiceImpl` bean.

## Verification

- `mvn -q -DskipTests package` builds clean.
- App boots; `POST /api/v1/leaves/apply` returns 201 with user resolved from the token (PENDING). Test row cleaned up.
