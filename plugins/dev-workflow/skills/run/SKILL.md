---
name: run
description: Take a feature or non-trivial bug fix through the dev-workflow P1–P6 pipeline - spec with acceptance criteria and risks, plan + test plan, TDD build, integration testing (Chrome DevTools MCP for UI, API end-to-end), hardening (race conditions, load, performance), final report - with review gates and status dashboard updates. Use when the user asks to build or change a feature "with dev-workflow", or when the repo has docs/workflow-config.md. / Chạy tính năng qua quy trình P1–P6.
---

# dev-workflow · Chạy tính năng P1–P6

Bắt buộc đọc trước khi bắt đầu:
- `${CLAUDE_PLUGIN_ROOT}/reference/02-quy-trinh.md`: định nghĩa từng bước, các cổng duyệt, vòng phản hồi, các trường hợp phải dừng.
- `docs/workflow-config.md` của repo. Nếu chưa có, chạy skill `dev-workflow:init` trước.

Đọc khi đến bước tương ứng:
- `${CLAUDE_PLUGIN_ROOT}/reference/04-quy-trinh-test.md`: P3–P6.
- `${CLAUDE_PLUGIN_ROOT}/reference/03-dashboard.md`: mỗi lần cập nhật dashboard.
- `${CLAUDE_PLUGIN_ROOT}/reference/01-ho-so-du-an.md`: công cụ test và ngưỡng mặc định.
- Mẫu: `${CLAUDE_PLUGIN_ROOT}/templates/` (`spec-addendum.md`, `TEST-PLAN.md`, `BUG.md`, `REPORT.md`).

## Luồng

| Bước | Skill superpowers | Đầu ra | Cổng |
|---|---|---|---|
| P1 Spec | `brainstorming` | spec + mục từ `spec-addendum.md` | ◆ người duyệt |
| P2 Plan | `writing-plans` | plan (task `[BE]`/`[FE]`/`[CONTRACT]`) + `runs/<slug>/TEST-PLAN.md` | ◆ người duyệt |
| P3 Build | `subagent-driven-development` hoặc `executing-plans`, kèm `test-driven-development` | code + unit test xanh | — |
| P4 Tích hợp | (Chrome DevTools MCP / API e2e) | kết quả kịch bản + `evidence/` | lỗi → vòng phản hồi |
| P5 Hardening | — | số liệu race, tải, hiệu năng | lỗi → vòng phản hồi |
| P6 Tổng kết | `verification-before-completion`, `requesting-code-review`, `finishing-a-development-branch` | `REPORT.md` | ◆ người duyệt |

Vòng phản hồi: `BUG-NNN.md` → `systematic-debugging` → test tái hiện → sửa → chạy lại. **Tối đa 3 vòng cho mỗi bug**, sau đó `blocked` và dừng.

## Quy tắc không được vi phạm

0. Kiểm tra skill `superpowers:brainstorming` có sẵn. Nếu không có, dừng lại và hướng dẫn cài: `/plugin install superpowers@claude-plugins-official` (hoặc `/plugin marketplace add obra/superpowers-marketplace` rồi `/plugin install superpowers@superpowers-marketplace`).
1. Tạo todo cho P1–P6 ngay khi bắt đầu; tính năng đang dở thì tiếp tục từ bước chưa xong (xem dashboard và thư mục `runs/<slug>/`).
2. Không vượt cổng ◆ khi chưa có câu trả lời đồng ý của người dùng cho đúng tài liệu đó.
3. Kịch bản test (TEST-PLAN) viết ở P2, trước khi code.
4. Không kết luận `pass` khi chưa thấy output thật.
5. Không chạy P4/P5 trên môi trường `forbidden` trong config (mặc định là prod).
6. **Cập nhật dashboard** (`url` = `dashboard_url` trong config) mỗi lần chuyển bước, đến cổng, mở hoặc đóng bug, và khi dừng (`ArtifactData`: `get` → `update` với `if_version`). Nếu `dashboard_url: none` thì bỏ qua mọi bước dashboard. Nếu thiếu hoặc trống, hỏi người dùng một lần (dán link / tạo mới / không dùng) theo `03-dashboard.md` và ghi lại vào config. Ghi dashboard thất bại thì báo một lần rồi tiếp tục công việc; không được bỏ việc vì dashboard.
7. FULLSTACK: `[CONTRACT]` → `[BE]` → API e2e pass → `[FE]`.
8. Tài liệu tham chiếu viết bằng tiếng Việt, nhưng trao đổi và viết spec, plan, report bằng ngôn ngữ người dùng đang dùng.
