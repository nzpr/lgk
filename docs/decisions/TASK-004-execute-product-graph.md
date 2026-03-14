# Decision: execute product graph

## Task
TASK-004

## Date
2026-03-14

## Context
The execution graph in `plan.md` is now the source of truth. Slice A needs to deliver the foundation nodes: runtime architecture, content schema, progression model, visual/runtime scaffold, and a runnable web shell that later slices can build on without rework.

## Options Considered
- Rebuild the foundation ad hoc in a single large product commit.
- Execute the foundation nodes as a validated slice with traceability, then commit and push before moving into the playable-core nodes.

## Decision
Execute Slice A as the first production slice: local-first React/Vite runtime, generated content bank, validation commands, learner/state engine, and the initial app shell needed for onboarding and session work.

## Reasoning
These nodes unblock almost every downstream node in the graph. Shipping them as one validated slice gives the team a stable runtime and content backbone before deeper UX, parent value, QA, and release work.

## Consequences
The repo gains a runnable application and deterministic content/runtime model early. Later slices can stay focused on product feel and release quality instead of fighting scaffolding and data-shape churn.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-100622-execute-product-graph.md](../../evolution/events/20260314-100622-execute-product-graph.md)
- Evidence (files/tests): `plan.md`, `package.json`, `scripts/generate-task-bank.mjs`, `scripts/validate-content.mjs`, `src/lib/engine.ts`, `src/App.tsx`, `npm run generate:content`, `npm run lint`, `npm run test`, `npm run build`
