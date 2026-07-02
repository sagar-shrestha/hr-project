# 2026-07-02 — OpenCode Configuration & Workflow Demo

## What was done

- Added `nameNepali` NVARCHAR field to Department entity
- Created V12 migration for departments table
- Updated feature doc, database doc, and created session log
- Restructured opencode config: new `nepali-domain` skill, agent memory auto-load, deduplicated HR-REQUIREMENT.md

## Files touched

- `backend/src/main/java/com/sagar/hr/department/model/Department.java` — added `nameNepali` field
- `backend/src/main/resources/db/migration/V12__Add_Name_Nepali_To_Departments.sql` — new migration
- `docs/database/Readme.md` — added departments table + V12 migration
- `docs/features/departments/Readme.md` — noted bilingual name support
- `.opencode/rules/AGENTS.md` — added agent memory auto-load section
- `.opencode/skills/nepali-domain/SKILL.md` — new skill created
- `.opencode/skills/HR-REQUIREMENT.md` — trimmed to index-only
- `.opencode/skills/skills-registry.json` — added Nepali Domain entry

## Rationale

Demonstrated the full opencode workflow: rules auto-load → agent memory read → skill activation → code change → feature-documenter auto-docs.
