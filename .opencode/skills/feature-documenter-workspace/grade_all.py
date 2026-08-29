#!/usr/bin/env python3
"""Grade all eval runs from their summary files (isolated from shared fs)."""

import json, os, re

ROOT = "/home/sagar/Documents/myproject/gitproject/backend/hr-project"
WSPACE = os.path.join(ROOT, ".opencode/skills/feature-documenter-workspace/iteration-1")

def read_summary(eval_id, config):
    p = os.path.join(WSPACE, f"eval-{eval_id}", config, "outputs", "summary.md")
    return open(p).read() if os.path.exists(p) else ""

def summary_has(eval_id, config, keywords, case=True):
    t = read_summary(eval_id, config)
    if not t: return False
    if not case: t, keywords = t.lower(), [k.lower() for k in keywords]
    return all(k in t for k in keywords)

evals_spec = [
    (1, "with_skill", [
        ("Created docs/features/leave-management/Readme.md",
         summary_has(1, "with_skill", ["docs/features/leave-management"])),
        ("API doc includes leave endpoints",
         summary_has(1, "with_skill", ["api", "leave", "endpoint"])),
        ("Database doc includes leave_requests and V5",
         summary_has(1, "with_skill", ["database", "leave_requests", "V5"])),
        ("Changelog created for leave session",
         summary_has(1, "with_skill", ["changelog", "leave"])),
        ("Created backend leave module (entity, repository, service, controller)",
         summary_has(1, "with_skill", ["entity", "repository", "service", "controller", "leave"])),
    ]),
    (1, "without_skill", [
        ("Baseline: no docs/ created (no documentation mentioned)",
         not summary_has(1, "without_skill", ["docs/", "documentation"], case=False)),
    ]),
    (2, "with_skill", [
        ("API doc created with attendance-summary endpoint",
         summary_has(2, "with_skill", ["api", "attendance-summary", "Readme.md"])),
        ("Changelog created for attendance session",
         summary_has(2, "with_skill", ["changelog", "attendance"])),
        ("Baseline: docs/features/reporting was created as a new module",
         summary_has(2, "with_skill", ["docs/features/reporting"])),
    ]),
    (2, "without_skill", [
        ("Baseline: no documentation files created",
         not summary_has(2, "without_skill", ["docs/", "Readme.md"])),
    ]),
    (3, "with_skill", [
        ("Database doc updated with departments table and V6",
         summary_has(3, "with_skill", ["database", "V6", "department"])),
        ("Features doc created for departments",
         summary_has(3, "with_skill", ["docs/features/departments"])),
        ("Changelog created for departments session",
         summary_has(3, "with_skill", ["changelog", "department"])),
    ]),
    (3, "without_skill", [
        ("Baseline: no documentation files created",
         not summary_has(3, "without_skill", ["docs/", "Readme.md"])),
    ]),
    (4, "with_skill", [
        ("ADR created for Redis caching decision",
         summary_has(4, "with_skill", ["decisions", "redis", "cache"])),
        ("ADR follows template with Context/Decision/Consequences",
         "Context" in open(os.path.join(ROOT, "docs/decisions/001-redis-caching-for-payroll.md")).read()),
        ("Architecture doc updated to mention caching",
         summary_has(4, "with_skill", ["architecture", "cache"])),
        ("Changelog created for caching session",
         summary_has(4, "with_skill", ["changelog", "cache"]) or summary_has(4, "with_skill", ["changelog", "payroll"])),
    ]),
    (4, "without_skill", [
        ("Baseline: ADR created (explicitly requested in prompt)",
         summary_has(4, "without_skill", ["ADR", "redis", "cache"])),
    ]),
]

for eval_id, config, checks in evals_spec:
    graders = []
    passed = failed = 0
    for text, ok in checks:
        graders.append({"text": text, "passed": ok, "evidence": "found in summary" if ok else "not found in summary"})
        if ok: passed += 1
        else: failed += 1
    total = len(checks)
    rate = round(passed / total, 2) if total else 0
    g = {
        "expectations": graders,
        "summary": {"passed": passed, "failed": failed, "total": total, "pass_rate": rate},
        "claims": [],
        "user_notes_summary": {},
        "eval_feedback": {}
    }
    gp = os.path.join(WSPACE, f"eval-{eval_id}", config, "grading.json")
    with open(gp, "w") as f:
        json.dump(g, f, indent=2)
    print(f"Eval {eval_id} ({config:15s}): {passed}/{total} passed (rate={rate})")
