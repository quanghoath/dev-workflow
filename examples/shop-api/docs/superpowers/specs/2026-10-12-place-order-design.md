# Place an order and deduct stock — Design

> Illustrative, shortened example. A real spec written by `superpowers:brainstorming` would be longer.

## Goal

A signed-in customer places an order from their cart. The system creates a `PENDING` order and deducts stock in the same transaction. Never sell more than what is in stock.

## Design

- `POST /api/orders` → `OrderService.Place(customerId, items)`.
- Within one transaction, for each product:
  `UPDATE products SET stock = stock - @qty WHERE id = @id AND stock >= @qty`.
  If any statement affects 0 rows → roll back, return `409`.
- Do not read stock and then deduct it (read-then-write), because two parallel requests would both see stock available.
- FE: `/cart` page; the "Place order" button locks as soon as it is clicked, until a response arrives.

## Acceptance criteria

| ID | When (condition + action) | Then (verifiable result) | Verified by |
|---|---|---|---|
| AC-1 | Cart has 2 in-stock products, click "Place order" | A `PENDING` order is created, stock decreases correctly, user is taken to the "Order placed" page | API e2e + UI |
| AC-2 | Cart is empty, call the place-order API | `400` "Cart is empty", no order created | API e2e |
| AC-3 | A product in the cart is out of stock | `409`, UI shows "Product X is out of stock", stock unchanged | API e2e + UI |

## Risks & hardening

| Type | Applies? | ID | Scenario + invariant | Threshold |
|---|---|---|---|---|
| Race condition | yes | R-1 | Product has 1 left, 20 purchase requests at the same time → exactly 1 succeeds; stock = 0, never negative | correct 3/3 runs |
| High load | yes | R-2 | 50 users placing orders continuously for 2 minutes | p95 < 500 ms, errors < 1 % |
| FE performance | no | — | the cart page is small, no long lists | — |
| Security / authorization | yes | R-3 | Customer A views customer B's order via `GET /api/orders/{id}` → `404` | 0 data leaks |
| Large data | no | — | — | — |

## API contract

| Endpoint | Request | Success response | Errors |
|---|---|---|---|
| `POST /api/orders` | `{ items: [{ productId, qty }] }` | `201 { id, status: "PENDING", total }` | `400` empty cart · `409 { productId }` out of stock |
| `GET /api/orders/{id}` | — | `200 { id, status, items, total }` | `404` does not exist or is not the caller's order |
