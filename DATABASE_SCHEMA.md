# Database Schema Documentation

> **Status:** Initial Discovery Phase
> **Database:** PostgreSQL
> **Migration Tool:** Flyway (`flyway-core`, `flyway-database-postgresql`)

## Initial Domains
- **User / Authentication:** Users, Roles, Permissions
- **HR Domains (Expected):** Employee, Department, Designation, Attendance, Leave, Payroll

## Leave Module (V5)
### `leave_requests`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users.id | Employee who applied |
| leave_type | VARCHAR(20) | ANNUAL / SICK / MATERNITY / PATERNITY |
| status | VARCHAR(20) | PENDING / APPROVED / REJECTED |
| start_date | DATE | |
| end_date | DATE | Must be >= start_date |
| reason | TEXT | |
| total_days | INTEGER | Computed from date range |
| approved_by | BIGINT FK → users.id | Approver/Rejector |
| remarks | TEXT | Approval/Rejection remarks |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `leave_balances`
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users.id | |
| leave_type | VARCHAR(20) | Unique per user+type |
| total_days | DECIMAL(6,1) | Total allocated |
| used_days | DECIMAL(6,1) | Days used |

*Accrual rules: ANNUAL=18d, SICK=12d, MATERNITY=60d, PATERNITY=15d (Nepali market standards).*

*Detailed schema mapping will be updated here as domains are thoroughly analyzed or generated.*
