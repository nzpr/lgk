# Evolution Event: distribution hardening and frictionless launch

## Timestamp
2026-03-14T11:01:25+00:00

## Trigger
Public distribution work exposed two real blockers: failing GitHub Actions runs and a production build that still assumed root hosting rather than a GitHub Pages subpath.

## Change
Made the built app subpath-safe by switching production asset and manifest paths to relative outputs.
Reworked the Playwright E2E runner to allocate an open preview port dynamically and pass that URL into the browser test config.
Updated the release workflow to publish with a maintained release action instead of assuming the GitHub CLI exists on the runner.

## Decision Link
- ADR: [0001-local-first-logic-learning-web-app.md](../../docs/adr/0001-local-first-logic-learning-web-app.md)
- Task decision: [TASK-007-distribution-hardening-and-frictionless-launch.md](../../docs/decisions/TASK-007-distribution-hardening-and-frictionless-launch.md)

## Validation Evidence
- `CI=true PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npm run validate`

## Outcome
Improved

## Follow-up
- Add zero-friction demo entry, launch materials, and external distribution docs in the next slice of the same task.
