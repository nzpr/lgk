# Evolution Event: harden QA and release automation

## Timestamp
2026-03-14T11:35:00+00:00

## Trigger
Need to turn the product from a locally validated MVP into a releaseable build with browser-level regression protection and a repeatable GitHub release flow.

## Change
Added Playwright mobile E2E coverage for the household journey and QA moderation path.
Expanded the engine test suite to cover daily task selection, chapter rewards, and parent summaries.
Added GitHub Actions for CI validation and tag-driven release packaging.
Upgraded the Pages deployment workflow so deployment happens only after the full validation stack passes.

## Decision Link
- ADR: [0001-local-first-logic-learning-web-app.md](../../docs/adr/0001-local-first-logic-learning-web-app.md)
- Task decision: [TASK-005-harden-qa-and-release-automation.md](../../docs/decisions/TASK-005-harden-qa-and-release-automation.md)

## Validation Evidence
- `npm run validate`

## Outcome
Improved

## Follow-up
- Use the release workflow from a real `v*` tag once the final polish pass lands.
