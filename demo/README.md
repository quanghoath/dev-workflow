# Demo: record dev-workflow in action

`shop/` is a tiny shop (Node.js only, no dependencies) with two deliberate bugs:

1. Double-clicking **Place order** creates two orders.
2. Stock is checked and decremented in two steps, so 20 concurrent orders for the last item oversell it (7 orders succeed and stock goes to −6 on a typical run).

Use it to record a 60–90 second GIF or video for the README.

## Setup

```bash
cp -r demo/shop ~/shop-demo && cd ~/shop-demo   # work on a copy, outside this repo
git init -q && git add -A && git commit -qm "demo shop"
npm test          # 2 passing tests
npm start         # http://localhost:3000/cart
```

Requires Claude Code with superpowers, dev-workflow and Chrome DevTools MCP.

## Recording script

| # | You type / do | What viewers see |
|---|---|---|
| 1 | `/dev-workflow:init` | Claude detects a FULLSTACK Node project, verifies `npm test`, writes `docs/workflow-config.md`. Pick **none** for the dashboard to keep it short. |
| 2 | `Fix: double-clicking Place order creates two orders` | Claude proposes **quick mode** (small fix, 1–2 files). Approve. |
| 3 | (wait) | A failing test that reproduces the double click, then the fix, then green tests. |
| 4 | (wait) | Claude opens Chrome via DevTools MCP, double-clicks the button, checks the network tab shows **one** `POST /api/orders`, no console errors. |
| 5 | (wait) | Quick report: ACs passed, files changed, tests. |
| 6 | `/dev-workflow:run Make ordering safe when many people buy the last item` | Full mode. At P1 the spec flags a **race condition** risk (R-1) with the invariant "stock never goes negative". Speed up the video through P2–P3. |
| 7 | (wait) | P5: 20 parallel orders → exactly 1 succeeds, stock = 0, 3 runs out of 3. |
| 8 | `/dev-workflow:status` | Summary of both features. |

Tips: use a large terminal font, speed up waiting parts 4–8×, and cut the approvals down to the moment you type "ok".

---

**Tiếng Việt:** `shop/` là cửa hàng mini cố ý có 2 lỗi (double-click tạo 2 đơn; 20 người mua món cuối cùng thì bán quá tồn kho). Copy ra ngoài repo, `npm start`, rồi quay theo bảng kịch bản trên: bước 2–5 cho chế độ nhanh, bước 6–7 cho chế độ đầy đủ với kiểm thử race condition.
