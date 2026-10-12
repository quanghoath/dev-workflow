# 04 · Step-by-step testing guide

Applies to P3 (unit), P4 (integration), P5 (race, load, performance). Exact commands come from `docs/workflow-config.md`. Scenarios come from `runs/<slug>/TEST-PLAN.md`. Evidence is saved to `runs/<slug>/evidence/`.

**General rules**

- Run only on the **local/dev/staging** environments listed in the config. Never run on production without an explicit instruction.
- Each scenario records its result `pass` / `fail` / `warn` in the "Result" column of TEST-PLAN, with the evidence path.
- Never conclude `pass` before seeing the real output (`verification-before-completion`).

---

## Step 1 · Unit tests (P3, all profiles)

1. Write the test for the behavior first, run it, and see it go **red** for the right reason.
2. Write the minimum code to go **green**. Refactor, keep it green.
3. Run everything: the `unit_test` command from the config, then the `build` command (and `lint` if present).
4. Record the pass/fail counts in the dashboard `tests.unit`.

Tests are required for: business logic, error branches (`4xx` or the project's business error codes), boundary values, and every bug from the feedback loop (a reproducing test).

## Step 2 · API e2e (P4, BE / FULLSTACK profiles)

1. Start the API with `be_run` from the config; wait until `be_health` returns OK.
2. Get a test token following the instructions in the config (never commit the token).
3. For each API scenario in TEST-PLAN: send the request (`.http`, `curl`, script) and check:
   - the HTTP code and the envelope (if the project wraps responses, for example `{ status, message, data }`);
   - the returned data matches the contract in the spec;
   - **the DB state after the call** (verification query written in TEST-PLAN) — this is the part most often skipped;
   - the error branches: missing field, wrong permission, expired token, non-existent id.
4. Save representative requests/responses to `evidence/api-<id>.md`.

## Step 3 · UI with Chrome DevTools MCP (P4, FE / FULLSTACK profiles)

Setup: run `fe_run` and confirm `fe_url` opens. For FULLSTACK, the real BE must be running (Step 2 has passed).

For **each UI scenario** in TEST-PLAN:

| # | Action | MCP tool |
|---|---|---|
| 1 | Open the page | `new_page` / `navigate_page` |
| 2 | Test login if needed | `fill_form`, `click` |
| 3 | Read the page structure to get element `uid`s (preferred over screenshots) | `take_snapshot` |
| 4 | Perform the scenario steps | `click`, `fill`, `type_text`, `press_key`, `hover`, `drag`, `upload_file`, `handle_dialog` |
| 5 | Wait for the result to appear | `wait_for` (expected text) |
| 6 | Check the displayed result | `take_snapshot` (compare text/state), `evaluate_script` if you need to read state |
| 7 | Check the console: **0 errors** | `list_console_messages`, `get_console_message` |
| 8 | Check the network: no unexpected 4xx/5xx, payloads match the contract | `list_network_requests`, `get_network_request` |
| 9 | Capture evidence | `take_screenshot` → `evidence/ui-<id>.png` |

After the main scenarios pass, also check (`warn` if not met):

- **Responsive:** `resize_page` 375×812 (mobile) and 1366×768. No horizontal overflow, buttons are clickable. Take screenshots.
- **Slow network:** `emulate` (network Slow 3G, CPU 4×). A loading state exists, no double render, no hang.
- **Empty / error states:** empty data, API error → a message is shown, no blank screen.

**Classifying results**

- `fail`: wrong behavior, console error, unexpected failed request, scenario cannot be completed.
- `warn`: correct behavior but slow, broken layout on mobile, console warning, redundant or duplicate requests.

Each `fail`/`warn` → create `BUG-NNN.md` → feedback loop ([02-workflow.md](02-workflow.md#feedback-loop-p4p5--p3)).

## Step 3b · Record as e2e tests (P4, when `e2e_framework: playwright`)

Chrome DevTools MCP is for **exploration and first-time checking**. A scenario that has `pass`ed is **recorded as a Playwright test** in the repo, so CI reruns it forever and old bugs do not come back.

1. For each UI scenario marked `smoke` or tied to a BUG, create or update `e2e/<slug>.spec.ts` (path per `e2e_dir` in the config).
2. One scenario is one `test(...)`; the test name contains the scenario ID (for example `test('UI-2 does not create 2 orders on double-click', …)`).
3. Prefer `getByRole` / `getByLabel` / `getByText` selectors, matching what `take_snapshot` sees. Do not use fragile CSS selectors.
4. Check the same things the MCP run checked: the displayed result, the number of write requests (`page.waitForResponse` / count `page.on('request')`), and no `console.error` (attach `page.on('console')`).
5. Run `e2e_test` from the config. The test must be **green** before the scenario is marked `pass` in TEST-PLAN; the Evidence column also records the test file name.
6. Test data: use a seed or a data-creating API call in `beforeEach`; do not depend on run order.

Repo without Playwright: in `dev-workflow:init`, ask the user whether to add it (`npm init playwright@latest`). If not, write `e2e_framework: none` and skip this step.

## Step 4 · Race conditions (P5, if marked in the spec)

Each `R-n` scenario must state its **invariant**, the thing that must always hold (for example "a product is never sold beyond its stock", "the balance is never negative", "each order is paid only once").

**BE: parallel requests**

1. Prepare clean data (seed script in TEST-PLAN).
2. Fire N **concurrent** requests (N ≥ 20) at the same resource: the project's existing parallel script, or k6 (`k6 run --vus 20 --iterations 20 race.js`).
3. Count results by envelope: the success count must match the expectation (usually 1).
4. **Query the DB to verify the invariant**; do not trust the responses alone.
5. Repeat 3 times (a race does not show up every time). Record each run's result in `evidence/race-<id>.md`.

**FE: overlapping actions** (Chrome DevTools MCP)

- Double-submit: `evaluate_script` clicks the submit button twice in a row → the network shows only 1 write request, or the server rejects the second request.
- Out-of-order responses: change a filter/search quickly many times with a slow network via `emulate` → the UI shows the result of the last action, not the response that arrived last.
- Multiple tabs / realtime (SignalR, websocket): open 2 `new_page`s, act in tab A → tab B updates correctly, with no duplicated records.

## Step 5 · Load (P5, if marked in the spec)

1. Write `runs/<slug>/load/<id>.js` (k6) using the template below, with the endpoint and payload from TEST-PLAN.
2. Run with the load profile given in `R-n` (default: ramp up to 50 VUs over 1 minute, hold 2 minutes, ramp down over 30 seconds).
3. Default thresholds ([01-project-profiles.md](01-project-profiles.md#default-thresholds)): p95 < 500 ms, errors < 1 %.
4. While it runs, record server and DB CPU/RAM if you can access them.
5. Save `k6 ... --summary-export evidence/load-<id>.json` and write a summary in TEST-PLAN.

```js
// minimal k6 template
import http from 'k6/http';
import { check } from 'k6';
export const options = {
  stages: [{ duration: '1m', target: 50 }, { duration: '2m', target: 50 }, { duration: '30s', target: 0 }],
  thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] },
};
export default function () {
  const res = http.post(`${__ENV.BASE_URL}/api/x`, JSON.stringify({ /* payload */ }), {
    headers: { 'Content-Type': 'application/json', Authorization: __ENV.TOKEN },
  });
  check(res, { 'success': (r) => r.status >= 200 && r.status < 300 }); // if the project uses an envelope, check r.json('status')
}
```

If a threshold is not met: find the bottleneck first (slow query, missing index, N+1, overly broad lock), record it in a BUG, and only then fix it.

## Step 6 · FE performance (P5, if marked in the spec)

1. `lighthouse_audit` on the main pages (desktop, and mobile if the project has mobile). Compare against the thresholds.
2. `performance_start_trace` → perform the heaviest action → `performance_stop_trace` → `performance_analyze_insight` to find the cause (LCP, long tasks, layout shift, render-blocking).
3. Suspected memory leak (long-open page, realtime): `take_heapsnapshot` before and after 10 repeated actions; the heap must not keep growing.
4. Save the report to `evidence/perf-<page>.md`.

## Step 7 · Regression before the report (P6)

1. `build` + `unit_test` across the whole repo.
2. Run `e2e_test` (if present) and the P4 scenarios marked `smoke` that have not been recorded as e2e tests.
3. If P5 changed code after the last measurement: rerun the related `R-n`.
4. Put every result into REPORT.md.
