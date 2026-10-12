# 01 · Project profiles

Each project declares a profile in `docs/workflow-config.md`. The profile decides which steps run and which tools run them.

## Three profiles

| Step | FE | BE | FULLSTACK |
|---|---|---|---|
| P1 Spec | ✔ | ✔ | ✔ — includes an **API contract** section (endpoints, request, response, error codes) |
| P2 Plan | `[FE]` tasks | `[BE]` tasks | `[CONTRACT]` → `[BE]` → `[FE]` |
| P3 Unit test | component/hook/logic tests | service/handler tests | both |
| P4 Integration | Chrome DevTools MCP | API e2e (`.http` / script) | API e2e first, then Chrome DevTools MCP against the real BE |
| P5 Race | double-submit, responses arriving out of order | parallel requests + DB invariant checks | both |
| P5 Load | Lighthouse + performance trace | k6 | k6 + Lighthouse |
| P6 Report | ✔ | ✔ | ✔ |

Order in FULLSTACK: the API contract is approved in the spec → the BE is finished and passes API e2e → only then does the FE call the real BE. The FE may use mocks **only** in unit tests.

## Detecting the profile (P0)

| Signal in the repo | Profile |
|---|---|
| Has `vite.config.*`, `next.config.*`, `app.json` (Expo), `angular.json`… and no custom-written server | FE |
| Has `*.csproj`, `go.mod`, `pom.xml`, an Express/Nest/FastAPI server… and no UI | BE |
| Has both in the same repo, or the FE in this repo calls a BE written by the same team in another repo | FULLSTACK |

FE and BE in **two separate repos**: each repo has its own `workflow-config.md`, but the feature uses **one shared slug**, and the spec/plan live in the BE repo (where the API contract is defined). The FE repo sets `spec_repo:` to point to the BE repo.

## Default test tools by stack

Record these in `workflow-config.md`. If the project already uses other tools, use the existing ones.

| Stack | Unit test | Integration | Race / load |
|---|---|---|---|
| React / Vite / TanStack | vitest + Testing Library | Chrome DevTools MCP | Chrome DevTools MCP (double-submit), Lighthouse |
| Next.js | vitest or jest | Chrome DevTools MCP | same as above + k6 for API routes |
| Expo / React Native | jest + RNTL | Chrome DevTools MCP on the web build (`expo start --web`) if available; otherwise state "manual check" explicitly | — |
| ASP.NET Core | xUnit (+ WebApplicationFactory if possible) | `.http` (REST Client) or a PowerShell / bash script | k6, parallel script |
| Node (Express/Nest) | vitest / jest + supertest | supertest or `.http` | k6 or autocannon |
| Python (FastAPI/Django) | pytest | pytest + httpx | k6 or locust |

**Project with no test project yet** (for example an old .NET API): P3 creates a test project in the first task, if allowed. If the reviewer does not allow adding a test project, add the line `unit_test: none — reason` to `workflow-config.md` and move the checks to API e2e in P4. Never skip this silently.

## Default thresholds

Use these when the spec does not set its own thresholds.

| Metric | Threshold |
|---|---|
| API p95 latency | < 500 ms |
| Error rate under load | < 1 % |
| Lighthouse Performance (desktop) | ≥ 80 |
| Lighthouse Accessibility | ≥ 90 |
| LCP / CLS | < 2.5 s / < 0.1 |
| Console errors (error level) on the main flow | 0 |
| Unexpected 4xx/5xx requests | 0 |
