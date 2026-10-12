# TEST-PLAN · Place an order and deduct stock

- Slug: `place-order` · Spec: `docs/superpowers/specs/2026-10-12-place-order-design.md` · Plan: `docs/superpowers/plans/2026-10-12-place-order.md`
- Environment: local (API `http://localhost:5000`, FE `http://localhost:5173`)
- Test data: `scripts/seed-test.sql` (3 products, 2 customers); test accounts in `.env.test`

## P4 · Integration scenarios

| ID | AC | Type | Smoke | Steps | Expected | DB / network check | Result | Evidence |
|---|---|---|---|---|---|---|---|---|
| API-1 | AC-1 | API | ✔ | `POST /api/orders` with 2 products | `201`, `status=PENDING` | `stock` decreases by exactly `qty` | pass | `evidence/api-1.md` |
| API-2 | AC-2 | API | | `items: []` | `400` "Cart is empty" | no new order | pass | `evidence/api-2.md` |
| API-3 | AC-3 | API | | product with `stock=0` | `409 { productId }` | `stock` unchanged | pass | `evidence/api-3.md` |
| UI-1 | AC-1 | UI | ✔ | 1. Open /cart 2. Click "Place order" 3. Wait for the confirmation page | "Order placed" page showing the order ID | 1 request `POST /api/orders` 201; 0 console errors | pass (round 2) | `evidence/ui-1.png` |
| UI-2 | AC-1 | UI | | Click "Place order" twice in a row | Only 1 order | only 1 `POST` request | **fail → BUG-001** → pass (round 2) | `evidence/ui-2-network.md` |
| UI-3 | AC-3 | UI | | Cart contains an out-of-stock product | Message "Product X is out of stock" | `409`, 0 console errors | pass | `evidence/ui-3.png` |

Additional UI checks: responsive 375 / 1366 pass · slow network (Slow 3G): button shows "Placing…" pass · API error 500: message shown, no blank screen pass.

## P5 · Hardening

| ID | Risk | How to run | Invariant / threshold | Run 1 | Run 2 | Run 3 | Evidence |
|---|---|---|---|---|---|---|---|
| R-1 | Race | `k6 run --vus 20 --iterations 20 load/r1-race.js` | 1/20 succeeds; `stock = 0` | 1/20, stock 0 | 1/20, stock 0 | 1/20, stock 0 | `evidence/race-r1.md` |
| R-2 | Load | `k6 run load/r2-load.js` (50 VU, 2 minutes) | p95 < 500 ms, errors < 1 % | p95 212 ms, errors 0 % | — | — | `evidence/load-r2.json` |
| R-3 | Authorization | Customer A's token calls `GET /api/orders/{B's id}` | `404` | 404 | — | — | `evidence/authz-r3.md` |

## Run log

| Time | Round | Scenario | Result | Notes / BUG |
|---|---|---|---|---|
| 2026-10-12 14:05 | 1 | API-1..3, UI-1, UI-3 | pass | |
| 2026-10-12 14:12 | 1 | UI-2 | fail | BUG-001: double-click creates 2 orders |
| 2026-10-12 14:40 | 2 | all of P4 (regression) | pass | |
| 2026-10-12 15:10 | — | R-1, R-2, R-3 | pass | |
