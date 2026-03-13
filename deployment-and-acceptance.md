# Deployment And Acceptance

## End Goal
The end goal is a production-ready product plus a handoff package.

The contractor is not done when the design is clear or when a prototype exists.
The contractor is done when there is:
- a production-ready web product
- a deployed environment for inspection
- a repeatable deployment process
- a validation/check procedure
- and a handoff package with product, content, and operating documentation

## Preferred Deployment Shape
For the first release, treat the product as a mobile-first web app or PWA deployed behind HTTPS.

Acceptable first deployment patterns:
- static hosting plus CDN
- app hosting platform serving a built web app
- equivalent web deployment with SSL, versioned releases, and rollback

## Minimum Deployment Outputs
The contractor should deliver:
- a production URL
- a staging URL
- deployment steps
- environment variable list
- build command
- smoke-test checklist
- rollback steps
- owner contacts or responsibilities for release operations

## Minimum Check Procedure
Before any release, the contractor should be able to show:
- build succeeds
- content loads correctly
- onboarding works
- diagnostic works
- daily session works
- hints and explanations work
- parent progress view works
- analytics events fire
- mobile layouts are usable

## Acceptance Criteria
The delivery should be treated as acceptable only if:
- the product is deployable without ad hoc manual fixes
- the core child and parent flows work end to end
- content and source traceability are intact
- the product is reviewable in a live deployed environment
- the handoff package is complete enough for a replacement team to continue work

## Local Inspection Of The Current Product
The current product in this repo can be inspected locally with:

```bash
npm run dev
```

This serves the current app locally on:

```text
http://127.0.0.1:4173
```

## Build And Validation Commands
Use these commands in the repo root:

```bash
npm run build
npm run validate
```

`npm run build` creates the static build.
`npm run validate` runs the repo's code and content checks.
