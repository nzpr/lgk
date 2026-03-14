# Release And Deploy: Sky Of Many Lanterns

## Purpose
Ship the static web product with the same commands and checks used during development, CI, and tagged releases.

## Local Commands
Run from `/workspace`:

```bash
npm install
PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npx playwright install chromium
npm run validate
npm run preview
```

`npm run validate` covers:
- content generation
- lint
- unit tests
- content validation
- production build
- smoke check on the built output
- mobile browser E2E coverage against the production build

`npm run preview` serves the production build locally on `http://127.0.0.1:4173`.

## GitHub Actions
The repository includes three workflows:

- `.github/workflows/ci.yml`
  - trigger: pushes, pull requests, manual dispatch
  - purpose: run the full validation stack, including Playwright E2E
- `.github/workflows/deploy-pages.yml`
  - trigger: push to `main`, manual dispatch
  - purpose: re-run full validation, then publish `dist/` to GitHub Pages
- `.github/workflows/release.yml`
  - trigger: tag push matching `v*`, manual dispatch
  - purpose: validate, package the static build, and publish a GitHub release artifact

## GitHub Pages Deployment
Deployment shape:
- trigger: push to `main`
- build: `npm ci`, `npx playwright install --with-deps chromium`, then `npm run validate`
- artifact: `dist/`
- host: GitHub Pages

## Release Cycle
Use annotated tags for release candidates and public builds:

```bash
git tag -a v1.0.0 -m "Sky of Many Lanterns v1.0.0"
git push origin v1.0.0
```

Release expectations:
- `main` stays deployable at all times
- every meaningful merge passes `Validate Product`
- Pages auto-deploys from `main`
- a version tag creates a GitHub release bundle from the already-validated static build

## Manual Static Hosting
If GitHub Pages is not the target, publish the `dist/` directory to any HTTPS static host.

Minimum host requirements:
- immutable asset caching for hashed `dist/assets/*`
- fallback `index.html` serving for SPA refreshes
- rollback by redeploying a previous `dist/` build artifact

## Release Smoke Checklist
- `npm run validate` passes
- Playwright E2E passes on mobile Chromium
- parent onboarding works
- child diagnostic completes
- daily expedition completes
- hint ladder and final explanation display source traces
- parent dashboard shows recent session evidence
- QA surface shows analytics events and flagged output queue
