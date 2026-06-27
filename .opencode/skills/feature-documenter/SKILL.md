---
name: feature-documenter
description: >
  Automatically document all development work — feature implementations, 
  code changes, architecture decisions, API modifications, database schema 
  changes, and session activity. This skill MUST activate whenever the user 
  makes any code changes, adds features, modifies existing functionality, 
  configures infrastructure, refactors code, or completes any development 
  task. Trigger for ANY codebase change regardless of size to ensure 
  comprehensive, up-to-date documentation is always maintained alongside 
  the code.
---

# Feature Documenter

Document everything the AI does during development. After completing any task — implementing a feature, fixing a bug, refactoring, adding a migration, changing configuration — create or update the appropriate documentation under `docs/`.

## Documentation Tree

```
docs/
├── features/(feature-name)/Readme.md   — feature overview
├── architecture/Readme.md              — system architecture
├── api/Readme.md                       — REST API endpoints
├── database/Readme.md                  — schema & migrations
├── decisions/NNNN-title.md             — ADRs
└── changelog/YYYY-MM-DD-title.md       — session log
```

## When to Create/Update Each Doc

| Change type | Doc to touch |
|---|---|
| New feature (new module, service, entity, component) | Create `docs/features/(feature-name)/Readme.md`, update `docs/architecture/Readme.md` if module structure changes |
| Existing feature modified (new endpoints, refactored logic) | Update `docs/features/(feature-name)/Readme.md` |
| REST endpoints added/changed (new controller methods, route changes) | Add/update entries in `docs/api/Readme.md` |
| Database migration added (new Flyway migration file) | Update `docs/database/Readme.md` — list the table/column changes |
| Architecture decision made (pattern choice, library selection, structural change) | Create `docs/decisions/NNNN-title.md` (ADR format) |
| Session ends or a significant task completes | Create `docs/changelog/YYYY-MM-DD-title.md` |
| Configuration changes (Docker, deployment, CI/CD) | Note in `docs/changelog/` or update `docs/architecture/Readme.md` |
| Bug fix, minor refactor, or trivial change | Update `docs/changelog/` only — skip feature/API/database docs unless the change is material |

If multiple change types happen in one session, create ALL applicable docs (e.g., a new feature with a migration and API endpoints means creating feature doc + updating api docs + updating database docs + changelog).

## Documentation Principles

1. **Generalize** — document core features, purpose, boundaries, and interfaces. Do NOT dump code, list every method, or include implementation details that will change. The doc should answer *what* and *why*, not *how*.

2. **Be concise** — aim for 50-200 lines per doc. A reader should grasp the feature in 2 minutes.

3. **Stay current** — update docs when the corresponding code changes. Stale docs are worse than no docs.

4. **No noise** — skip trivial changes (variable rename, comment fix, one-line refactor). Use judgment.

## Feature Doc Template (`docs/features/(feature-name)/Readme.md`)

```markdown
# (Feature Name)

One-paragraph summary: what this feature does and why it exists.

## Responsibilities

- Core responsibility 1
- Core responsibility 2

## Key Components

- **ComponentName** — what it does (file path)
- **ComponentName** — what it does (file path)

## API Surface

List only the main operations — not every endpoint.

- `POST /api/v1/...` — description
- `GET /api/v1/...` — description

## Dependencies

- What other modules/features this depends on
- What external services it integrates with

## Domain Rules

Any business rules specific to this feature (Nepali compliance, calculations, validation).

## Where It Lives

- **Backend**: `backend/src/main/java/com/sagar/hr/(module)/`
- **Frontend**: `frontend/src/app/pages/(module)/`
```

## API Doc Template (`docs/api/Readme.md`)

Organize by domain group:

```markdown
# API Reference

## (Domain Group)

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /api/v1/... | ... | Required |
| GET | /api/v1/... | ... | Required |
```

Keep it as a table — append new rows, don't rewrite the whole file every time. Group by domain.

## Database Doc Template (`docs/database/Readme.md`)

```markdown
# Database Schema

## (Table Name)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | ... |
| ... | ... | ... | ... |

## Migrations

| Version | File | Description |
|---|---|---|
| V1 | V1__Initial_Schema.sql | Initial schema |
| V4 | V4__Add_Employee_Nepali_Fields.sql | Added Nepali fields |
```

List tables grouped by domain. Append new migrations as they're added.

## Architecture Doc Template (`docs/architecture/Readme.md`)

```markdown
# Architecture

## Overview

High-level architecture description.

## Module Structure

- Feature A — summary
- Feature B — summary

## Key Patterns

- Pattern 1: why and where used
- Pattern 2: why and where used

## Technology Stack

- Backend: Java 17, Spring Boot 3.2.x
- Frontend: Angular 21, Tailwind CSS
- Database: PostgreSQL
```

Update when new technologies are introduced or module structure changes significantly.

## ADR Template (`docs/decisions/NNNN-title.md`)

```markdown
# NNNN — Title

**Status**: [Accepted | Proposed | Deprecated]

**Date**: YYYY-MM-DD

## Context

What prompted this decision?

## Decision

What was decided.

## Consequences

- Positive: ...
- Negative: ...
```

Number sequentially from the highest existing number in `docs/decisions/` (or `.opencode/skills/decisions/`).

## Changelog Template (`docs/changelog/YYYY-MM-DD-title.md`)

```markdown
# YYYY-MM-DD — Title

## What was done

- Bullet list of changes

## Files touched

- `path/to/file.java` — what changed
- `path/to/file.ts` — what changed

## Rationale

Brief explanation of why these changes were made.
```

## Anti-Patterns (What NOT to Do)

- **Don't paste full source files** into docs. Reference file paths, don't duplicate code.
- **Don't document every commit-level change**. Group related changes. One changelog entry per task/session.
- **Don't over-document trivial fixes**. A one-line bug fix goes in the changelog only.
- **Don't let docs go stale**. If you modify a feature, update its doc in the same session.
- **Don't write docs that will immediately need rewriting**. Keep descriptions high-level enough that minor refactors don't invalidate them.
- **Don't nest parentheses in directory names**. Use `docs/features/payroll/` not `docs/features/(payroll)/`.
