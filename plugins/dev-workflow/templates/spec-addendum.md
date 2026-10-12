<!-- Dán 2 mục này (và mục Hợp đồng API nếu FULLSTACK) vào cuối mỗi spec -->

## Tiêu chí nghiệm thu

| Mã | Khi (điều kiện + thao tác) | Thì (kết quả kiểm tra được) | Kiểm bằng |
|---|---|---|---|
| AC-1 | Nhân viên chọn ghế trống và bấm "Buyin" | Tạo 1 bản ghi buyin, ghế chuyển sang "đã ngồi", toast "Thành công" | API e2e + UI |
| AC-2 | … | … | unit / API e2e / UI |

## Rủi ro & hardening

| Loại | Có? | Mã | Kịch bản + bất biến | Ngưỡng |
|---|---|---|---|---|
| Race condition | có | R-1 | 20 request buyin cùng ghế cùng lúc → đúng 1 thành công; DB có đúng 1 bản ghi ở ghế đó | 3/3 lần đúng |
| Tải cao | không | — | (lý do: màn hình nội bộ, < 10 người dùng đồng thời) | — |
| Hiệu năng FE | có | R-2 | Trang danh sách 2.000 dòng | Lighthouse ≥ 80, LCP < 2.5 s |
| Bảo mật / phân quyền | có | R-3 | Nhân viên chi nhánh A gọi API với id của chi nhánh B → bị từ chối | 0 rò dữ liệu |
| Dữ liệu lớn | không | — | — | — |

## Hợp đồng API  <!-- chỉ FULLSTACK -->

| Endpoint | Request | Response thành công | Lỗi |
|---|---|---|---|
| `POST /api/x/create` | `{ a: int, b: string }` | `{ status: 2000, data: { id } }` | `2001` + message khi … |
