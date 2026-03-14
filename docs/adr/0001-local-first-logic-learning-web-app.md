# ADR-0001: local first logic learning web app

## Status
Accepted

## Date
2026-03-14

## Context
The repository contained a detailed product/package specification in `in/` but no runnable application code, backend contract, or deployment implementation. The product requirements call for a mobile-first web experience with parent onboarding, child diagnostic and daily sessions, grounded explanations, progress reporting, source traceability, and analytics/QA hooks.

## Decision
Implement the product as a local-first React + TypeScript + Vite web application with browser persistence, a generated reviewed task bank, deterministic grounded hint/explanation flows, and static-build deployment support.

## Options Considered
- Build a full client/server product with remote auth, database storage, and live AI services before a local product exists.
- Implement a static or local-first web app first, with structured content, in-browser learner state, and deterministic grounded help.

## Consequences
### Positive
- Produces a deployable product quickly inside the current repo without inventing missing backend contracts.
- Keeps child-facing help constrained, inspectable, and source-traceable.
- Supports the required build/validate flow with a single static web app.

### Negative
- Parent accounts and learner data are device-local until a backend is added later.
- Live multi-device sync and operational auth flows are deferred beyond this implementation.

## References
- Related task(s): `TASK-004`
- Related decision notes: [TASK-004-execute-product-graph.md](../decisions/TASK-004-execute-product-graph.md)
- Related evolution events: [20260314-093621-local-first-logic-learning-web-app.md](../../evolution/events/20260314-093621-local-first-logic-learning-web-app.md)
- Source links: `in/detailed-product-description.md`, `in/deployment-and-acceptance.md`, `in/02-product-docs/prd-logic-learning-mvp.md`, `in/02-product-docs/user-flows-logic-learning.md`, `in/02-product-docs/game-direction-age-10.md`, `in/02-product-docs/game-systems-age-10.md`
