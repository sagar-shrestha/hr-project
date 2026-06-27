---
trigger: always_on
---

# HRMS Nepal — Domain Requirements & Compliance

## Nepali Market Context

This project targets the Nepali market. All generated code must comply with:

1. Labour Act, 2074 (2017)
2. Contribution-based Social Security Act, 2074
3. Nepali tax laws and IRD guidelines
4. Bikram Sambat calendar support

## Key Domain Considerations

- **Dual calendar support** — B.S. and A.D. dates throughout the system
- **SSF contributions** — 31% total (20% employer + 11% employee)
- **Multi-slab income tax** — 1%, 10%, 20%, 30%, 36% brackets
- **Festival bonus** — 1 month's salary, auto-triggered for Dashain
- **Biometric integration** — patterns for device integration
- **Nepali Unicode** — `NVARCHAR` columns for Nepali text fields
- **Local bank export** — Nabil and Global IME format support

## Module Breakdown

### employee_management

Centralized employee data with:
- Citizenship and PAN number storage (PAN encrypted at rest)
- Document management for legal documents
- Emergency contacts with Nepali phone formats
- Dual-language names (English + Nepali)

Entities: `Employee`, `Address`, `Document`, `EmergencyContact`, `EmploymentHistory`

### payroll

Nepali-specific payroll processing:
- SSF integration (Social Security Fund)
- Income tax slab calculation
- Festival bonus automation (Dashain)
- CIT, PF deductions
- E-TDS reporting

Entities: `Payroll`, `SalaryStructure`, `TaxSlab`, `SSFContribution`, `Deduction`, `Bonus`

### leave_attendance

Leave accrual per Labour Act 2074:
- Maternity leave: 98 days (60 fully paid)
- Paternity leave: 15 days fully paid
- Home leave: 1 day per 20 worked days
- Sick leave: 15 days (half-paid)
- Bereavement leave: 13 days

Entities: `Leave`, `LeaveType`, `LeaveBalance`, `Attendance`, `Holiday`

### time_attendance

- Biometric device integration
- Overtime: 1.5x after 8 hours/day or 48 hours/week
- Shift management
- Night shift allowances

Entities: `Shift`, `TimeLog`, `OvertimeRecord`, `BiometricLog`, `ShiftAllowance`

## Compliance Rules

- SSF must be exactly 31% (20% employer + 11% employee)
- Festival bonus must be exactly 1 month's salary
- Maternity leave: 98 days (60 fully paid)
- Paternity leave: 15 days fully paid
- Overtime: 1.5x for >8 hours/day or >48 hours/week
- Home leave: 1 day per 20 working days
- All monetary calculations must use `BigDecimal`
- PAN numbers must be encrypted at rest
- Audit trails mandatory for payroll changes

## Code Generation Patterns

### Entity pattern

All entities should extend `AuditableEntity` from `com.sagar.hr.util`. Include a `nameNepali` field for Nepali text where applicable:

```java
@Column(columnDefinition = "NVARCHAR(255)")
private String nameNepali;
```

### Monetary calculations

Always use `BigDecimal` for salary, tax, SSF, and any monetary fields.

### Date handling

Store dates in both A.D. (`LocalDate`) and B.S. (string `YYYY-MM-DD` or dedicated type) where calendar display matters.

### Banking exports

Support Nabil Bank and Global IME Bank export formats for salary disbursement.

## Flyway Note

All schema changes including B.S. date fields, Nepali text columns, and compliance-related tables must go through Flyway migrations (e.g., `V4__add_employee_nepali_fields.sql`).

## Sample Queries for Reference

- "Generate Employee entity with Nepali-specific fields"
- "Create payroll calculation service for SSF and tax"
- "Generate leave management API with Nepali leave rules"
- "Create Flyway migration for attendance with B.S. dates"
- "Generate overtime calculation service as per Labour Act"
- "Create bank export service for Nabil and Global IME formats"
