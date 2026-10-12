---
name: status
description: Show where every dev-workflow feature in this repo stands - mode, current step, tasks, tests, open bugs, what is blocking and the next action - read from docs/superpowers/runs/*/status.json, no dashboard needed. Use when the user asks "status", "đang làm tới đâu", "tiếp tục tính năng dở", or opens a new session on a repo that uses dev-workflow. / Xem tiến độ các tính năng.
---

# dev-workflow · Xem tiến độ

Chỉ đọc. Không sửa file, không ghi dashboard.

## Các bước

1. Đọc `docs/workflow-config.md` (tên dự án, `dashboard_url`). Không có file này thì báo repo chưa init và gợi ý `/dev-workflow:init`.
2. Liệt kê `docs/superpowers/runs/*/status.json`. Với mỗi file, lấy `title`, `mode`, `phase`, `status`, `summary`, số task xong / tổng, `tests`, bug chưa đóng (`status` khác `fixed` và `accepted`), `blockedReason`, `updatedAt`.
   - Thư mục `runs/<slug>/` có nhưng thiếu `status.json` (tính năng làm trước v1.4): suy ra bước từ file có mặt — chỉ có spec → P1; có plan + `TEST-PLAN.md` → P2/P3 (đếm checkbox `- [x]` trong plan); `TEST-PLAN.md` có cột Kết quả đã điền → P4/P5; có `REPORT.md` → P6. Ghi rõ là "suy ra".
3. Nếu người dùng hỏi một tính năng cụ thể (slug hoặc tên): đọc thêm plan, `TEST-PLAN.md`, `bugs/*.md` của tính năng đó.
4. Trả lời ngắn, theo thứ tự cần người dùng trước:
   - **Cần bạn:** tính năng `waiting_review` (đang chờ duyệt gì) và `blocked` (lý do).
   - **Đang làm:** `in_progress`, bước hiện tại, task x/y, bug mở.
   - **Xong gần đây:** `done` trong 7 ngày.
   - Mỗi tính năng chưa xong kèm **bước tiếp theo** và câu lệnh để tiếp tục, ví dụ `/dev-workflow:run tiếp tục <slug>`.
   - Có `dashboard_url` khác `none` thì kèm link.
5. Không có tính năng nào: nói vậy và gợi ý `/dev-workflow:run <mô tả>`.
