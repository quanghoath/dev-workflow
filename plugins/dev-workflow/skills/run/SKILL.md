---
name: run
description: Take a feature or non-trivial bug fix through the dev-workflow P1–P6 pipeline - spec with acceptance criteria and risks, plan + test plan, TDD build, integration testing (Chrome DevTools MCP for UI, API end-to-end, recorded as Playwright tests), hardening (race conditions, load, performance), final report and pull request - with review gates and status updates. Offers a quick mode for small fixes. Use when the user asks to build or change a feature "with dev-workflow", or when the repo has docs/workflow-config.md. / Chạy tính năng qua quy trình P1–P6.
---

# dev-workflow · Run a feature through P1–P6

Read before starting:
- `${CLAUDE_PLUGIN_ROOT}/reference/02-workflow.md`: every step, the review gates, the feedback loop, when to stop.
- The repo's `docs/workflow-config.md`. If it does not exist, run the `dev-workflow:init` skill first.

Read when you reach the step:
- `${CLAUDE_PLUGIN_ROOT}/reference/04-testing-guide.md`: P3–P6.
- `${CLAUDE_PLUGIN_ROOT}/reference/03-dashboard.md`: every status update.
- `${CLAUDE_PLUGIN_ROOT}/reference/01-project-profiles.md`: test tools and default thresholds.
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/` (`status.json`, `spec-addendum.md`, `TEST-PLAN.md`, `BUG.md`, `REPORT.md` with a "Quick report" section, `PR-BODY.md`). When the user writes in Vietnamese, use `${CLAUDE_PLUGIN_ROOT}/templates/vi/` instead.

## Choose a mode before P1

- **Quick (`quick`)** only when all 4 conditions in `02-workflow.md` hold (about 3 code files or fewer, no schema or API contract change, no race/load/security risk, the user agrees). Offer quick mode with one question when the task looks small; if the user asks for "quick", still check the 4 conditions.
- Otherwise **full (`full`)**.
- Quick mode: short spec + plan in chat (goal, 1–3 ACs, files to change, how to verify) → one approval → TDD → P4 for the affected ACs → "Quick report" section of `REPORT.md`. If hidden complexity appears, stop, tell the user, and switch to full mode.

## Full flow

| Step | superpowers skill | Output | Gate |
|---|---|---|---|
| P1 Spec | `brainstorming` | spec + sections from `spec-addendum.md` | ◆ reviewer |
| P2 Plan | `writing-plans` | plan (tasks `[BE]`/`[FE]`/`[CONTRACT]`) + `runs/<slug>/TEST-PLAN.md` | ◆ reviewer |
| P3 Build | `subagent-driven-development` or `executing-plans`, with `test-driven-development` | code + green unit tests | — |
| P4 Integration | (Chrome DevTools MCP / API e2e; passing UI scenarios recorded as Playwright tests) | scenario results + `evidence/` + `e2e/<slug>.spec.ts` | failure → feedback loop |
| P5 Hardening | — | race, load, performance numbers | failure → feedback loop |
| P6 Report | `verification-before-completion`, `requesting-code-review`, `finishing-a-development-branch` | `REPORT.md` + PR/MR from `PR-BODY.md` | ◆ reviewer |

Feedback loop: `BUG-NNN.md` → `systematic-debugging` → reproducing test → fix → rerun. **At most 3 rounds per bug**, then `blocked` and stop.

## Rules

0. Check that the `superpowers:brainstorming` skill exists. If not, stop and tell the user how to install it: `/plugin install superpowers@claude-plugins-official` (or `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers@superpowers-marketplace`).
1. Create todos for the chosen mode's steps right away. For a feature already in progress, read `docs/superpowers/runs/<slug>/status.json` and resume from the first unfinished step.
2. Never pass a ◆ gate without the user's explicit approval of that exact document.
3. Write the test scenarios (TEST-PLAN) in P2, before code.
4. Never report `pass` without seeing real output.
5. Never run P4/P5 against an environment listed as `forbidden` in the config (prod by default).
6. **Update status** on every step change, gate, bug opened or closed, and stop: edit `runs/<slug>/status.json` first (valid JSON, no comments), then sync to the dashboard (`url` = `dashboard_url` in the config) as described in `03-dashboard.md`. With `dashboard_url: none`, skip all dashboard steps. If it is missing or empty, ask the user once (paste a link / create one / none) and save the answer in the config. If a dashboard write fails, say so once and keep working; never stop work because of the dashboard.
7. FULLSTACK order: `[CONTRACT]` → `[BE]` → API e2e passes → `[FE]`.
8. Talk to the user and write specs, plans and reports in the user's language.
