# Changelog

## 2.0.0 — 2026-10-12
- **English first:** reference docs, templates, skills and examples are now in English; Vietnamese versions live in `reference/vi/`, `templates/vi/`, `examples/vi/`, `README.vi.md`. Reference files renamed: `01-project-profiles.md`, `02-workflow.md`, `03-dashboard.md`, `04-testing-guide.md`.
- **Playwright:** UI scenarios that pass via Chrome DevTools MCP are recorded as Playwright tests (`e2e_framework`, `e2e_dir`, `e2e_test` in the config).
- **Pull request at P6:** opens a PR/MR with `gh` or `glab` from the new `PR-BODY.md` template; the link is stored as `prUrl`.
- **Session-start reminder:** a SessionStart hook lists features that are waiting for review or blocked.
- **Demo shop** (`demo/`) with two deliberate bugs and a recording script.
- Dashboard UI follows the viewer's language (English / Vietnamese) and shows the PR link.
- `.claude/settings.json` template points to GitHub `quanghoath/dev-workflow`.
- README: install via the VS Code extension's **Manage plugins** dialog.

## 1.4.1 — 2026-10-12
- Repo chính chuyển sang GitHub `quanghoath/dev-workflow` (GitLab `beesky/dev-workflow` là bản sao). Lệnh cài: `/plugin marketplace add quanghoath/dev-workflow`.

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
