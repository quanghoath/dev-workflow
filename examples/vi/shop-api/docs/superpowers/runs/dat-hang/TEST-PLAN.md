# TEST-PLAN · Đặt hàng và trừ tồn kho

- Slug: `dat-hang` · Spec: `docs/superpowers/specs/2026-10-12-dat-hang-design.md` · Plan: `docs/superpowers/plans/2026-10-12-dat-hang.md`
- Môi trường: local (API `http://localhost:5000`, FE `http://localhost:5173`)
- Dữ liệu test: `scripts/seed-test.sql` (3 sản phẩm, 2 khách); tài khoản test trong `.env.test`

## P4 · Kịch bản tích hợp

| ID | AC | Loại | Smoke | Bước | Mong đợi | Kiểm tra DB / network | Kết quả | Bằng chứng |
|---|---|---|---|---|---|---|---|---|
| API-1 | AC-1 | API | ✔ | `POST /api/orders` 2 sản phẩm | `201`, `status=PENDING` | `stock` giảm đúng `qty` | pass | `evidence/api-1.md` |
| API-2 | AC-2 | API | | `items: []` | `400` "Giỏ hàng trống" | không có đơn mới | pass | `evidence/api-2.md` |
| API-3 | AC-3 | API | | sản phẩm `stock=0` | `409 { productId }` | `stock` không đổi | pass | `evidence/api-3.md` |
| UI-1 | AC-1 | UI | ✔ | 1. Mở /cart 2. Bấm "Đặt hàng" 3. Chờ trang xác nhận | Trang "Đặt hàng thành công" có mã đơn | 1 request `POST /api/orders` 201; 0 console error | pass (vòng 2) | `evidence/ui-1.png` |
| UI-2 | AC-1 | UI | | Bấm "Đặt hàng" 2 lần liên tiếp | Chỉ 1 đơn | chỉ 1 request `POST` | **fail → BUG-001** → pass (vòng 2) | `evidence/ui-2-network.md` |
| UI-3 | AC-3 | UI | | Giỏ có sản phẩm hết hàng | Thông báo "Sản phẩm X đã hết hàng" | `409`, 0 console error | pass | `evidence/ui-3.png` |

Kiểm tra bổ sung UI: responsive 375 / 1366 pass · mạng chậm (Slow 3G): nút hiện "Đang đặt…" pass · API lỗi 500: hiện thông báo, không trắng màn hình pass.

## P5 · Hardening

| ID | Rủi ro | Cách chạy | Bất biến / ngưỡng | Lần 1 | Lần 2 | Lần 3 | Bằng chứng |
|---|---|---|---|---|---|---|---|
| R-1 | Race | `k6 run --vus 20 --iterations 20 load/r1-race.js` | 1/20 thành công; `stock = 0` | 1/20, stock 0 | 1/20, stock 0 | 1/20, stock 0 | `evidence/race-r1.md` |
| R-2 | Tải | `k6 run load/r2-load.js` (50 VU, 2 phút) | p95 < 500 ms, lỗi < 1 % | p95 212 ms, lỗi 0 % | — | — | `evidence/load-r2.json` |
| R-3 | Phân quyền | Token khách A gọi `GET /api/orders/{id của B}` | `404` | 404 | — | — | `evidence/authz-r3.md` |

## Nhật ký chạy

| Thời điểm | Vòng | Kịch bản | Kết quả | Ghi chú / BUG |
|---|---|---|---|---|
| 2026-10-12 14:05 | 1 | API-1..3, UI-1, UI-3 | pass | |
| 2026-10-12 14:12 | 1 | UI-2 | fail | BUG-001: double-click tạo 2 đơn |
| 2026-10-12 14:40 | 2 | toàn bộ P4 (hồi quy) | pass | |
| 2026-10-12 15:10 | — | R-1, R-2, R-3 | pass | |
