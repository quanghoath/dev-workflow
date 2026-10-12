# Example run

Output of dev-workflow on a **fictional** project, `shop-api` (FULLSTACK: an order API + a cart page). The numbers are illustrative, not real measurements.

Tiếng Việt: [vi/README.md](vi/README.md)

| Feature | Mode | See |
|---|---|---|
| Place an order and deduct stock | full (P1–P6) | [spec](shop-api/docs/superpowers/specs/2026-10-12-place-order-design.md) · [TEST-PLAN](shop-api/docs/superpowers/runs/place-order/TEST-PLAN.md) · [BUG-001](shop-api/docs/superpowers/runs/place-order/bugs/BUG-001.md) · [REPORT](shop-api/docs/superpowers/runs/place-order/REPORT.md) · [status.json](shop-api/docs/superpowers/runs/place-order/status.json) |
| Fix the label on the "Place order" button | quick | [REPORT](shop-api/docs/superpowers/runs/button-label/REPORT.md) · [status.json](shop-api/docs/superpowers/runs/button-label/status.json) |

The plan (`docs/superpowers/plans/…`) is not included in the example because it is the standard output of `superpowers:writing-plans`.

Things worth noticing in the example:
- The race risk was caught as early as the **spec** (R-1), so the design used a conditional stock-deduction statement from the start.
- **BUG-001** came from P4: a double-click created 2 orders. It was fixed in 1 round, with a reproducing test.
- The **REPORT** states the P5 numbers and the remaining risks.
