# Quick report · Fix the label on the "Place order" button

- Slug: `button-label` · Branch: `fix/button-label` · Date: 2026-10-12 · Mode: quick
- Goal: the button shows "Place order (2)" based on the number of items in the cart, instead of "Submit".

| AC | Description | Verified by | Result |
|---|---|---|---|
| AC-1 | Cart with 2 items → button "Place order (2)" | unit `CartButton.test.tsx::shows item count` + UI: snapshot `/cart` | pass |
| AC-2 | Empty cart → "Place order" button disabled | unit `CartButton.test.tsx::disabled when cart is empty` + UI | pass |

- Files changed: `src/cart/CartButton.tsx`, `src/i18n/en.json`
- Unit tests: 39 pass / 0 fail · Build: green · 0 console errors on `/cart`
- Bugs during the work: none
- Remaining / notes: none
