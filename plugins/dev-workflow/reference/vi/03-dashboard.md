# 03 · Dashboard trạng thái

Dashboard là một trang trên claude.ai. Trang chỉ hiển thị; Claude là bên ghi dữ liệu qua tool `ArtifactData`. Một dashboard dùng được cho nhiều dự án: mỗi team thường dùng chung một trang.

- **URL:** lấy từ `dashboard_url` trong `docs/workflow-config.md` của dự án. Plugin không có URL mặc định.
  - `dashboard_url: none` → bỏ mọi bước cập nhật dashboard; quy trình vẫn chạy đủ.
  - Thiếu hoặc trống → chạy `dev-workflow:init` để chọn (xem mục "Chọn hoặc tạo dashboard").
- **Quyền:** mọi người được chia sẻ đều đọc được. Chỉ **Owner/Editor** ghi được (rule `write: admin`). Tài khoản claude.ai trên máy nào cần ghi trạng thái thì phải được chia sẻ quyền **Editor**; Viewer và Contributor chỉ xem được. Không bật link public: người vào bằng link chỉ xem, và khi bật link thì các Editor ngoài tổ chức mất quyền ghi.
- **Mã nguồn trang:** `${CLAUDE_PLUGIN_ROOT}/dashboard/index.html`.

## Chọn hoặc tạo dashboard (ở P0)

Hỏi người dùng một câu, ba lựa chọn:

1. **Dùng dashboard có sẵn:** người dùng dán link `https://claude.ai/artifact/...`. Kiểm tra bằng `ArtifactData list` collection `projects` (đọc được là link đúng). Nếu bước ghi `projects/<project>` sau đó bị từ chối, báo người dùng cần xin quyền Editor từ chủ dashboard.
2. **Tạo dashboard mới** (thuộc tài khoản claude.ai đang dùng):
   1. Copy `${CLAUDE_PLUGIN_ROOT}/dashboard/index.html` vào thư mục scratchpad của phiên (tool Artifact chỉ publish file trong thư mục làm việc hoặc scratchpad).
   2. Publish bằng tool `Artifact`: `file_path` = bản copy, `icon: "kanban"`, `description: "Trạng thái các tính năng theo quy trình dev-workflow P1–P6"`, `capabilities: {"db": {"rules": [{"path": "", "read": "view", "write": "admin"}]}}`.
   3. Ghi URL trả về vào `dashboard_url`. Nhắc người dùng share trang cho team với quyền Editor (không bật link public).
3. **Không dùng dashboard:** ghi `dashboard_url: none`.

Không có tool `Artifact` / `ArtifactData` (ví dụ chưa đăng nhập claude.ai) thì chỉ còn lựa chọn 3, kèm ghi chú để bật sau.

**Cập nhật giao diện dashboard đã có:** publish lại bản `index.html` mới bằng tool `Artifact` với `url` = `dashboard_url` (đọc trang trước theo yêu cầu của tool). **Không** truyền `capabilities` để giữ rule cũ. Dữ liệu được giữ nguyên qua các lần publish. Không publish thành trang mới.

## Dữ liệu

Hai collection:

### `projects` — 1 document / dự án

`doc_id` = `project` trong `workflow-config.md` (kebab-case, ví dụ `shop-api`).

```json
{
  "name": "Shop API",
  "profile": "BE",               // FE | BE | FULLSTACK
  "repo": "gitlab.com/acme/shop-api",
  "stack": "ASP.NET Core 8 + SQL Server",
  "updatedAt": "2026-10-12T09:30:00+07:00"
}
```

### `features` — 1 document / tính năng

`doc_id` = `<project>--<slug>` (ví dụ `shop-api--dat-hang`).

```json
{
  "project": "shop-api",
  "slug": "dat-hang",
  "mode": "full",                // full | quick (xem 02-quy-trinh.md)
  "title": "Đặt hàng và trừ tồn kho",
  "phase": "P3",                 // P1..P6
  "status": "in_progress",       // xem bảng trạng thái
  "summary": "Đang làm task 4/9: OrderService trừ tồn kho",   // 1 dòng, người đọc hiểu ngay
  "specPath": "docs/superpowers/specs/2026-10-12-dat-hang-design.md",
  "planPath": "docs/superpowers/plans/2026-10-12-dat-hang.md",
  "branch": "feat/dat-hang",
  "gates": {                     // thời điểm người duyệt đồng ý
    "spec": "2026-10-12T10:00:00+07:00",
    "plan": null,
    "report": null
  },
  "tasks": [
    { "id": "T1", "title": "Bảng orders + order_items", "tag": "BE", "status": "done" }
  ],
  "tests": {                     // cập nhật sau mỗi lượt chạy
    "unit":  { "pass": 42, "fail": 0 },
    "p4":    { "pass": 6, "fail": 1, "warn": 1, "total": 8 },
    "p5":    [ { "id": "R-1", "name": "20 request mua sản phẩm còn 1", "result": "pass", "metric": "1/20 thành công" } ]
  },
  "bugs": [
    { "id": "BUG-001", "title": "Double-submit tạo 2 đơn", "status": "open", "loop": 1 }
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

Nguồn dữ liệu là file `docs/superpowers/runs/<slug>/status.json` trong repo (cùng cấu trúc với document trên). Luôn cập nhật file này trước, rồi đồng bộ nguyên file lên dashboard:

1. **Tính năng mới:** `set` với `collection: "features"`, `doc_id: "<project>--<slug>"`, `file_path` = đường dẫn `status.json` (chưa tồn tại nên không cần `if_version`).
2. **Cập nhật:** `get` document đó để lấy `version`, rồi `set` với `file_path` = `status.json` và `if_version` = version vừa đọc.
   - Với `log`: thêm mục mới vào `status.json` rồi cắt còn 50 mục trước khi đồng bộ.
3. Bị từ chối vì version đã đổi: `get` lại rồi ghi lại. Không ghi đè mù.
4. Bị từ chối vì quyền (với Editor ngoài tổ chức claude.ai thì lỗi này luôn xảy ra): báo người dùng một lần trong phiên, rồi tiếp tục công việc. `status.json` vẫn đầy đủ.
5. `projects/<project>`: tạo ở P0 (`dev-workflow:init`), cập nhật khi hồ sơ hoặc stack đổi.

Chỉ đưa vào dashboard tóm tắt và số liệu. Nội dung chi tiết (spec, bug, bằng chứng) nằm trong repo, dashboard chỉ ghi đường dẫn. **Không ghi secret, token, connection string hay dữ liệu khách hàng thật.**
