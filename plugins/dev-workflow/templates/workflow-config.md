# Workflow config

> Follows the `dev-workflow` plugin (the `dev-workflow:init` skill creates this file). Every command below must have been run successfully at P0. If there is none, write `none — reason`.

```yaml
project: my-project            # kebab-case, used as the id on the dashboard
name: My Project
profile: FULLSTACK             # FE | BE | FULLSTACK
stack: "React + Vite / ASP.NET Core 8 + SQL Server"
spec_repo: .                   # repo holding specs/plans; if the FE is a separate repo, point to the BE repo
dashboard_url:                 # https://claude.ai/artifact/... link | none = no dashboard

# --- BE (omit if profile = FE) ---
be_build: dotnet build Api.sln -nologo -v q
be_unit_test: dotnet test Api.Tests -nologo
be_run: dotnet run --project src/Api
be_url: http://localhost:5000
be_health: http://localhost:5000/health
be_test_auth: "POST /api/auth/login with the test account in .env.test (not committed)"
db_check: "sqlcmd / mcp mssql profile dev"   # how to query when checking invariants

# --- FE (omit if profile = BE) ---
fe_build: npm run build
fe_unit_test: npm test
fe_lint: npm run lint
fe_run: npm run dev
fe_url: http://localhost:5173
e2e_framework: playwright      # playwright | none
e2e_dir: e2e
e2e_test: npx playwright test
fe_test_login: "test account in .env.test"

# --- P6: create PR/MR ---
pr_tool: gh                    # gh (GitHub) | glab (GitLab) | none
pr_base: main
test_guide: claude             # acceptance test guide for BA/QA: claude (page on claude.ai) | repo (TEST-GUIDE.md) | none

# --- P5 ---
race_tool: k6                  # or the path to an existing concurrency script
load_tool: k6
environments:
  allowed: [local, dev]        # where P4/P5 may run
  forbidden: [prod]

# --- Project-specific thresholds (leave empty = use the kit defaults) ---
thresholds:
  api_p95_ms: 500
  error_rate: 0.01
  lighthouse_perf: 80
```

## Project-specific notes

- (e.g. envelope `{status, message, data}`, `status=2000` means success; HTTP is always 200)
