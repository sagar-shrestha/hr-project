---
name: nepali-domain
description: >
  Nepali-specific HRMS domain knowledge — Labour Act 2074 compliance, SSF, 
  multi-slab tax, festival bonus, Bikram Sambat calendar, and Nepali market 
  patterns. Activate when the task involves employee management with Nepali 
  fields, payroll with SSF/tax/bonus, leave with Labour Act 2074 rules, 
  attendance with overtime/shifts, Bikram Sambat dates, bank exports (Nabil, 
  Global IME), or any Nepali compliance requirement.
---

# Nepali Domain — Code Generation Patterns & References

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

## Reference Documents

- **Implementation Plan**: See `.opencode/skills/HR-REQUIREMENT-PLAN.md` for the phased plan covering Bikram Sambat utilities, Employee module, Payroll refactor, Leave refactor, Attendance, and Banking.
- **Compliance Rules**: See `.opencode/rules/AGENTS.md` (Nepali Market Context section) for the always-on compliance requirements.
- **Module Details**: See `.opencode/rules/AGENTS.md` (HRMS Domain Rules section) for entity lists per module.

## Common Sample Query Prompts

- "Generate Employee entity with Nepali-specific fields"
- "Create payroll calculation service for SSF and tax"
- "Generate leave management API with Nepali leave rules"
- "Create Flyway migration for attendance with B.S. dates"
- "Generate overtime calculation service as per Labour Act"
- "Create bank export service for Nabil and Global IME formats"
