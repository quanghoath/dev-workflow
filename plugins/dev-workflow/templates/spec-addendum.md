<!-- Paste these 2 sections (plus the API contract section if FULLSTACK) at the end of every spec -->

## Acceptance criteria

| ID | When (precondition + action) | Then (verifiable outcome) | Verified by |
|---|---|---|---|
| AC-1 | Logged-in customer with 2 in-stock products in the cart clicks "Place order" | 1 order is created with status `PENDING`, stock drops by exactly the ordered quantities, the "Order placed" page is shown | API e2e + UI |
| AC-2 | … | … | unit / API e2e / UI |

## Risks & hardening

| Type | Applies? | ID | Scenario + invariant | Threshold |
|---|---|---|---|---|
| Race condition | yes | R-1 | Product has 1 left, 20 concurrent orders → exactly 1 succeeds; stock = 0, never negative | correct 3/3 runs |
| High load | no | — | (reason: internal admin page, < 10 concurrent users) | — |
| FE performance | yes | R-2 | Order list page with 2,000 rows | Lighthouse ≥ 80, LCP < 2.5 s |
| Security / authorization | yes | R-3 | Customer A calls the order-details API with customer B's order id → denied | 0 data leaks |
| Large data | no | — | — | — |

## API contract  <!-- FULLSTACK only -->

| Endpoint | Request | Success response | Errors |
|---|---|---|---|
| `POST /api/orders` | `{ items: [{ productId: int, qty: int }] }` | `201 { id, status: "PENDING" }` | `409` when out of stock · `400` when the cart is empty |
