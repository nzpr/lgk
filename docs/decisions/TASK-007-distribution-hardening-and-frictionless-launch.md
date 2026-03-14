# Decision: distribution hardening and frictionless launch

## Task
TASK-007

## Date
2026-03-14

## Context
The product was locally validated and visually polished, but public distribution still had three hard blockers: GitHub Actions was failing on runners where port `4173` was already occupied, the built site was not safe for GitHub Pages subpath hosting because production assets and the web manifest still assumed a root deployment, and first-time evaluation still required setup instead of immediate play.

## Options Considered
- Leave the current release shape in place and treat deployment friction as an ops follow-up.
- Harden the deploy path first, then continue with distribution materials and a lower-friction play entry.

## Decision
First harden the release path. Then add a zero-signup demo entry and the minimum outward-facing launch kit needed to distribute the game without manual explanation.

## Reasoning
Distribution materials are useless if the public build is brittle. Once deployment is deterministic, the next highest-leverage move is to eliminate evaluation friction and package the product with the copy, metadata, and support docs needed for external sharing.

## Consequences
The release stack is now safer for GitHub-hosted distribution and more reliable on shared runners. Reviewers can enter the product instantly through a scripted demo household, and launch operators have reusable copy, link strategy, and support guidance for distribution.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-110125-distribution-hardening-and-frictionless-launch.md](../../evolution/events/20260314-110125-distribution-hardening-and-frictionless-launch.md)
- Evidence (files/tests): `vite.config.ts`, `index.html`, `public/manifest.webmanifest`, `public/robots.txt`, `public/sitemap.xml`, `public/social-card.svg`, `src/App.tsx`, `src/lib/engine.ts`, `src/lib/engine.test.ts`, `tests/e2e/player-journey.spec.ts`, `docs/distribution/launch-and-support.md`, `docs/distribution/store-listing-copy.md`, `playwright.config.ts`, `scripts/run-e2e.mjs`, `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`, `.github/workflows/release.yml`, `CI=true PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npm run validate`
