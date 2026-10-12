---
name: status
description: Show where every dev-workflow feature in this repo stands - mode, current step, tasks, tests, open bugs, blockers, pull request and the next action - read from docs/superpowers/runs/*/status.json, no dashboard needed. Use when the user asks for status, progress, "what's next", "đang làm tới đâu", wants to resume unfinished work, or opens a new session on a repo that uses dev-workflow. / Xem tiến độ các tính năng.
---

# dev-workflow · Status

Read only. Do not edit files or write to the dashboard. Answer in the user's language.

## Steps

1. Read `docs/workflow-config.md` (project name, `dashboard_url`). If it is missing, say the repo is not set up and suggest `/dev-workflow:init`.
2. List `docs/superpowers/runs/*/status.json`. For each, take `title`, `mode`, `phase`, `status`, `summary`, tasks done / total, `tests`, open bugs (`status` other than `fixed` and `accepted`), `blockedReason`, `prUrl`, `updatedAt`.
   - A `runs/<slug>/` folder without `status.json` (features started before v1.4): infer the step from the files present — spec only → P1; plan + `TEST-PLAN.md` → P2/P3 (count `- [x]` checkboxes in the plan); `TEST-PLAN.md` with results filled → P4/P5; `REPORT.md` → P6. Say that it is inferred.
3. If the user asks about one feature (slug or name), also read its plan, `TEST-PLAN.md` and `bugs/*.md`.
4. Answer briefly, things that need the user first:
   - **Needs you:** `waiting_review` (what is waiting for approval) and `blocked` (why).
   - **In progress:** `in_progress`, current step, tasks x/y, open bugs.
   - **Recently done:** `done` in the last 7 days, with the PR link if any.
   - For every unfinished feature, the **next step** and the command to continue, e.g. `/dev-workflow:run continue <slug>`.
   - Include the dashboard link when `dashboard_url` is not `none`.
5. No features: say so and suggest `/dev-workflow:run <description>`.
