# Dev Workflow cho Claude Code

Plugin quy trình phát triển cho Claude Code, dùng cho dự án chỉ FE, chỉ BE hoặc fullstack. Chạy trên [superpowers](https://github.com/obra/superpowers). [English](README.md)

Claude đưa mỗi tính năng qua 6 bước. Bạn duyệt spec, plan và báo cáo cuối; phần còn lại Claude làm:

```
P1 Spec         tiêu chí nghiệm thu + danh sách rủi ro (race? tải? hiệu năng?)  ◆ bạn duyệt
P2 Plan         task [BE]/[FE]/[CONTRACT] + TEST-PLAN viết trước khi code       ◆ bạn duyệt
P3 Build        TDD từng task → review → sửa
P4 Tích hợp     UI bằng Chrome DevTools MCP → lưu thành test Playwright ─┐ lỗi → vòng sửa
P5 Hardening    race condition · tải (k6) · Lighthouse                   ─┘ tối đa 3 vòng/bug
P6 Tổng kết     kiểm chứng + code review + REPORT.md + pull request         ◆ bạn duyệt
```

- **Chế độ nhanh** cho việc nhỏ: spec và plan ngay trong chat, vẫn TDD và kiểm tra UI/API.
- Kịch bản UI đã pass được ghi thành **test Playwright**, CI chạy lại mãi.
- P6 tự mở **PR/MR** kèm bằng chứng test.
- Trạng thái lưu trong repo (`status.json`); `/dev-workflow:status` và lời nhắc khi mở phiên mới cho biết việc gì đang chờ bạn.
- Dashboard claude.ai (tuỳ chọn).

Xem [ví dụ chạy mẫu](examples/vi/README.md) · thử [cửa hàng demo](demo/README.md).

## Cài đặt

Cần Claude Code và `git`.

### Terminal (CLI)

```
/plugin install superpowers@claude-plugins-official
/plugin marketplace add quanghoath/dev-workflow
/plugin install dev-workflow@dev-workflow
```

Nếu không tìm thấy superpowers: `/plugin marketplace add obra/superpowers-marketplace` rồi `/plugin install superpowers@superpowers-marketplace`.

### Extension VS Code (Manage plugins)

1. Trong khung Claude Code, gõ `/plugins` để mở **Manage plugins**.
2. Tab **Marketplaces** → dán `quanghoath/dev-workflow` (hoặc `https://github.com/quanghoath/dev-workflow.git`) rồi thêm.
3. Tab **Plugins** → tìm `dev-workflow` → **Install** → chọn **Install for you** (mọi dự án của bạn) hoặc **Install for this project**.
4. Chưa có **superpowers** thì cài tương tự (có trong marketplace chính thức, hoặc thêm `obra/superpowers-marketplace`).

Cài xong là dùng được ngay trong các phiên đang mở. Muốn bật tự cập nhật: mở terminal chạy `/plugin` → **Marketplaces** → `dev-workflow` → **Enable auto-update**.

## Sử dụng

1. Mở repo dự án, gõ `/dev-workflow:init`. Claude nhận diện FE/BE/fullstack, chạy thử lệnh build/test, hỏi có thêm Playwright và dùng dashboard không.
2. Commit các file Claude tạo. Dev khác clone repo, bấm **Trust** là có plugin.
3. Làm tính năng: *"làm tính năng X theo dev-workflow"* hoặc `/dev-workflow:run <mô tả>`. Việc nhỏ thì Claude đề xuất chế độ nhanh.
4. Xem tiến độ, tiếp tục việc dở: `/dev-workflow:status`.

## Dashboard (tuỳ chọn)

- Lúc init chọn **tạo mới**, **dán link có sẵn**, hoặc **không dùng**.
- Muốn Claude của người khác ghi vào: share quyền **Editor**. Người ở ngoài tổ chức claude.ai của bạn hiện không ghi được dù có quyền Editor; khi đó dùng chung gói claude.ai Team hoặc mỗi người một dashboard. Trạng thái luôn có đủ trong repo.
- Không bật link public cho dashboard.

## Tài liệu tiếng Việt

| File | Nội dung |
|---|---|
| [02-quy-trinh.md](plugins/dev-workflow/reference/vi/02-quy-trinh.md) | Chi tiết P0–P6, chế độ nhanh, vòng sửa lỗi, khi nào Claude dừng chờ bạn |
| [04-quy-trinh-test.md](plugins/dev-workflow/reference/vi/04-quy-trinh-test.md) | Test từng bước: unit, API, UI, Playwright, race, tải, hiệu năng |
| [01-ho-so-du-an.md](plugins/dev-workflow/reference/vi/01-ho-so-du-an.md) | Công cụ test theo stack và ngưỡng mặc định |
| [03-dashboard.md](plugins/dev-workflow/reference/vi/03-dashboard.md) | Dữ liệu trạng thái và cách Claude cập nhật dashboard |
| [templates/vi/](plugins/dev-workflow/templates/vi/) | Mẫu spec, TEST-PLAN, BUG, REPORT, PR, config |

## Đóng góp

Sửa trong `plugins/dev-workflow/`, tăng `version` trong `plugin.json`, gửi Pull Request trên [GitHub](https://github.com/quanghoath/dev-workflow). Lịch sử: [CHANGELOG.md](CHANGELOG.md). Giấy phép: [MIT](LICENSE).
