# API Reference

## Department Management

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/departments | List all departments | Required |
| GET | /api/v1/departments/{id} | Get a department by id | Required |
| POST | /api/v1/departments | Create a department | Required |
| PUT | /api/v1/departments/{id} | Update a department | Required |
| DELETE | /api/v1/departments/{id} | Soft delete a department | MODERATOR+ |

## Leave Management

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /api/v1/leaves/apply | Apply for leave | Required |
| POST | /api/v1/leaves/{id}/approve | Approve a pending leave | MODERATOR+ |
| POST | /api/v1/leaves/{id}/reject | Reject a pending leave | MODERATOR+ |
| GET | /api/v1/leaves/my | List own leave requests | Required |
| GET | /api/v1/leaves/pending | List all pending leaves | MODERATOR+ |
| GET | /api/v1/leaves/balance | View own leave balance | Required |
| POST | /api/v1/leaves/initialize-balance | Initialize leave balances for the year | ADMIN+ |

## Audit Trail

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /api/v1/audit/{entityName}/{id} | Revision history for an entity instance | MODERATOR+ |
