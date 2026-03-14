# Decision: harden QA and release automation

## Task
TASK-005

## Date
2026-03-14

## Context
The product already had unit tests, content validation, smoke checks, and a Pages deploy path. It still lacked the kind of release discipline needed for a polished shipped game-like product: browser-level regression coverage, a workflow that blocks bad deploys, and a tagged release path that produces a reviewable artifact.

## Options Considered
- Keep the existing unit-plus-smoke stack and rely on manual spot checks for the rest.
- Add mobile browser E2E coverage, run the full stack in GitHub Actions, and publish a tagged release artifact from a validated build.

## Decision
Adopt Playwright mobile E2E tests as part of `npm run validate`, add a CI workflow for full validation, require the Pages deployment workflow to re-run full validation before publishing, and add a tag-driven GitHub release workflow that packages the static build artifact.

## Reasoning
This product lives or dies on moment-to-moment interaction quality. Unit tests and a smoke check are not enough to protect onboarding, session flow, and parent/QA surfaces. A tagged release artifact also closes the handoff gap for reviewers or non-GitHub-Pages hosting.

## Consequences
Validation is heavier and slower, but deploys and releases are now much harder to break silently. Future changes have a clear release contract: pass local validation, pass GitHub validation, merge to `main` for deploy, and tag for a packaged release.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-113500-harden-qa-and-release-automation.md](../../evolution/events/20260314-113500-harden-qa-and-release-automation.md)
- Evidence (files/tests): `playwright.config.ts`, `scripts/run-e2e.mjs`, `tests/e2e/player-journey.spec.ts`, `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`, `.github/workflows/release.yml`, `docs/playbooks/release-and-deploy-sky-of-many-lanterns.md`, `npm run validate`
