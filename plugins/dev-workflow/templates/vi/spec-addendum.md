<!-- Dán 2 mục này (và mục Hợp đồng API nếu FULLSTACK) vào cuối mỗi spec -->

## Tiêu chí nghiệm thu

| Mã | Khi (điều kiện + thao tác) | Thì (kết quả kiểm tra được) | Kiểm bằng |
|---|---|---|---|
| AC-1 | Khách đã đăng nhập, giỏ có 2 sản phẩm còn hàng, bấm "Đặt hàng" | Tạo 1 đơn trạng thái `PENDING`, tồn kho giảm đúng số lượng, chuyển sang trang "Đặt hàng thành công" | API e2e + UI |
| AC-2 | … | … | unit / API e2e / UI |

## Rủi ro & hardening

| Loại | Có? | Mã | Kịch bản + bất biến | Ngưỡng |
|---|---|---|---|---|
| Race condition | có | R-1 | Sản phẩm còn 1, 20 request đặt mua cùng lúc → đúng 1 thành công; tồn kho = 0, không âm | 3/3 lần đúng |
| Tải cao | không | — | (lý do: trang quản trị nội bộ, < 10 người dùng đồng thời) | — |
| Hiệu năng FE | có | R-2 | Trang danh sách đơn hàng 2.000 dòng | Lighthouse ≥ 80, LCP < 2.5 s |
| Bảo mật / phân quyền | có | R-3 | Khách A gọi API xem đơn với id đơn của khách B → bị từ chối | 0 rò dữ liệu |
| Dữ liệu lớn | không | — | — | — |

## Hợp đồng API  <!-- chỉ FULLSTACK -->

| Endpoint | Request | Response thành công | Lỗi |
|---|---|---|---|
| `POST /api/orders` | `{ items: [{ productId: int, qty: int }] }` | `201 { id, status: "PENDING" }` | `409` khi hết hàng · `400` khi giỏ rỗng |
