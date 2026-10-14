# 02 · Workflow P0–P6

Each step has: a **goal**, a **skill**, an **output**, an **exit condition**, and a **dashboard update**. Do not leave a step until its exit condition is met. ◆ = needs a reviewer.

## Choose a mode: full or quick

Before P1, pick one of two modes and record it in `status.json` (`mode`):

| | **Full** (`full`, default) | **Quick** (`quick`) |
|---|---|---|
| Use for | new features, API/schema changes, race/load/security risk | small bug fixes, UI/text tweaks, small refactors |
| Conditions | — | **all 4:** changes ≤ about 3 code files · no DB schema or API contract change · no race/load/security risk · the user agrees to quick mode |
| Spec / plan | spec file + plan + TEST-PLAN | **in chat**: goal, 1–3 ACs, files to change, how to verify (one approval) |
| Build | full P3 | TDD: reproducing/specifying test → fix → build + unit tests green |
| Verification | P4 + P5 | P4 only, for the relevant ACs (FE: Chrome DevTools MCP; BE: call the API) |
| Report | full REPORT.md + acceptance test guide ◆ | the "Quick report" section in `REPORT.md` + a short acceptance test guide |

**One way only:** if quick mode uncovers hidden complexity (more files to change, touches schema/API, a race risk appears…), **stop, tell the user, and switch to full mode** from P1. Never switch back from full to quick.

Quick mode still creates `runs/<slug>/status.json` and `REPORT.md`, still updates the dashboard, and still limits each bug to 3 fix loops.

## Local state: `runs/<slug>/status.json`

Each feature has a file `docs/superpowers/runs/<slug>/status.json`, with the same structure as the `features` document in [03-dashboard.md](03-dashboard.md). This file is the **source of truth**; the dashboard is only a copy for viewing.

- On every step change, gate, bug opened/closed, or stop: update `status.json` **first**, commit it with the related change, and only then sync to the dashboard (if any).
- New session or another machine: read `status.json` to see where things stand (`/dev-workflow:status`). The dashboard is not needed.

---

## P0 · Project setup (once)

- **Goal:** the project has a profile and clear run commands, so the agent does not have to guess.
- **Do:**
  1. Detect the profile using [01-project-profiles.md](01-project-profiles.md).
  2. Create `docs/workflow-config.md` from the template; try each command (build, unit test, dev server) and record the commands that work.
  3. Paste `CLAUDE.snippet.md` into `CLAUDE.md`.
  4. Check that the `chrome-devtools` MCP is available (if the profile has FE); check `k6 version` (if there is load risk).
- **Exit when:** every command in the config has been tried successfully, or is explicitly marked as not available yet.
- **Dashboard:** pick an existing dashboard, create a new one, or `none`, then create the `projects/<project>` document (see [03-dashboard.md](03-dashboard.md)).

## P1 · Spec ◆

- **Skill:** `superpowers:brainstorming`.
- **Output:** `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`, ending with 2 required sections from `${CLAUDE_PLUGIN_ROOT}/templates/spec-addendum.md`:
  - **Acceptance criteria:** each criterion has an ID `AC-n` and is testable (has inputs and an expected result).
  - **Risks & hardening:** mark yes or no for each type: race condition, high load, FE performance, security/authorization, large data. Each risk marked "yes" must have an `R-n` scenario and a threshold.
  - FULLSTACK adds an **API contract** section.
- **Exit when:** the reviewer approves the spec.
- **State:** create `runs/<slug>/status.json` (`mode`, `phase=P1`); `status=waiting_review` while waiting for review; set `gates.spec` when approved.

## P2 · Plan + Test plan ◆

- **Skill:** `superpowers:writing-plans`.
- **Output:**
  - `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`. Each task has a `[BE]`, `[FE]` or `[CONTRACT]` tag, and states which AC it covers and which unit test proves it.
  - `docs/superpowers/runs/<slug>/TEST-PLAN.md` from the template: a P4 scenario for each `AC-n`, a P5 scenario for each `R-n`. Write it **before** coding.
- **Exit when:** each `AC-n` has at least 1 test scenario and each `R-n` has 1 P5 scenario; the reviewer approves and picks how to run (subagent or inline).
- **Dashboard:** record the `tasks` list (id, name, tag, `todo`); `gates.plan` when approved.

## P3 · Build

- **Skill:** `superpowers:subagent-driven-development` (or `executing-plans`), with `superpowers:test-driven-development` inside each task.
- **Each task:**
  1. Write a red unit test → code until green → refactor.
  2. Run the `build` + `unit_test` commands from the config; they must be green.
  3. Two-layer review (matches the spec, code quality) per SDD; fix any feedback within the task.
  4. Commit; update the dashboard task → `done`.
