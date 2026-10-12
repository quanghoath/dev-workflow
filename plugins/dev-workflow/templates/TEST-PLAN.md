# TEST-PLAN · <feature name>

- Slug: `<slug>` · Spec: `<path>` · Plan: `<path>`
- Environment: local / dev (never prod)
- Test data: <seed script, test accounts (in .env.test, not committed)>

## P4 · Integration scenarios

| ID | AC | Type | Smoke | Steps | Expected | DB / network check | Result | Evidence |
|---|---|---|---|---|---|---|---|---|
| UI-1 | AC-1 | UI | ✔ | 1. Open /cart 2. Click "Place order" 3. Wait for the confirmation page | "Order placed" page shows the order number | `POST /api/orders` 201; 0 console errors | | `evidence/ui-1.png` |
| API-1 | AC-1 | API | ✔ | `POST /api/orders {…}` | `201`, `status=PENDING` | `SELECT stock FROM products WHERE id=…` drops by exactly `qty` | | `evidence/api-1.md` |
| API-2 | AC-2 | API | | empty `items` | `400`, message "Cart is empty" | no new order | | |

Additional UI checks (for every page in the feature): responsive 375 / 1366 · slow network · empty/error states.

## P5 · Hardening

| ID | Risk | How to run | Invariant / threshold | Run 1 | Run 2 | Run 3 | Evidence |
|---|---|---|---|---|---|---|---|
| R-1 | Race | `k6 run --vus 20 --iterations 20 load/r1.js` | 1/20 succeeds; stock = 0 | | | | `evidence/race-r1.md` |
| R-2 | FE performance | `lighthouse_audit` /orders | Perf ≥ 80, LCP < 2.5 s | | — | — | `evidence/perf-orders.md` |

## Run log

| Time | Loop | Scenario | Result | Notes / BUG |
|---|---|---|---|---|
| | | | | |
