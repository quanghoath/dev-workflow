# TEST-PLAN · <tên tính năng>

- Slug: `<slug>` · Spec: `<đường dẫn>` · Plan: `<đường dẫn>`
- Môi trường: local / dev (không dùng prod)
- Dữ liệu test: <script seed, tài khoản test (ở .env.test, không commit)>

## P4 · Kịch bản tích hợp

| ID | AC | Loại | Smoke | Bước | Mong đợi | Kiểm tra DB / network | Kết quả | Bằng chứng |
|---|---|---|---|---|---|---|---|---|
| UI-1 | AC-1 | UI | ✔ | 1. Mở /ban/5 2. Chọn ghế 3 3. Bấm Buyin | Toast "Thành công", ghế 3 hiển thị tên khách | `POST /api/buyin` 200, status 2000; 0 console error | | `evidence/ui-1.png` |
| API-1 | AC-1 | API | ✔ | `POST /api/buyin {…}` | `status=2000` | `SELECT COUNT(*) … = 1` | | `evidence/api-1.md` |
| API-2 | AC-2 | API | | thiếu `MaKH` | `status=2001`, message "…" | không có bản ghi mới | | |

Kiểm tra bổ sung UI (cho mọi trang thuộc tính năng): responsive 375 / 1366 · mạng chậm · trạng thái rỗng/lỗi.

## P5 · Hardening

| ID | Rủi ro | Cách chạy | Bất biến / ngưỡng | Lần 1 | Lần 2 | Lần 3 | Bằng chứng |
|---|---|---|---|---|---|---|---|
| R-1 | Race | `k6 run --vus 20 --iterations 20 load/r1.js` | 1/20 thành công; DB 1 bản ghi | | | | `evidence/race-r1.md` |
| R-2 | Hiệu năng FE | `lighthouse_audit` /danh-sach | Perf ≥ 80, LCP < 2.5 s | | — | — | `evidence/perf-danh-sach.md` |

## Nhật ký chạy

| Thời điểm | Vòng | Kịch bản | Kết quả | Ghi chú / BUG |
|---|---|---|---|---|
| | | | | |
