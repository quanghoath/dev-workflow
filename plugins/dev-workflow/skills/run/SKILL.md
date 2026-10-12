---
name: run
description: Chạy một tính năng hoặc sửa lỗi không tầm thường qua quy trình dev-workflow P1–P6 - spec, plan + TEST-PLAN, build TDD, kiểm tra tích hợp (Chrome DevTools MCP / API e2e), hardening (race, tải, hiệu năng), tổng kết - và cập nhật dashboard sau mỗi bước. Dùng khi người dùng yêu cầu làm tính năng "theo dev-workflow", hoặc khi repo có docs/workflow-config.md và người dùng yêu cầu xây hoặc thay đổi tính năng.
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

1. Tạo todo cho P1–P6 ngay khi bắt đầu; tính năng đang dở thì tiếp tục từ bước chưa xong (xem dashboard và thư mục `runs/<slug>/`).
2. Không vượt cổng ◆ khi chưa có câu trả lời đồng ý của người dùng cho đúng tài liệu đó.
3. Kịch bản test (TEST-PLAN) viết ở P2, trước khi code.
4. Không kết luận `pass` khi chưa thấy output thật.
5. Không chạy P4/P5 trên môi trường `forbidden` trong config (mặc định là prod).
6. **Cập nhật dashboard** mỗi lần chuyển bước, đến cổng, mở hoặc đóng bug, và khi dừng (`ArtifactData`: `get` → `update` với `if_version`). Ghi dashboard thất bại thì báo một lần rồi tiếp tục công việc; không được bỏ việc vì dashboard.
7. FULLSTACK: `[CONTRACT]` → `[BE]` → API e2e pass → `[FE]`.
