# Báo cáo nhanh · Sửa chữ trên nút "Đặt hàng"

- Slug: `sua-nhan-nut` · Branch: `fix/sua-nhan-nut` · Ngày: 2026-10-12 · Chế độ: quick
- Mục tiêu: nút hiện "Đặt hàng (2)" theo số sản phẩm trong giỏ, thay vì chữ "Submit".

| AC | Mô tả | Kiểm bằng | Kết quả |
|---|---|---|---|
| AC-1 | Giỏ 2 sản phẩm → nút "Đặt hàng (2)" | unit `CartButton.test.tsx::hiện số lượng` + UI: snapshot `/cart` | pass |
| AC-2 | Giỏ rỗng → nút "Đặt hàng" bị khoá | unit `CartButton.test.tsx::khoá khi giỏ rỗng` + UI | pass |

- File đã sửa: `src/cart/CartButton.tsx`, `src/i18n/vi.json`
- Unit test: 39 pass / 0 fail · Build: xanh · 0 console error trên `/cart`
- Bug trong lúc làm: không
- Còn lại / lưu ý: không
