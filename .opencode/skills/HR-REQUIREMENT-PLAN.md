# HRMS Nepal — Implementation Plan

Based on `HR-REQUIREMENT.md` and current project state.

## Project State Summary

**Already implemented:**
- Auth/Security (JWT, roles, permissions, users)
- Leave module (LeaveRequest, LeaveBalance, LeaveType enum — with controller, service, DTOs)
- Payroll module (SalaryStructure, strategy/decorator pattern with caching — generic tax calc)
- Department module (model, repository, service — no controller/DTOs yet)
- Reporting module (Attendance entity, attendance summary report)
- Util (GlobalExceptionHandler, GlobalApiResponse, custom exceptions)
- Flyway migrations V1-V8 (V5-V8 pending application)

**Needs Nepali-specific work:**
- Bikram Sambat calendar support
- Employee module (with citizenship, PAN, nameNepali, dual-language)
- Payroll: SSF (31%), multi-slab tax (1/10/20/30/36%), festival bonus
- Leave: Nepali Labour Act 2074 rules (home leave, bereavement, etc.)
- Attendance: Overtime (1.5x), shift management, biometric integration
- Bank exports (Nabil, Global IME)

## Phase 1 — Bikram Sambat & Core Utilities
Create `com.sagar.hr.util` enhancements:
- `BSDate` value object or embeddable
- `BikramSambatConverter` service (BS ↔ AD)
- Nepali date formatting utility

## Phase 2 — Employee Module
Full CRUD module under `com.sagar.hr.employee`:
- Employee entity with: `nameNepali`, `citizenshipNumber`, `panNumber` (encrypted), dual-language names
- Address, Document, EmergencyContact, EmploymentHistory entities
- Controller/Service/Repository/DTO/Mapper
- Flyway: V9__Create_Employee_Tables.sql

## Phase 3 — Payroll Refactor (Nepali)
- SSF calculation service (20% employer + 11% employee)
- Multi-slab income tax (1%, 10%, 20%, 30%, 36%)
- Festival bonus automation (Dashain — 1 month salary)
- CIT, PF deductions
- E-TDS reporting

## Phase 4 — Leave Refactor (Nepali)
- Home leave (1 day per 20 worked days)
- Sick leave (15 days, half-paid)
- Bereavement leave (13 days)
- Update LeaveType enum
- Labour Act 2074 compliance validation

## Phase 5 — Attendance & Time Tracking
- Shift management, night shift allowances
- Biometric device integration pattern
- Overtime calculation (1.5x after 8h/day or 48h/week)
- TimeLog/BiometricLog entities and services

## Phase 6 — Organization & Department Enhancement
- DepartmentController + DTOs
- Designation entity/management
- Organization hierarchy
- Employee-department assignments

## Phase 7 — Banking & Reporting
- Nabil Bank export format
- Global IME Bank export format
- Compliance reports (SSF, tax, E-TDS)
- Dashboard APIs
- Notification module
