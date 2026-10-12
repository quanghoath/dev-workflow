## Quy trình phát triển (dev-workflow)

Repo này chạy theo plugin `dev-workflow`. Mọi tính năng hoặc sửa lỗi không tầm thường phải dùng skill `dev-workflow:run` (P1 spec → P2 plan + TEST-PLAN → P3 build TDD → P4 tích hợp → P5 hardening → P6 tổng kết; người dùng duyệt ở P1, P2, P6).

- Cấu hình dự án (hồ sơ, lệnh build/test, URL, môi trường được phép test): `docs/workflow-config.md`.
- Việc nhỏ dùng chế độ nhanh (xem điều kiện trong quy trình). Xem tiến độ: `dev-workflow:status`.
- Spec/plan: `docs/superpowers/specs|plans/`. Trạng thái từng tính năng: `docs/superpowers/runs/<slug>/status.json`. Kịch bản test, bug, bằng chứng, báo cáo: `docs/superpowers/runs/<slug>/`.
- Cập nhật dashboard mỗi lần chuyển bước và mỗi lần dừng. Mỗi bug tối đa 3 vòng sửa. Không chạy P4/P5 trên production.
