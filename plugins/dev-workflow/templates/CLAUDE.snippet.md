## Development workflow (dev-workflow)

This repo follows the `dev-workflow` plugin. Every feature or non-trivial bug fix must go through the `dev-workflow:run` skill (P1 spec → P2 plan + TEST-PLAN → P3 TDD build → P4 integration → P5 hardening → P6 wrap-up; the user approves at P1, P2 and P6).

- Project config (profile, build/test commands, URLs, environments allowed for testing): `docs/workflow-config.md`.
- Small tasks use quick mode (see the conditions in the workflow). Check progress: `dev-workflow:status`.
- Specs/plans: `docs/superpowers/specs|plans/`. Per-feature status: `docs/superpowers/runs/<slug>/status.json`. Test scenarios, bugs, evidence, reports: `docs/superpowers/runs/<slug>/`.
- Update the dashboard on every phase change and every stop. Each bug gets at most 3 fix loops. Never run P4/P5 against production.
- Reply and write specs, plans and reports in the user's language; Vietnamese templates are in the plugin's templates/vi/.
