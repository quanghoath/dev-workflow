---
name: init
description: Set up a repository for dev-workflow (step P0) - detect the FE/BE/FULLSTACK profile, create docs/workflow-config.md with verified build/test commands, set up Playwright and PR tooling, add the workflow note to CLAUDE.md, add .claude/settings.json so teammates get the plugin automatically, and choose or create the status dashboard. Use when the user says "init dev-workflow", "set up the workflow for this project", or when dev-workflow:run finds no docs/workflow-config.md. / Thiết lập dự án theo dev-workflow.
---

# dev-workflow · P0 Project setup

Reference (read when you need details):
- Project profiles and test tools per stack: `${CLAUDE_PLUGIN_ROOT}/reference/01-project-profiles.md`
- Dashboard: `${CLAUDE_PLUGIN_ROOT}/reference/03-dashboard.md`

Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`; when the user writes in Vietnamese, use `${CLAUDE_PLUGIN_ROOT}/templates/vi/`.

## Steps

Create one todo per step.

1. **Read the repo:** `CLAUDE.md`, `README`, manifests (`package.json`, `*.csproj`, `go.mod`, `pyproject.toml`…), existing test folders, `.mcp.json`.
2. **Detect the profile** FE / BE / FULLSTACK using the table in `01-project-profiles.md`. If unsure, ask the user one multiple-choice question.
3. **Create `docs/workflow-config.md`** from the `workflow-config.md` template. Fill in the repo's real commands; leave no example values.
4. **Try every command** `*_build`, `*_unit_test`, `*_lint` (and start `*_run`, then call `be_health` / open `fe_url` when the environment allows). Keep the commands that work. For broken or missing ones write `none — <reason>`. Do not change the repo's code in this step.
5. **Check tools:**
   - The **superpowers** plugin (`superpowers:brainstorming`, `superpowers:writing-plans`…) is required. If missing, tell the user: `/plugin install superpowers@claude-plugins-official` (or `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers@superpowers-marketplace`).
   - FE profiles: Chrome DevTools MCP is available (`mcp__chrome-devtools__*` tools). If not, propose adding to `.mcp.json`:
     `{"mcpServers":{"chrome-devtools":{"command":"npx","args":["-y","chrome-devtools-mcp@latest"]}}}`
   - FE profiles: does the repo have Playwright (`playwright.config.*`)? If yes, set `e2e_framework: playwright` and its command. If not, ask whether to add it (`npm init playwright@latest`); if the user declines, set `e2e_framework: none`.
   - Pull requests at P6: GitHub remote with `gh` logged in (`gh auth status`) → `pr_tool: gh`; GitLab remote with `glab` → `pr_tool: glab`; otherwise `pr_tool: none` (Claude will hand over the PR text to paste).
   - P5 likely: `k6 version`. If missing, note how to install (`winget install k6` / `brew install k6`); do not install it yourself.
6. **Add the workflow note** from the `CLAUDE.snippet.md` template to the end of the repo's `CLAUDE.md` (create the file if needed). Skip if it is already there.
7. **Team setup**, so teammates get the plugin when they clone the repo:
   - No `.claude/settings.json`: create it from `${CLAUDE_PLUGIN_ROOT}/templates/claude-settings.json`.
   - Existing file: add only `extraKnownMarketplaces.dev-workflow` and `enabledPlugins["dev-workflow@dev-workflow"]`; keep every other key (permissions, hooks…).
   - Never edit `.claude/settings.local.json` (personal, not committed).
   - If `.gitignore` ignores `.claude/`, tell the user this file must be committed.
8. **Dashboard:**
   - `dashboard_url` already set (repo initialized before): use it, do not ask again.
   - Not set: ask the user one question with three options: **use an existing dashboard** (paste link) / **create a new one** / **none**. Follow "Choose or create a dashboard" in `03-dashboard.md` and save the result in `dashboard_url`.
   - Not `none`: with the `ArtifactData` tool, `set` the document `projects/<project>` (`name`, `profile`, `repo`, `stack`, `updatedAt`). If permission is denied, tell the user this account needs **Editor** access from the dashboard owner. Do not block the other steps on this.
9. **Report:** chosen profile, which commands work or not, files created or changed, what the user must do (install k6, share access…). Ask before committing.
