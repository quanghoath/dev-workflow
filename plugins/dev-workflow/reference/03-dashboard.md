# 03 · Status dashboard

The dashboard is a page on claude.ai. The page only displays data; Claude writes the data through the `ArtifactData` tool. One dashboard can serve many projects: each team usually shares one page.

- **URL:** taken from `dashboard_url` in the project's `docs/workflow-config.md`. The plugin has no default URL.
  - `dashboard_url: none` → skip every dashboard update step; the workflow still runs in full.
  - Missing or empty → run `dev-workflow:init` to choose one (see "Choose or create a dashboard").
- **Permissions:** everyone it is shared with can read. Only **Owner/Editor** can write (rule `write: admin`). The claude.ai account on any machine that needs to write status must be shared with **Editor** access; Viewer and Contributor can only view. Do not turn on the public link: people who open it via the link can only view, and when the link is on, Editors outside the organization lose write access.
- **Page source:** `${CLAUDE_PLUGIN_ROOT}/dashboard/index.html`.

## Choose or create a dashboard (in P0)

Ask the user one question with three options:

1. **Use an existing dashboard:** the user pastes a `https://claude.ai/artifact/...` link. Check it with `ArtifactData list` on the `projects` collection (if it reads, the link is correct). If the later write to `projects/<project>` is rejected, tell the user they need to request Editor access from the dashboard owner.
2. **Create a new dashboard** (owned by the current claude.ai account):
   1. Copy `${CLAUDE_PLUGIN_ROOT}/dashboard/index.html` into the session's scratchpad directory (the Artifact tool only publishes files in the working directory or the scratchpad).
   2. Publish with the `Artifact` tool: `file_path` = the copy, `icon: "kanban"`, `description: "Feature status across the dev-workflow P1–P6 steps"`, `capabilities: {"db": {"rules": [{"path": "", "read": "view", "write": "admin"}]}}`.
   3. Write the returned URL to `dashboard_url`. Remind the user to share the page with the team as Editor (do not turn on the public link).
3. **No dashboard:** write `dashboard_url: none`.

If the `Artifact` / `ArtifactData` tools are not available (for example not signed in to claude.ai), only option 3 remains, with a note to turn it on later.

**Update the UI of an existing dashboard:** republish the new `index.html` with the `Artifact` tool with `url` = `dashboard_url` (read the page first, as the tool requires). Do **not** pass `capabilities`, so the existing rules are kept. Data is preserved across publishes. Do not publish it as a new page.

## Data

Two collections:

### `projects` — 1 document per project

`doc_id` = `project` in `workflow-config.md` (kebab-case, for example `shop-api`).

```json
{
  "name": "Shop API",
  "profile": "BE",               // FE | BE | FULLSTACK
  "repo": "gitlab.com/acme/shop-api",
  "stack": "ASP.NET Core 8 + SQL Server",
  "updatedAt": "2026-10-12T09:30:00+07:00"
}
```

### `features` — 1 document per feature

`doc_id` = `<project>--<slug>` (for example `shop-api--place-order`).

```json
{
  "project": "shop-api",
  "slug": "place-order",
  "mode": "full",                // full | quick (see 02-workflow.md)
  "title": "Place order and decrement stock",
  "phase": "P3",                 // P1..P6
  "status": "in_progress",       // see the status table
  "summary": "Working on task 4/9: OrderService decrements stock",   // 1 line, readable at a glance
  "specPath": "docs/superpowers/specs/2026-10-12-place-order-design.md",
  "planPath": "docs/superpowers/plans/2026-10-12-place-order.md",
  "branch": "feat/place-order",
  "gates": {                     // when the reviewer approved
    "spec": "2026-10-12T10:00:00+07:00",
    "plan": null,
    "report": null
  },
  "tasks": [
    { "id": "T1", "title": "orders + order_items tables", "tag": "BE", "status": "done" }
  ],
  "tests": {                     // updated after each run
    "unit":  { "pass": 42, "fail": 0 },
    "p4":    { "pass": 6, "fail": 1, "warn": 1, "total": 8 },
    "p5":    [ { "id": "R-1", "name": "20 requests buying a product with 1 left in stock", "result": "pass", "metric": "1/20 succeeded" } ]
  },
  "bugs": [
    { "id": "BUG-001", "title": "Double-submit creates 2 orders", "status": "open", "loop": 1 }
  ],
  "loops": 1,                    // number of returns to P3 from P4/P5
  "blockedReason": null,
  "report": null,                // P6: 3–5 line summary
  "log": [                       // activity log, keep at most the 50 newest entries
    { "at": "2026-10-12T11:20:00+07:00", "phase": "P4", "kind": "bug", "text": "BUG-001 opened: double-submit" }
  ],
  "updatedAt": "2026-10-12T11:20:00+07:00"
}
```

`log[].kind`: `phase` · `gate` · `task` · `test` · `bug` · `blocked` · `note`.

The log lives inside the feature document, not in a separate collection: the data store is limited to 25,000 documents per artifact, so do not create one document per event.

## Status (`status`)

| status | Meaning | Dashboard shows |
|---|---|---|
| `todo` | created, not started | gray |
| `in_progress` | agent is working | blue |
| `waiting_review` | waiting for the reviewer at a review gate ◆ | yellow — **needs you** |
| `blocked` | BUG used up 3 loops, missing environment, or `needs_redesign` | red — **needs you** |
| `done` | passed P6 | green |

Task status: `todo` · `in_progress` · `done`. Bug: `open` · `fixed` · `blocked` · `needs_redesign` · `accepted` (warn accepted). P5 result: `pass` · `fail` · `warn`.

## When to update

| Event | Write |
|---|---|
| New step starts | `phase`, `status`, `summary` + log `phase` |
| Review gate ◆ reached | `status=waiting_review` + log `gate` |
| Reviewer approves | `gates.<x>` + log `gate` |
| Task done | `tasks`, `summary` |
| Test run done | `tests.*` + log `test` |
| Bug opened/closed | `bugs`, `loops` + log `bug` |
| Stop | `status=blocked`, `blockedReason` + log `blocked` |
| P6 done | `status=done`, `report`, `gates.report` |

Minimum: on every step change and every stop. Do not update for each small command.

## How Claude writes

Use the `ArtifactData` tool with `url` = `dashboard_url`.

The data source is the file `docs/superpowers/runs/<slug>/status.json` in the repo (same structure as the document above). Always update this file first, then sync the whole file to the dashboard:

1. **New feature:** `set` with `collection: "features"`, `doc_id: "<project>--<slug>"`, `file_path` = the `status.json` path (it does not exist yet, so no `if_version` is needed).
2. **Update:** `get` that document to read its `version`, then `set` with `file_path` = `status.json` and `if_version` = the version just read.
   - For `log`: add the new entry to `status.json`, then trim it to 50 entries before syncing.
3. Rejected because the version changed: `get` again, then write again. Never overwrite blindly.
4. Rejected for permissions (this always happens for Editors outside the claude.ai organization): tell the user once per session, then continue the work. `status.json` stays complete.
5. `projects/<project>`: created in P0 (`dev-workflow:init`), updated when the profile or stack changes.

Put only summaries and numbers on the dashboard. Details (spec, bugs, evidence) live in the repo; the dashboard only stores paths. **Never write secrets, tokens, connection strings, or real customer data.**
