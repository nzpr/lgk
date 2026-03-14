# Decision: distribution hardening and frictionless launch

## Task
TASK-007

## Date
2026-03-14

## Context
The product was locally validated and visually polished, but public distribution still had two hard blockers: GitHub Actions was failing on runners where port `4173` was already occupied, and the built site was not safe for GitHub Pages subpath hosting because production assets and the web manifest still assumed a root deployment.

## Options Considered
- Leave the current release shape in place and treat deployment friction as an ops follow-up.
- Harden the deploy path first, then continue with distribution materials and a lower-friction play entry.

## Decision
First harden the release path. Make the production build subpath-safe for GitHub Pages, make E2E preview startup resilient to port collisions, and remove release publishing dependence on a preinstalled GitHub CLI.

## Reasoning
Distribution materials are useless if the public build is brittle. The fastest path to a real launch is to make deployment deterministic first, then shape the outward-facing player and launch surfaces on top of that stable base.

## Consequences
The release stack is now safer for GitHub-hosted distribution and more reliable on shared runners. Follow-up work in the same task can focus on removing first-play friction and preparing launch materials instead of debugging deployment basics.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-110125-distribution-hardening-and-frictionless-launch.md](../../evolution/events/20260314-110125-distribution-hardening-and-frictionless-launch.md)
- Evidence (files/tests): `vite.config.ts`, `index.html`, `public/manifest.webmanifest`, `playwright.config.ts`, `scripts/run-e2e.mjs`, `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`, `.github/workflows/release.yml`, `CI=true PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npm run validate`
