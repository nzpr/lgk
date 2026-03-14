# Decision: execute product graph

## Task
TASK-004

## Date
2026-03-14

## Context
The execution graph in `plan.md` is now the source of truth. Slice A delivered the foundation runtime and content backbone. Slice B delivered the more credible playable core. The remaining graph work is the shipping layer: release checks, deployment path, and handoff-ready operating artifacts.

## Options Considered
- Stop after the playable-core slice and leave deployment/handoff as implied future work.
- Finish the graph with release-path, smoke-check, and handoff artifacts so the repo can actually be shipped and reviewed.

## Decision
Execute the graph in slices. Slice A shipped the runtime foundation. Slice B deepened the playable core. The final slice adds the release contract: web manifest, smoke check, deploy workflow, and release playbook so the product can be validated and handed off without guesswork.

## Reasoning
Without a real deployment path and explicit smoke checks, the repo would still fail the acceptance docs even if the product itself looked good locally. This slice closes the operations gap and turns the implementation into something another team can inspect, deploy, and continue.

## Consequences
The repo now has the runtime, the playable loop, and the release/handoff path. Future work can focus on expanding content or backend capabilities rather than repairing missing core product or ops fundamentals.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-100622-execute-product-graph.md](../../evolution/events/20260314-100622-execute-product-graph.md)
- Evidence (files/tests): `plan.md`, `src/App.tsx`, `src/lib/engine.ts`, `src/types.ts`, `scripts/smoke-check.mjs`, `.github/workflows/deploy-pages.yml`, `docs/playbooks/release-and-deploy-sky-of-many-lanterns.md`, `npm run validate`