- **FULLSTACK order:** `[CONTRACT]` → all `[BE]` → run the TEST-PLAN API e2e → `[FE]`.
- **Exit when:** every task is `done`, and build and unit tests are green across the whole repo.

## P4 · Integration testing

- **Do:** run the P4 scenarios in TEST-PLAN following [04-testing-guide.md](04-testing-guide.md) (FE: Chrome DevTools MCP; BE: API e2e).
- **Result per scenario:** `pass` / `fail` / `warn` (functionally correct but not optimal: slow, console errors, broken layout on mobile…). Save evidence to `evidence/`.
- **`fail` or `warn`** → enter the feedback loop (below).
- **Record as e2e tests:** if `e2e_framework: playwright`, each UI scenario marked `smoke` or tied to a BUG is written as a Playwright test in `e2e_dir` (Step 3b in [04-testing-guide.md](04-testing-guide.md)).
- **Exit when:** every P4 scenario is `pass` (including the recorded e2e tests); a `warn` may stay only if the reviewer accepts it and it is noted in REPORT.

## P5 · Hardening

- **Run only** the risks marked "yes" in the spec. If there are none, write "P5: not applicable — reason" and go to P6.
- **Do:** the `R-n` scenarios following [04-testing-guide.md](04-testing-guide.md) (race, load, FE performance).
- **Threshold not met** → feedback loop. After the fix, rerun **all** of P4 (regression) before rerunning P5.
- **Exit when:** every `R-n` meets its threshold, with numbers saved in `evidence/`.

## P6 · Report ◆

- **Skill:** `superpowers:verification-before-completion` → `superpowers:requesting-code-review` → `superpowers:finishing-a-development-branch`.
- **Do:** rerun build + unit tests + e2e + P4 smoke scenarios. Fill in `REPORT.md` from the template.
- **Create the PR/MR** (when the reviewer chooses to open a PR in `finishing-a-development-branch`):
  1. Push the branch. Build the PR body from `${CLAUDE_PLUGIN_ROOT}/templates/PR-BODY.md`, taking numbers from `REPORT.md` and `status.json`.
  2. `pr_tool: gh` → `gh pr create --base <pr_base> --title "<title>" --body-file <file>`; `pr_tool: glab` → `glab mr create --target-branch <pr_base> --title "<title>" --description "$(cat <file>)"`.
  3. No CLI, or `pr_tool: none`: give the user the PR body (saved at `runs/<slug>/PR-BODY.md`) and a link to create the PR manually.
  4. Record the PR link in `status.json` (`prUrl`) and in REPORT.
- **Acceptance test guide** for BA/QA (unless `test_guide: none`): write `runs/<slug>/test-guide.json`, publish the guide page or write `TEST-GUIDE.md`, record `guideUrl`, and append the **Results** section to the spec (links to REPORT, guide, PR). See [05-acceptance-guide.md](05-acceptance-guide.md).
- **Exit when:** the reviewer reads REPORT and chooses how to merge/PR.
- **Dashboard:** `status=done`, attach the REPORT summary (ACs passed, bug count, loop count, P5 metrics).

---

## Feedback loop (P4/P5 → P3)

```
scenario fail/warn
   → create BUG-NNN.md (template ${CLAUDE_PLUGIN_ROOT}/templates/BUG.md): repro steps, expected, actual, evidence
   → superpowers:systematic-debugging: find the root cause BEFORE fixing
   → write a unit test that reproduces the bug (red) → fix (green)
   → rerun the failing scenario + related scenarios
   → BUG closed (fixed) or loop incremented
```

- **Limit of 3 loops per BUG.** If it still fails after loop 3, set `status=blocked`, stop, and report to the reviewer with the current hypothesis. Do not try a loop 4.
- A bug that needs a **design change** (wrong spec, missing lock, wrong data model) does not get patched. Mark it `needs_redesign`, stop, and go back to P1/P2 with the reviewer.
- Dashboard: add the bug to `bugs[]` and increment `loops` each time you return to P3.

## Valid stop states

The agent **must stop and wait for a human** in any of these cases:

- at a review gate ◆ (P1, P2, P6);
- a BUG has used up its 3 loops (`blocked`);
- `needs_redesign`;
- missing permissions, environment, or test data (for example no dev DB, no token);
- a test command would need to run on **production** — never run P5 on production without an explicit instruction.
