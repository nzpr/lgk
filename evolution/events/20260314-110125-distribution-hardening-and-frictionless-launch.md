# Evolution Event: distribution hardening and frictionless launch

## Timestamp
2026-03-14T11:01:25+00:00

## Trigger
Public distribution work exposed two real blockers: failing GitHub Actions runs and a production build that still assumed root hosting rather than a GitHub Pages subpath.

## Change
Made the built app subpath-safe by switching production asset and manifest paths to relative outputs.
Reworked the Playwright E2E runner to allocate an open preview port dynamically and pass that URL into the browser test config.
Updated the release workflow to publish with a maintained release action instead of assuming the GitHub CLI exists on the runner.
Added a no-signup demo household path that can be entered from the landing page or a direct `?demo=1` link.
Added launch-facing metadata and distribution materials: social card, robots/sitemap, store listing copy, and launch/support notes.
Aligned the E2E base URL with the preview server address to avoid localhost resolution mismatches on GitHub-hosted runners.
Split CI and deploy validation into explicit gates so future failures show the exact broken stage instead of a single opaque validation step.
Replaced `npx playwright` usage in CI-sensitive paths with the checked-in local Playwright binary to avoid npm exec cache/ownership drift between GitHub-hosted runner steps.
Reordered the workflows so all npm-driven generation/build checks complete before Playwright browser installation, and invoked the final browser pass directly with Node to remove post-install npm dependency.
Replaced post-install `npm run` workflow invocations with direct local binary and Node commands so GitHub-hosted validation depends only on the checked-out toolchain, not npm task orchestration state.

## Decision Link
- ADR: [0001-local-first-logic-learning-web-app.md](../../docs/adr/0001-local-first-logic-learning-web-app.md)
- Task decision: [TASK-007-distribution-hardening-and-frictionless-launch.md](../../docs/decisions/TASK-007-distribution-hardening-and-frictionless-launch.md)

## Validation Evidence
- `CI=true PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npm run validate`

## Outcome
Improved

## Follow-up
- Push the distribution slice, verify the new GitHub Actions runs, and confirm the live GitHub Pages URL is serving the latest build.
