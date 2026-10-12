# dev-workflow

Plugin Claude Code cho quy trình phát triển dùng chung mọi dự án (chỉ FE, chỉ BE, hoặc FULLSTACK), chạy trên superpowers. Trạng thái hiển thị trên một dashboard claude.ai do chính team bạn tạo.

```
P0 KHỞI TẠO (1 lần/dự án)  /dev-workflow:init
P1 SPEC                    brainstorming + tiêu chí nghiệm thu + rủi ro      ◆ duyệt
P2 PLAN + TEST-PLAN        writing-plans, task [BE]/[FE]/[CONTRACT]          ◆ duyệt
P3 BUILD                   TDD từng task → review → sửa
P4 TÍCH HỢP                FE: Chrome DevTools MCP · BE: API e2e  ─┐ lỗi → BUG → P3
P5 HARDENING               race · tải · hiệu năng (theo rủi ro)   ─┘ tối đa 3 vòng/bug
P6 TỔNG KẾT                verify + code review + REPORT.md                  ◆ duyệt
```

## Cài đặt

Yêu cầu: Claude Code, plugin **superpowers**, và `git`. Repo này public nên không cần tài khoản GitLab.

**Cách 1 — tự động theo dự án (khuyên dùng cho team).** Repo dự án đã chạy `/dev-workflow:init` có sẵn `.claude/settings.json` khai báo plugin. Dev chỉ cần clone repo, mở Claude Code, bấm **Trust** thư mục; plugin tự được tải và tự cập nhật. Nếu thấy thông báo "Plugins changed", chạy `/reload-plugins`.

**Cách 2 — cài tay cho một máy** (dùng ở mọi repo, kể cả repo chưa init):

```
/plugin marketplace add https://gitlab.com/beesky/dev-workflow.git
/plugin install dev-workflow@dev-workflow
```

Bật tự cập nhật: `/plugin` → tab **Marketplaces** → `dev-workflow` → **Enable auto-update**. Nếu không bật, cập nhật tay:

```
/plugin marketplace update dev-workflow
/plugin update dev-workflow@dev-workflow
```

## Dashboard và quyền

- Khi chạy `/dev-workflow:init`, Claude hỏi: **dùng dashboard có sẵn** (dán link), **tạo dashboard mới** (publish trang mới thuộc tài khoản claude.ai của bạn), hoặc **không dùng**. Link được ghi vào `dashboard_url` trong `docs/workflow-config.md` và commit theo repo, nên cả team dùng chung một dashboard mà không phải hỏi lại.
- Team dùng chung một dashboard cho nhiều dự án: lần init đầu tạo mới, các dự án sau dán link đó vào.
- Ai cần Claude **ghi** trạng thái thì tài khoản claude.ai của người đó phải có quyền **Editor** trên dashboard. Viewer chỉ xem được. Dev cùng tổ chức claude.ai: share cho tổ chức với quyền Editor. Dev dùng tài khoản cá nhân: mời từng email với quyền Editor.
- **Không bật link public cho dashboard.** Người vào bằng link chỉ xem được, và khi bật link thì các Editor ngoài tổ chức bị mất quyền ghi.

## Dùng trong một dự án

1. Mở repo, chạy `/dev-workflow:init`. Claude nhận diện hồ sơ, tạo `docs/workflow-config.md`, chạy thử lệnh build/test, thêm đoạn quy trình vào `CLAUDE.md`, tạo `.claude/settings.json` cho team, chọn hoặc tạo dashboard, và đăng ký dự án lên dashboard.
2. Commit 3 file đó (`docs/workflow-config.md`, `CLAUDE.md`, `.claude/settings.json`). Dev khác clone về là có plugin.
3. Làm tính năng: *"làm tính năng X theo dev-workflow"* hoặc `/dev-workflow:run <mô tả>`.

## Cấu trúc repo

```
.claude-plugin/marketplace.json          # repo này là marketplace
plugins/dev-workflow/
├── .claude-plugin/plugin.json           # tăng "version" mỗi lần phát hành
├── skills/init/SKILL.md                 # P0
├── skills/run/SKILL.md                  # P1–P6
├── reference/
│   ├── 01-ho-so-du-an.md                # hồ sơ FE/BE/FULLSTACK, công cụ test, ngưỡng
│   ├── 02-quy-trinh.md                  # chi tiết P0–P6, vòng phản hồi, khi nào dừng
│   ├── 03-dashboard.md                  # cấu trúc dữ liệu dashboard, cách ghi
│   └── 04-quy-trinh-test.md             # test từng bước: unit, API, UI (Chrome DevTools MCP), race, tải, hiệu năng
├── dashboard/index.html                 # mã nguồn trang dashboard; init dùng file này khi "tạo dashboard mới"
└── templates/                           # workflow-config, CLAUDE.snippet, claude-settings.json, spec-addendum, TEST-PLAN, BUG, REPORT
```

## Phát hành thay đổi

1. Sửa file trong `plugins/dev-workflow/`.
2. Tăng `version` trong `plugins/dev-workflow/.claude-plugin/plugin.json` (không tăng thì các máy giữ bản cũ).
3. `claude plugin validate .` → commit → merge vào `main`. Mọi máy bật auto-update sẽ nhận bản mới, nên chỉ merge bản đã thử.

Sửa giao diện dashboard: sửa `plugins/dev-workflow/dashboard/index.html`. Dashboard đã tạo không tự đổi; muốn cập nhật thì nhờ Claude publish lại vào **đúng URL** của dashboard đó (xem `reference/03-dashboard.md`). Dữ liệu được giữ nguyên.

## Cấu trúc trong mỗi dự án

```
<repo>/
├── CLAUDE.md                                  # có đoạn dev-workflow
└── docs/
    ├── workflow-config.md                     # hồ sơ + lệnh + URL + môi trường được test
    └── superpowers/
        ├── specs/YYYY-MM-DD-<slug>-design.md
        ├── plans/YYYY-MM-DD-<slug>.md
        └── runs/<slug>/
            ├── TEST-PLAN.md
            ├── bugs/BUG-001.md …
            ├── evidence/
            └── REPORT.md
```
