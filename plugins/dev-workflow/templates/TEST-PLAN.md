# TEST-PLAN · <tên tính năng>

- Slug: `<slug>` · Spec: `<đường dẫn>` · Plan: `<đường dẫn>`
- Môi trường: local / dev (không dùng prod)
- Dữ liệu test: <script seed, tài khoản test (ở .env.test, không commit)>

## P4 · Kịch bản tích hợp

| ID | AC | Loại | Smoke | Bước | Mong đợi | Kiểm tra DB / network | Kết quả | Bằng chứng |
|---|---|---|---|---|---|---|---|---|
| UI-1 | AC-1 | UI | ✔ | 1. Mở /cart 2. Bấm "Đặt hàng" 3. Chờ trang xác nhận | Trang "Đặt hàng thành công" có mã đơn | `POST /api/orders` 201; 0 console error | | `evidence/ui-1.png` |
| API-1 | AC-1 | API | ✔ | `POST /api/orders {…}` | `201`, `status=PENDING` | `SELECT stock FROM products WHERE id=…` giảm đúng `qty` | | `evidence/api-1.md` |
| API-2 | AC-2 | API | | `items` rỗng | `400`, message "Giỏ hàng trống" | không có đơn mới | | |

Kiểm tra bổ sung UI (cho mọi trang thuộc tính năng): responsive 375 / 1366 · mạng chậm · trạng thái rỗng/lỗi.

## P5 · Hardening

| ID | Rủi ro | Cách chạy | Bất biến / ngưỡng | Lần 1 | Lần 2 | Lần 3 | Bằng chứng |
|---|---|---|---|---|---|---|---|
| R-1 | Race | `k6 run --vus 20 --iterations 20 load/r1.js` | 1/20 thành công; tồn kho = 0 | | | | `evidence/race-r1.md` |
| R-2 | Hiệu năng FE | `lighthouse_audit` /danh-sach | Perf ≥ 80, LCP < 2.5 s | | — | — | `evidence/perf-danh-sach.md` |

## Nhật ký chạy

| Thời điểm | Vòng | Kịch bản | Kết quả | Ghi chú / BUG |
|---|---|---|---|---|
| | | | | |
