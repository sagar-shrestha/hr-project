# API Reference

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
