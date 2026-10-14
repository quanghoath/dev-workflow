# Dev Workflow for Claude Code

**Spec-to-ship workflow plugin for Claude Code.** Works for frontend-only, backend-only or full-stack projects. Built on [superpowers](https://github.com/obra/superpowers).

[Tiếng Việt](README.vi.md)

Claude takes each feature through 6 steps. You approve the spec, the plan and the final report; Claude does the rest:

```
P1 Spec         acceptance criteria + risk list (race? load? perf?)        ◆ you approve
P2 Plan         tasks [BE]/[FE]/[CONTRACT] + TEST-PLAN written before code ◆ you approve
P3 Build        TDD per task → review → fix
P4 Integration  UI via Chrome DevTools MCP → saved as Playwright tests ─┐ bug → fix loop
P5 Hardening    race conditions · load (k6) · Lighthouse                ─┘ max 3 rounds/bug
P6 Report       verification + code review + REPORT.md + pull request     ◆ you approve
```

- **Quick mode** for small fixes: spec and plan in chat, still TDD and UI/API checks.
- **AI explores, Playwright keeps:** UI scenarios that pass in Chrome are written as Playwright tests, so CI catches regressions.
- **Pull request with evidence:** P6 opens a PR/MR whose description lists acceptance criteria, test numbers and fixed bugs.
- **Acceptance test guide for BA/QA:** every finished feature gets a step-by-step guide page (what was done, how to prepare, each check with Pass / Fail). Testers mark results on the page; Claude turns failures into bugs. The spec ends with links to the report, the guide and the PR.
- **Never lose your place:** status lives in `status.json` in your repo; `/dev-workflow:status` and a session-start reminder tell you what is waiting for you.
- Optional live dashboard on claude.ai.

See a full [example run](examples/README.md) · Try the [demo shop](demo/README.md).

⭐ If this helps you, star the repo so others can find it. Issues and ideas are welcome.

## Install

You need Claude Code and `git`.

### Terminal (CLI)

```
/plugin install superpowers@claude-plugins-official
/plugin marketplace add quanghoath/dev-workflow
/plugin install dev-workflow@dev-workflow
```

If superpowers is not found, use `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers@superpowers-marketplace`.

### VS Code extension (Manage plugins)

1. In the Claude Code panel, type `/plugins` to open **Manage plugins**.
2. **Marketplaces** tab → paste `quanghoath/dev-workflow` (or `https://github.com/quanghoath/dev-workflow.git`) and add it.
3. **Plugins** tab → search `dev-workflow` → **Install** → choose **Install for you** (all your projects) or **Install for this project**.
4. Install **superpowers** the same way if you do not have it (it is in the official marketplace, or add `obra/superpowers-marketplace`).

Changes apply to open sessions right away. To turn on auto-update, run `/plugin` in a terminal session → **Marketplaces** → `dev-workflow` → **Enable auto-update**.

## Use

1. In your project, run `/dev-workflow:init`. Claude detects FE/BE/full-stack, verifies build/test commands, offers Playwright, and asks about the dashboard.
2. Commit the files it creates. Teammates who clone the repo and trust the folder get the plugin automatically.
3. Build: *"build X with dev-workflow"* or `/dev-workflow:run <description>`. For small fixes Claude offers quick mode.
4. See progress or resume in a new session: `/dev-workflow:status`.

## Dashboard (optional)

- At init choose **create new** (a claude.ai page in your account), **paste an existing link**, or **none**.
- To let teammates' Claude write to it, share it with them as **Editor**. People outside your claude.ai organization currently cannot write even as Editor; use a shared claude.ai Team plan or one dashboard per person. Status is always kept in the repo either way.
- Do not enable public link sharing on the dashboard.

## Docs

| File | What it covers |
|---|---|
| [02-workflow.md](plugins/dev-workflow/reference/02-workflow.md) | P0–P6 in detail, quick mode, feedback loop, when Claude stops for you |
| [04-testing-guide.md](plugins/dev-workflow/reference/04-testing-guide.md) | Step-by-step testing: unit, API, UI, Playwright, race, load, performance |
| [01-project-profiles.md](plugins/dev-workflow/reference/01-project-profiles.md) | Test tools per stack and default thresholds |
| [03-dashboard.md](plugins/dev-workflow/reference/03-dashboard.md) | Status data and how Claude updates the dashboard |
| [05-acceptance-guide.md](plugins/dev-workflow/reference/05-acceptance-guide.md) | The test guide for BA/QA and how results come back |
| [templates/](plugins/dev-workflow/templates/) | Spec addendum, TEST-PLAN, BUG, REPORT, PR body, config |

Vietnamese versions: `reference/vi/`, `templates/vi/`, `examples/vi/`.

## Contributing

Edit files under `plugins/dev-workflow/`, bump `version` in `plugin.json`, open a pull request on [GitHub](https://github.com/quanghoath/dev-workflow). History: [CHANGELOG.md](CHANGELOG.md). License: [MIT](LICENSE).
