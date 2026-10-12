# Workflow config

> Theo plugin `dev-workflow` (skill `dev-workflow:init` tạo file này). Mọi lệnh dưới đây phải đã chạy thử thành công ở P0. Chưa có thì ghi `none — lý do`.

```yaml
project: my-project            # kebab-case, dùng làm id trên dashboard
name: My Project
profile: FULLSTACK             # FE | BE | FULLSTACK
stack: "React + Vite / ASP.NET Core 8 + SQL Server"
spec_repo: .                   # repo chứa spec/plan; FE tách repo thì trỏ sang repo BE
dashboard_url:                 # link https://claude.ai/artifact/... | none = không dùng dashboard

# --- BE (bỏ nếu profile = FE) ---
be_build: dotnet build Api.sln -nologo -v q
be_unit_test: dotnet test Api.Tests -nologo
be_run: dotnet run --project src/Api
be_url: http://localhost:5000
be_health: http://localhost:5000/health
be_test_auth: "POST /api/auth/login với tài khoản test ghi ở .env.test (không commit)"
db_check: "sqlcmd / mcp mssql profile dev"   # cách truy vấn kiểm tra bất biến

# --- FE (bỏ nếu profile = BE) ---
fe_build: npm run build
fe_unit_test: npm test
fe_lint: npm run lint
fe_run: npm run dev
fe_url: http://localhost:5173
fe_test_login: "tài khoản test ở .env.test"

# --- P5 ---
race_tool: k6                  # hoặc đường dẫn script song song sẵn có
load_tool: k6
environments:
  allowed: [local, dev]        # nơi được chạy P4/P5
  forbidden: [prod]

# --- Ngưỡng riêng (bỏ trống = dùng mặc định của kit) ---
thresholds:
  api_p95_ms: 500
  error_rate: 0.01
  lighthouse_perf: 80
```

## Ghi chú riêng của dự án

- (ví dụ: envelope `{status, message, data}`, `status=2000` là thành công; HTTP luôn 200)
