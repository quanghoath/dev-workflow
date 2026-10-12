# REPORT · Đặt hàng và trừ tồn kho

- Slug: `dat-hang` · Branch: `feat/dat-hang` · Ngày: 2026-10-12
- Spec / Plan / TEST-PLAN: `docs/superpowers/specs/2026-10-12-dat-hang-design.md` · `docs/superpowers/plans/2026-10-12-dat-hang.md` · `docs/superpowers/runs/dat-hang/TEST-PLAN.md`

## Kết luận

Đặt hàng hoạt động đủ 3 tiêu chí nghiệm thu, không bán quá tồn kho khi 20 request tranh nhau, chịu được 50 người dùng đồng thời với p95 212 ms. Sẵn sàng merge, với điều kiện chạy migration thêm cột `idempotency_key` trước khi deploy.

## Nghiệm thu

| AC | Mô tả | Kết quả | Bằng chứng |
|---|---|---|---|
| AC-1 | Đặt hàng thành công, trừ tồn kho | pass | `evidence/api-1.md`, `evidence/ui-1.png` |
| AC-2 | Giỏ rỗng → 400 | pass | `evidence/api-2.md` |
| AC-3 | Hết hàng → 409 + thông báo | pass | `evidence/api-3.md`, `evidence/ui-3.png` |

## Số liệu test

| Loại | Kết quả |
|---|---|
| Unit | 37 pass / 0 fail |
| P4 tích hợp | 6/6 pass (UI-2 pass ở vòng 2) |
| P5 race | R-1: 3/3 lần đúng 1/20 thành công, tồn kho 0 |
| P5 tải | R-2: p95 212 ms, lỗi 0 % (ngưỡng 500 ms / 1 %) |
| P5 phân quyền | R-3: 404 khi xem đơn người khác |

## Bug & vòng phản hồi

| BUG | Tiêu đề | Vòng | Kết cục |
|---|---|---|---|
| BUG-001 | Double-click tạo 2 đơn | 1 | fixed (khoá FE + Idempotency-Key ở API) |

Tổng số lần quay về P3: 1.

## Thay đổi chính

- `OrderService`: trừ tồn kho bằng `UPDATE … WHERE stock >= @qty` trong transaction.
- `OrdersController`: `POST /api/orders`, `GET /api/orders/{id}`, hỗ trợ `Idempotency-Key`.
- `src/cart/CartPage.tsx`: nút đặt hàng, trạng thái đang gửi, thông báo hết hàng.
- Migration: bảng `orders`, `order_items`, cột `idempotency_key`.

## Rủi ro còn lại & việc đề xuất tiếp

- Đơn `PENDING` không thanh toán sẽ giữ tồn kho mãi. Cần job huỷ đơn quá 30 phút (tính năng riêng).
- Mới đo tải 50 người dùng; nếu có đợt khuyến mãi lớn, đo lại với 500.

## Hướng dẫn kiểm tra lại cho người duyệt

1. `dotnet test` và `npm test`.
2. Chạy API + FE, đăng nhập tài khoản test, đặt một đơn ở `/cart`.
3. `k6 run load/r1-race.js` rồi kiểm tra `SELECT stock FROM products WHERE id = 3` bằng 0.
