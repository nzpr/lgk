# Decision: execute product graph

## Task
TASK-004

## Date
2026-03-14

## Context
The execution graph in `plan.md` is now the source of truth. Slice A delivered the foundation runtime and content backbone. Slice B now needs to deliver the playable-core nodes: stronger onboarding continuity, adaptive session handling, world-state payoff, and more concrete parent value.

## Options Considered
- Let the foundation shell stand mostly unchanged until the full product is nearly done.
- Deepen the playable-core nodes now, validate them, and ship them as the next graph slice before parent/QA/release polish.

## Decision
Execute the graph in slices. Slice A shipped the runtime foundation. Slice B deepens the playable core with momentum protection, tomorrow-preview continuity, stronger parent evidence, and a traceable content explorer to support QA and downstream safety nodes.

## Reasoning
The product would still feel too skeletal if the team jumped straight from the runtime shell to release mechanics. Slice B closes the biggest experience gap: it makes the child loop feel more like a game and the parent loop feel more specific and trustworthy.

## Consequences
The repo now has both a stable runtime and a more believable product loop. The remaining work can focus on QA/review safety, deployment, and handoff instead of core-loop credibility.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-100622-execute-product-graph.md](../../evolution/events/20260314-100622-execute-product-graph.md)
- Evidence (files/tests): `plan.md`, `src/App.tsx`, `src/lib/engine.ts`, `src/types.ts`, `npm run lint`, `npm run test`, `npm run build`
