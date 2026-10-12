# Đặt hàng và trừ tồn kho — Design

> Ví dụ minh hoạ, rút gọn. Spec thật do `superpowers:brainstorming` viết sẽ dài hơn.

## Mục tiêu

Khách đã đăng nhập đặt hàng từ giỏ. Hệ thống tạo đơn `PENDING` và trừ tồn kho trong cùng một giao dịch. Không bao giờ bán quá tồn kho.

## Thiết kế

- `POST /api/orders` → `OrderService.Place(customerId, items)`.
- Trong một transaction, với từng sản phẩm:
  `UPDATE products SET stock = stock - @qty WHERE id = @id AND stock >= @qty`.
  Một dòng nào trả về 0 dòng bị ảnh hưởng → rollback, trả `409`.
- Không đọc tồn kho rồi mới trừ (read-then-write), vì hai request song song sẽ cùng thấy còn hàng.
- FE: trang `/cart`, nút "Đặt hàng" khoá ngay khi bấm cho đến khi có phản hồi.

## Tiêu chí nghiệm thu

| Mã | Khi (điều kiện + thao tác) | Thì (kết quả kiểm tra được) | Kiểm bằng |
|---|---|---|---|
| AC-1 | Giỏ có 2 sản phẩm còn hàng, bấm "Đặt hàng" | Đơn `PENDING` được tạo, tồn kho giảm đúng, chuyển sang trang "Đặt hàng thành công" | API e2e + UI |
| AC-2 | Giỏ rỗng, gọi API đặt hàng | `400` "Giỏ hàng trống", không tạo đơn | API e2e |
| AC-3 | Một sản phẩm trong giỏ đã hết hàng | `409`, UI báo "Sản phẩm X đã hết hàng", tồn kho không đổi | API e2e + UI |

## Rủi ro & hardening

| Loại | Có? | Mã | Kịch bản + bất biến | Ngưỡng |
|---|---|---|---|---|
| Race condition | có | R-1 | Sản phẩm còn 1, 20 request đặt mua cùng lúc → đúng 1 thành công; tồn kho = 0, không âm | 3/3 lần đúng |
| Tải cao | có | R-2 | 50 người dùng đặt hàng liên tục 2 phút | p95 < 500 ms, lỗi < 1 % |
| Hiệu năng FE | không | — | trang giỏ hàng nhỏ, không có danh sách dài | — |
| Bảo mật / phân quyền | có | R-3 | Khách A xem đơn của khách B qua `GET /api/orders/{id}` → `404` | 0 rò dữ liệu |
| Dữ liệu lớn | không | — | — | — |

## Hợp đồng API

| Endpoint | Request | Response thành công | Lỗi |
|---|---|---|---|
| `POST /api/orders` | `{ items: [{ productId, qty }] }` | `201 { id, status: "PENDING", total }` | `400` giỏ rỗng · `409 { productId }` hết hàng |
| `GET /api/orders/{id}` | — | `200 { id, status, items, total }` | `404` không tồn tại hoặc không phải đơn của mình |
