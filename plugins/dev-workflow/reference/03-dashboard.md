# 03 · Dashboard trạng thái

Một trang dashboard duy nhất trên claude.ai cho **mọi dự án**. Trang chỉ hiển thị; Claude là bên ghi dữ liệu qua tool `ArtifactData`. Người xem cần link và quyền xem.

- **URL dashboard:** https://claude.ai/artifact/JxMFAyhzfHEk5nMrwo1SgU. Đây là giá trị mặc định; `dashboard_url` trong `workflow-config.md` có thể đổi sang dashboard khác.
- Quyền: mọi người được chia sẻ đều đọc được. Chỉ **Owner/Editor** ghi được (rule `write: admin`). Tài khoản Claude trên máy nào cần ghi trạng thái thì phải được chia sẻ quyền **Editor**; Viewer và Contributor chỉ xem được.
- Mã nguồn trang: `dashboard/index.html` trong repo plugin. Publish lại vào đúng URL trên, không tạo trang mới.

## Dữ liệu

Hai collection:

### `projects` — 1 document / dự án

`doc_id` = `project` trong `workflow-config.md` (kebab-case, ví dụ `poker-api`).

```json
{
  "name": "Poker API",
  "profile": "BE",               // FE | BE | FULLSTACK
  "repo": "gitlab.com/x/poker-api",
  "stack": ".NET 7 + Dapper + SQL Server",
  "updatedAt": "2026-10-12T09:30:00+07:00"
}
```

### `features` — 1 document / tính năng

`doc_id` = `<project>--<slug>` (ví dụ `poker-api--buyin-thanh-toan`).

```json
{
  "project": "poker-api",
  "slug": "buyin-thanh-toan",
  "title": "Buyin qua thanh toán tài khoản ảo",
  "phase": "P3",                 // P1..P6
  "status": "in_progress",       // xem bảng trạng thái
  "summary": "Đang làm task 4/9: BuyinCoreService",   // 1 dòng, người đọc hiểu ngay
  "specPath": "docs/superpowers/specs/2026-10-12-buyin-thanh-toan-design.md",
  "planPath": "docs/superpowers/plans/2026-10-12-buyin-thanh-toan.md",
  "branch": "feat/buyin-thanh-toan",
  "gates": {                     // thời điểm người duyệt đồng ý
    "spec": "2026-10-12T10:00:00+07:00",
    "plan": null,
    "report": null
  },
  "tasks": [
    { "id": "T1", "title": "Bảng kmBuyinThanhToan", "tag": "BE", "status": "done" }
  ],
  "tests": {                     // cập nhật sau mỗi lượt chạy
    "unit":  { "pass": 42, "fail": 0 },
    "p4":    { "pass": 6, "fail": 1, "warn": 1, "total": 8 },
    "p5":    [ { "id": "R-1", "name": "2 request cùng ghế", "result": "pass", "metric": "1/20 thành công" } ]
  },
  "bugs": [
    { "id": "BUG-001", "title": "Double-submit tạo 2 buyin", "status": "open", "loop": 1 }
  ],
  "loops": 1,                    // số lần quay về P3 từ P4/P5
  "blockedReason": null,
  "report": null,                // P6: tóm tắt 3–5 dòng
  "log": [                       // nhật ký, giữ tối đa 50 mục mới nhất
    { "at": "2026-10-12T11:20:00+07:00", "phase": "P4", "kind": "bug", "text": "BUG-001 mở: double-submit" }
  ],
  "updatedAt": "2026-10-12T11:20:00+07:00"
}
```

`log[].kind`: `phase` · `gate` · `task` · `test` · `bug` · `blocked` · `note`.

Nhật ký nằm ngay trong document tính năng, không tách thành collection riêng: kho dữ liệu giới hạn 25.000 document cho mỗi artifact, nên không tạo một document cho mỗi sự kiện.

## Trạng thái (`status`)

| status | Nghĩa | Dashboard hiển thị |
|---|---|---|
| `todo` | đã tạo, chưa làm | xám |
| `in_progress` | agent đang làm | xanh dương |
| `waiting_review` | chờ người duyệt ở cổng ◆ | vàng — **cần bạn** |
| `blocked` | BUG hết 3 vòng, thiếu môi trường hoặc `needs_redesign` | đỏ — **cần bạn** |
| `done` | đã qua P6 | xanh lá |

Trạng thái task: `todo` · `in_progress` · `done`. Bug: `open` · `fixed` · `blocked` · `needs_redesign` · `accepted` (warn được chấp nhận). Kết quả P5: `pass` · `fail` · `warn`.

## Khi nào cập nhật

| Sự kiện | Ghi |
|---|---|
| Bắt đầu bước mới | `phase`, `status`, `summary` + log `phase` |
| Đến cổng ◆ | `status=waiting_review` + log `gate` |
| Người duyệt đồng ý | `gates.<x>` + log `gate` |
| Task xong | `tasks`, `summary` |
| Chạy test xong | `tests.*` + log `test` |
| Mở/đóng bug | `bugs`, `loops` + log `bug` |
| Dừng | `status=blocked`, `blockedReason` + log `blocked` |
| P6 xong | `status=done`, `report`, `gates.report` |

Tối thiểu: mỗi lần chuyển bước và mỗi lần dừng. Không cập nhật cho từng lệnh nhỏ.

## Cách Claude ghi

Dùng tool `ArtifactData` với `url` = `dashboard_url`.

1. **Tính năng mới:** `set` vào `collection: "features"`, `doc_id: "<project>--<slug>"` (chưa tồn tại nên không cần `if_version`).
2. **Cập nhật:** `get` document đó để lấy `version` và giá trị hiện tại, rồi `update` kèm `if_version`.
   - Object lồng nhau (`tests`, `gates`) được merge; **mảng (`tasks`, `bugs`, `log`, `tests.p5`) bị thay nguyên**, nên phải gửi lại cả mảng đã sửa. Với `log`: thêm mục mới rồi cắt còn 50 mục.
3. Bị từ chối vì version đã đổi: `get` lại rồi ghi lại. Không ghi đè mù.
4. Bị từ chối vì quyền: báo người dùng tài khoản này cần quyền **Editor** trên dashboard, rồi tiếp tục công việc.
5. `projects/<project>`: tạo ở P0 (`dev-workflow:init`), cập nhật khi hồ sơ hoặc stack đổi.

Chỉ đưa vào dashboard tóm tắt và số liệu. Nội dung chi tiết (spec, bug, bằng chứng) nằm trong repo, dashboard chỉ ghi đường dẫn. **Không ghi secret, token, connection string hay dữ liệu khách hàng thật.**
