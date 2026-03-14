# Release And Deploy: Sky Of Many Lanterns

## Purpose
Ship the static web product with the same commands and checks used during development.

## Local Commands
Run from `/workspace`:

```bash
npm install
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

`npm run preview` serves the production build locally on `http://127.0.0.1:4173`.

## GitHub Pages Deployment
The repository includes `.github/workflows/deploy-pages.yml`.

Deployment shape:
- trigger: push to `main`
- build: `npm ci` then `npm run build`
- artifact: `dist/`
- host: GitHub Pages

## Manual Static Hosting
If GitHub Pages is not the target, publish the `dist/` directory to any HTTPS static host.

Minimum host requirements:
- immutable asset caching for hashed `dist/assets/*`
- fallback `index.html` serving for SPA refreshes
- rollback by redeploying a previous `dist/` build artifact

## Release Smoke Checklist
- `npm run validate` passes
- parent onboarding works
- child diagnostic completes
- daily expedition completes
- hint ladder and final explanation display source traces
- parent dashboard shows recent session evidence
- QA surface shows analytics events and flagged output queue
