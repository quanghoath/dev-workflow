# Changelog

## 1.4.0 — 2026-10-12
- **Chế độ nhanh** cho việc nhỏ: spec/plan trong chat, TDD, kiểm tra P4 cho AC liên quan, báo cáo nhanh. Tự chuyển sang đầy đủ khi phát hiện phức tạp ẩn.
- Skill mới **`/dev-workflow:status`**: xem tiến độ mọi tính năng và bước tiếp theo, không cần dashboard.
- Trạng thái lưu tại `docs/superpowers/runs/<slug>/status.json` (nguồn sự thật); dashboard đồng bộ từ file này.
- Dashboard hiện thẻ "nhanh".
- Thư mục `examples/`: một tính năng chạy đủ P1–P6 và một việc chạy chế độ nhanh.

## 1.3.0 — 2026-10-12
- Metadata cho việc tìm kiếm: mô tả tiếng Anh, keywords, category, homepage, license MIT.
- Skill `init` và `run` kiểm tra plugin superpowers, hướng dẫn cài nếu thiếu.
- Trao đổi và viết spec/plan/report theo ngôn ngữ người dùng.
- README song ngữ, rút gọn hướng dẫn cài.

## 1.2.0 — 2026-10-12
- Dashboard theo từng dự án: init hỏi dùng có sẵn / tạo mới / không dùng. Đưa mã nguồn dashboard vào plugin.

## 1.1.0 — 2026-10-12
- Init tạo `.claude/settings.json` để cả team tự có plugin khi clone repo.
- Ví dụ trong tài liệu chuyển sang chung chung.

## 1.0.0 — 2026-10-12
- Phát hành đầu tiên: skill `init`, `run`; quy trình P0–P6; mẫu spec, TEST-PLAN, BUG, REPORT; dashboard claude.ai.
