# Ví dụ chạy mẫu

Đầu ra của dev-workflow trên một dự án **giả định** `shop-api` (FULLSTACK: API đặt hàng + trang giỏ hàng). Số liệu là minh hoạ, không phải kết quả đo thật.

| Tính năng | Chế độ | Xem |
|---|---|---|
| Đặt hàng và trừ tồn kho | đầy đủ (P1–P6) | [spec](shop-api/docs/superpowers/specs/2026-10-12-dat-hang-design.md) · [TEST-PLAN](shop-api/docs/superpowers/runs/dat-hang/TEST-PLAN.md) · [BUG-001](shop-api/docs/superpowers/runs/dat-hang/bugs/BUG-001.md) · [REPORT](shop-api/docs/superpowers/runs/dat-hang/REPORT.md) · [status.json](shop-api/docs/superpowers/runs/dat-hang/status.json) |
| Sửa chữ trên nút "Đặt hàng" | nhanh | [REPORT](shop-api/docs/superpowers/runs/sua-nhan-nut/REPORT.md) · [status.json](shop-api/docs/superpowers/runs/sua-nhan-nut/status.json) |

Plan (`docs/superpowers/plans/…`) không đưa vào ví dụ vì đó là đầu ra chuẩn của `superpowers:writing-plans`.

Điểm đáng chú ý trong ví dụ:
- Rủi ro race được phát hiện ngay ở **spec** (R-1), nên thiết kế đã dùng câu lệnh trừ tồn kho có điều kiện từ đầu.
- **BUG-001** đến từ P4: double-click tạo 2 đơn. Đã sửa trong 1 vòng, có test tái hiện.
- **REPORT** ghi rõ số liệu P5 và rủi ro còn lại.
