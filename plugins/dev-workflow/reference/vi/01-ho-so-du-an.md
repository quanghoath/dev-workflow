# 01 · Hồ sơ dự án

Mỗi dự án khai báo một hồ sơ trong `docs/workflow-config.md`. Hồ sơ quyết định bước nào chạy và chạy bằng gì.

## Ba hồ sơ

| Bước | FE | BE | FULLSTACK |
|---|---|---|---|
| P1 Spec | ✔ | ✔ | ✔ — có mục **Hợp đồng API** (endpoint, request, response, mã lỗi) |
| P2 Plan | task `[FE]` | task `[BE]` | `[CONTRACT]` → `[BE]` → `[FE]` |
| P3 Unit test | test component/hook/logic | test service/handler | cả hai |
| P4 Tích hợp | Chrome DevTools MCP | API e2e (`.http` / script) | API e2e trước, rồi Chrome DevTools MCP trên BE thật |
| P5 Race | double-submit, response về sai thứ tự | request song song + kiểm tra bất biến DB | cả hai |
| P5 Tải | Lighthouse + performance trace | k6 | k6 + Lighthouse |
| P6 Tổng kết | ✔ | ✔ | ✔ |

Thứ tự trong FULLSTACK: hợp đồng API được duyệt ở spec → BE làm xong và qua API e2e → FE mới gọi vào BE thật. FE được dùng mock **chỉ** trong unit test.

## Nhận diện hồ sơ (P0)

| Dấu hiệu trong repo | Hồ sơ |
|---|---|
| Có `vite.config.*`, `next.config.*`, `app.json` (Expo), `angular.json`… và không có server tự viết | FE |
| Có `*.csproj`, `go.mod`, `pom.xml`, server Express/Nest/FastAPI… và không có UI | BE |
| Có cả hai trong cùng repo, hoặc FE trong repo này gọi BE do cùng team viết ở repo khác | FULLSTACK |

FE và BE nằm ở **hai repo khác nhau**: mỗi repo có `workflow-config.md` riêng, nhưng tính năng dùng **một slug chung**, và spec/plan đặt ở repo BE (nơi định nghĩa hợp đồng API). Repo FE ghi `spec_repo:` trỏ sang repo BE.

## Công cụ test mặc định theo stack

Ghi vào `workflow-config.md`. Nếu dự án đã có công cụ khác thì dùng công cụ sẵn có.

| Stack | Unit test | Tích hợp | Race / tải |
|---|---|---|---|
| React / Vite / TanStack | vitest + Testing Library | Chrome DevTools MCP | Chrome DevTools MCP (double-submit), Lighthouse |
| Next.js | vitest hoặc jest | Chrome DevTools MCP | như trên + k6 cho route API |
| Expo / React Native | jest + RNTL | Chrome DevTools MCP trên bản web (`expo start --web`) nếu có; nếu không thì ghi rõ "kiểm tra tay" | — |
| ASP.NET Core | xUnit (+ WebApplicationFactory nếu được) | `.http` (REST Client) hoặc script PowerShell / bash | k6, script song song |
| Node (Express/Nest) | vitest / jest + supertest | supertest hoặc `.http` | k6 hoặc autocannon |
| Python (FastAPI/Django) | pytest | pytest + httpx | k6 hoặc locust |

**Dự án chưa có project test** (ví dụ API .NET cũ): P3 tạo project test ở task đầu tiên nếu được phép. Nếu người duyệt không cho thêm project test, ghi trong `workflow-config.md` dòng `unit_test: none — lý do` và chuyển kiểm tra sang API e2e ở P4. Không được lặng lẽ bỏ qua.

## Ngưỡng mặc định

Dùng khi spec không ghi ngưỡng riêng.

| Chỉ số | Ngưỡng |
|---|---|
| API p95 latency | < 500 ms |
| Tỉ lệ lỗi khi tải | < 1 % |
| Lighthouse Performance (desktop) | ≥ 80 |
| Lighthouse Accessibility | ≥ 90 |
| LCP / CLS | < 2.5 s / < 0.1 |
| Lỗi console (error) trên luồng chính | 0 |
| Request 4xx/5xx ngoài dự kiến | 0 |
