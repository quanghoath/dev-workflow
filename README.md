# Dev Workflow for Claude Code

**Spec-to-ship workflow plugin for Claude Code.** Works for frontend-only, backend-only or full-stack projects. Built on [superpowers](https://github.com/obra/superpowers).

Claude takes each feature through 6 steps. You approve the spec, the plan and the final report; Claude does the rest:

```
P1 Spec         acceptance criteria + risk list (race? load? perf?)        ◆ you approve
P2 Plan         tasks [BE]/[FE]/[CONTRACT] + TEST-PLAN written before code ◆ you approve
P3 Build        TDD per task → review → fix
P4 Integration  UI via Chrome DevTools MCP · API end-to-end   ─┐ bug → fix loop
P5 Hardening    race conditions · load (k6) · Lighthouse       ─┘ max 3 rounds/bug
P6 Report       verification + code review + REPORT.md                    ◆ you approve
```

Small fix? **Quick mode** keeps TDD and UI/API checks but puts the spec and plan in chat. `/dev-workflow:status` shows where every feature stands. Optional: a live status board on claude.ai. See a full [example run](examples/README.md).

⭐ If this helps you, star the repo so others can find it. Issues and ideas are welcome.

---

## Cài đặt (3 bước)

Cần: Claude Code và `git`.

```
/plugin install superpowers@claude-plugins-official
/plugin marketplace add quanghoath/dev-workflow
/plugin install dev-workflow@dev-workflow
```

Bản sao trên GitLab: `https://gitlab.com/beesky/dev-workflow.git` (dùng thay cho dòng thứ 2 nếu cần). Nếu lệnh đầu không tìm thấy superpowers, dùng `/plugin marketplace add obra/superpowers-marketplace` rồi `/plugin install superpowers@superpowers-marketplace`.

## Sử dụng

1. Mở repo dự án, gõ `/dev-workflow:init`. Claude tự nhận diện dự án FE/BE/fullstack, ghi lệnh build/test, hỏi bạn có dùng dashboard không.
2. Commit các file Claude vừa tạo. Dev khác clone repo về, bấm **Trust** là có plugin, không cần cài.
3. Làm tính năng: *"làm tính năng X theo dev-workflow"* hoặc `/dev-workflow:run <mô tả>`. Việc nhỏ (sửa lỗi nhỏ, chỉnh UI) Claude sẽ đề xuất **chế độ nhanh**: spec và plan ngắn ngay trong chat, vẫn TDD và kiểm tra UI/API.
4. Xem tiến độ hoặc tiếp tục việc dở ở phiên mới: `/dev-workflow:status`.

Muốn xem đầu ra trông thế nào trước khi cài: [ví dụ chạy mẫu](examples/README.md).

## Dashboard (tuỳ chọn)

- Lúc init chọn **tạo mới** (trang claude.ai thuộc tài khoản của bạn), **dán link có sẵn**, hoặc **không dùng**.
- Muốn Claude của người khác ghi vào dashboard: share cho họ quyền **Editor**. Người ở **ngoài tổ chức claude.ai** của bạn hiện không ghi được, dù có quyền Editor; khi đó dùng chung gói claude.ai Team, hoặc mỗi người một dashboard.
- Không bật link public cho dashboard.

## Tài liệu

| File | Nội dung |
|---|---|
| [02-quy-trinh.md](plugins/dev-workflow/reference/02-quy-trinh.md) | Chi tiết P0–P6, vòng sửa lỗi, khi nào Claude dừng chờ bạn |
| [04-quy-trinh-test.md](plugins/dev-workflow/reference/04-quy-trinh-test.md) | Test từng bước: unit, API, UI, race, tải, hiệu năng |
| [01-ho-so-du-an.md](plugins/dev-workflow/reference/01-ho-so-du-an.md) | Công cụ test theo stack và ngưỡng mặc định |
| [03-dashboard.md](plugins/dev-workflow/reference/03-dashboard.md) | Dữ liệu dashboard và cách Claude cập nhật |
| [templates/](plugins/dev-workflow/templates/) | Mẫu spec, TEST-PLAN, BUG, REPORT, config |

## Đóng góp

Sửa trong `plugins/dev-workflow/`, tăng `version` trong `plugin.json`, gửi Pull Request trên [GitHub](https://github.com/quanghoath/dev-workflow). Lịch sử thay đổi: [CHANGELOG.md](CHANGELOG.md). Giấy phép: [MIT](LICENSE).
