---
name: init
description: Thiết lập một repo để chạy theo dev-workflow (bước P0) - nhận diện hồ sơ FE/BE/FULLSTACK, tạo docs/workflow-config.md, chạy thử lệnh build/test, thêm đoạn quy trình vào CLAUDE.md, cấu hình .claude/settings.json để cả team tự có plugin, đăng ký dự án lên dashboard. Dùng khi người dùng nói "init dev-workflow", "thiết lập quy trình cho dự án này", hoặc khi chạy dev-workflow:run mà repo chưa có docs/workflow-config.md.
---

# dev-workflow · P0 Khởi tạo dự án

Tài liệu gốc (đọc khi cần chi tiết):
- Hồ sơ dự án và công cụ test theo stack: `${CLAUDE_PLUGIN_ROOT}/reference/01-ho-so-du-an.md`
- Dashboard: `${CLAUDE_PLUGIN_ROOT}/reference/03-dashboard.md`

## Các bước

Tạo một todo cho mỗi bước dưới đây.

1. **Đọc repo:** `CLAUDE.md`, `README`, file manifest (`package.json`, `*.csproj`, `go.mod`, `pyproject.toml`…), thư mục test có sẵn, `.mcp.json`.
2. **Nhận diện hồ sơ** FE / BE / FULLSTACK theo bảng trong `01-ho-so-du-an.md`. Nếu không chắc, hỏi người dùng (một câu, kèm lựa chọn).
3. **Tạo `docs/workflow-config.md`** từ `${CLAUDE_PLUGIN_ROOT}/templates/workflow-config.md`. Điền lệnh thật của repo, không để lại giá trị ví dụ.
4. **Chạy thử từng lệnh** `*_build`, `*_unit_test`, `*_lint` (và khởi động `*_run` rồi gọi `be_health` / mở `fe_url` nếu môi trường cho phép). Lệnh nào chạy được thì giữ lại. Lệnh nào hỏng hoặc chưa có thì ghi `none — <lý do>`. Không sửa code của repo ở bước này.
5. **Kiểm tra công cụ:**
   - Hồ sơ có FE: Chrome DevTools MCP có sẵn (tool `mcp__chrome-devtools__*`). Nếu chưa có, đề xuất thêm vào `.mcp.json`:
     `{"mcpServers":{"chrome-devtools":{"command":"npx","args":["-y","chrome-devtools-mcp@latest"]}}}`
   - Có khả năng cần P5: `k6 version`. Nếu chưa có, ghi chú cách cài (`winget install k6` / `brew install k6`), không tự cài.
6. **Thêm đoạn quy trình** từ `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.snippet.md` vào cuối `CLAUDE.md` của repo (tạo file nếu chưa có). Nếu đã có thì bỏ qua.
7. **Cấu hình plugin cho cả team:** để dev khác clone repo về là có plugin.
   - Chưa có `.claude/settings.json`: tạo file từ `${CLAUDE_PLUGIN_ROOT}/templates/claude-settings.json`.
   - Đã có: chỉ thêm khoá `extraKnownMarketplaces.dev-workflow` và `enabledPlugins["dev-workflow@dev-workflow"]`, giữ nguyên mọi khoá khác (permissions, hooks…).
   - Không sửa `.claude/settings.local.json` (file cá nhân, không commit).
   - Nếu `.gitignore` đang bỏ qua `.claude/`, báo người dùng: file này phải được commit.
8. **Đăng ký dashboard:** dùng tool `ArtifactData`, `set` document `projects/<project>` theo `03-dashboard.md` (kèm `name`, `profile`, `repo`, `stack`, `updatedAt`). Nếu bị từ chối vì quyền: báo người dùng rằng tài khoản này cần được chia sẻ quyền **Editor** trên dashboard. Không chặn các bước còn lại vì lỗi này.
9. **Báo cáo:** hồ sơ đã chọn, các lệnh đã chạy được hoặc chưa, các file đã tạo hoặc sửa, việc người dùng cần làm (cài k6, chia sẻ quyền…). Hỏi trước khi commit.
