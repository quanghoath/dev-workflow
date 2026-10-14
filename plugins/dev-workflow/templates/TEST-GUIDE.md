# Acceptance test guide · <feature name>

> For BA / QA. Test round <n><, after fixing BUG-…>. Mark each step ☐ Pass / ☐ Fail and send the results to the developer.

## What was done

- <what users can now do, in business language>

## Before you start

- **Test site:** <URL>
- **Test accounts:** <account names; passwords are kept in …>
- **Test data:** <what must exist first>

## Test steps

### AC-1 · <short name>

| # | Do | You should see | Result | Note |
|---|---|---|---|---|
| 1.1 | <one action, button labels in quotes> | <expected> | ☐ Pass ☐ Fail | |

## Also try

| # | Do | You should see | Result | Note |
|---|---|---|---|---|
| E1 | <edge case> | <expected> | ☐ Pass ☐ Fail | |

## Found a problem?

- Write the step number, what you saw, the account and the time.
- Send it to the developer.

## For developers

- Report: `docs/superpowers/runs/<slug>/REPORT.md` · Spec: `<path>` · PR: <URL>
