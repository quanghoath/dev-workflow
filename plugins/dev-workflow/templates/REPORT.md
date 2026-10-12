# REPORT · <feature name>

- Slug: `<slug>` · Branch: `<branch>` · Date: YYYY-MM-DD
- Spec / Plan / TEST-PLAN: `<path>`

## Conclusion

<2–3 sentences: what was delivered, whether it is ready to merge, any remaining conditions.>

## Acceptance

| AC | Description | Result | Evidence |
|---|---|---|---|
| AC-1 | … | pass | `evidence/…` |

## Test results

| Type | Result |
|---|---|
| Unit | 42 pass / 0 fail |
| P4 integration | 8/8 pass (1 accepted warn: …) |
| P5 race | R-1: exactly 1/20 succeeded in 3/3 runs |
| P5 load | p95 = … ms, errors = … % (threshold …) |
| P5 FE | Lighthouse Perf … / A11y …, LCP … s |

## Bugs & feedback loops

| BUG | Title | Loops | Outcome |
|---|---|---|---|
| BUG-001 | … | 2 | fixed |

Total returns to P3: N.

## Main changes

- `<file/module>`: …

## Remaining risks & suggested follow-ups

- …

## How the reviewer can verify

1. …

---

<!-- Quick mode: use only the part below and delete the sections above. -->

# Quick report · <task name>

- Slug: `<slug>` · Branch: `<branch>` · Date: YYYY-MM-DD · Mode: quick
- Goal: <1 sentence>

| AC | Description | Verified by | Result |
|---|---|---|---|
| AC-1 | … | unit `<test name>` + UI/API `<scenario>` | pass |

- Files changed: `<file>` — …
- Unit tests: N pass / 0 fail · Build: green
- Bugs during the work: none / BUG-001 (fixed, 1 loop)
- Remaining / notes: …
