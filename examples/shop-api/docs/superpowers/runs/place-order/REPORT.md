# REPORT · Place an order and deduct stock

- Slug: `place-order` · Branch: `feat/place-order` · Date: 2026-10-12
- Spec / Plan / TEST-PLAN: `docs/superpowers/specs/2026-10-12-place-order-design.md` · `docs/superpowers/plans/2026-10-12-place-order.md` · `docs/superpowers/runs/place-order/TEST-PLAN.md`

## Conclusion

Placing an order meets all 3 acceptance criteria, never oversells stock when 20 requests compete, and handles 50 concurrent users with p95 212 ms. Ready to merge, provided the migration adding the `idempotency_key` column runs before deploy.

## Acceptance

| AC | Description | Result | Evidence |
|---|---|---|---|
| AC-1 | Order placed successfully, stock deducted | pass | `evidence/api-1.md`, `evidence/ui-1.png` |
| AC-2 | Empty cart → 400 | pass | `evidence/api-2.md` |
| AC-3 | Out of stock → 409 + message | pass | `evidence/api-3.md`, `evidence/ui-3.png` |

## Test numbers

| Type | Result |
|---|---|
| Unit | 37 pass / 0 fail |
| P4 integration | 6/6 pass (UI-2 passed in round 2) |
| P5 race | R-1: 3/3 runs exactly 1/20 succeeded, stock 0 |
| P5 load | R-2: p95 212 ms, errors 0 % (threshold 500 ms / 1 %) |
| P5 authorization | R-3: 404 when viewing another user's order |

## Bugs & feedback loops

| BUG | Title | Loops | Outcome |
|---|---|---|---|
| BUG-001 | Double-click creates 2 orders | 1 | fixed (FE lock + Idempotency-Key in the API) |

Total returns to P3: 1.

## Main changes

- `OrderService`: deducts stock with `UPDATE … WHERE stock >= @qty` inside a transaction.
- `OrdersController`: `POST /api/orders`, `GET /api/orders/{id}`, supports `Idempotency-Key`.
- `src/cart/CartPage.tsx`: place-order button, submitting state, out-of-stock message.
- Migration: tables `orders`, `order_items`, column `idempotency_key`.

## Remaining risks & suggested next steps

- Unpaid `PENDING` orders hold stock forever. Needs a job that cancels orders older than 30 minutes (separate feature).
- Load was only measured at 50 users; before a large promotion, measure again at 500.

## How the reviewer can re-check

1. `dotnet test` and `npm test`.
2. Run the API + FE, sign in with a test account, place an order at `/cart`.
3. `k6 run load/r1-race.js`, then check that `SELECT stock FROM products WHERE id = 3` returns 0.
