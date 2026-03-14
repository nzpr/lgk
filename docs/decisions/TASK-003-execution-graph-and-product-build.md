# Decision: execution graph and product build

## Task
TASK-003

## Date
2026-03-14

## Context
The repo currently contains the contractor package and no product runtime. The request is to plan and execute the rebuild as a five-person indie game/product team, with a dependency graph strong enough to drive implementation and handoff instead of a generic roadmap.

## Options Considered
- Write a flat feature checklist and improvise dependencies during implementation.
- Build a bounded execution graph with explicit node owners, dependencies, handoff requirements, and slice order, then execute against that graph.

## Decision
Use a 29-node dependency graph as the source of truth for execution. Keep the graph practical: every node must ship something handoffable to the next node, and every meaningful slice must be committed and pushed after validation.

## Reasoning
This product is small in team size but not small in system shape: child UX, parent trust, content review, progression, safety, and deployability all depend on one another. A real DAG keeps the team from front-end theater, backend overreach, or AI-first drift.

## Consequences
Implementation will proceed in graph slices, not in loosely themed batches. If a downstream node exposes a bad upstream assumption, the graph source will be corrected and re-executed rather than patched locally.

## Scope
Task-specific

## Links
- Related ADR:
- Related evolution event: [20260314-100446-execution-graph-and-product-build.md](../../evolution/events/20260314-100446-execution-graph-and-product-build.md)
- Evidence (files/tests): `plan.md`, `in/detailed-product-description.md`, `in/deployment-and-acceptance.md`, `in/01-handoff/detailed-goal.md`, `in/02-product-docs/prd-logic-learning-mvp.md`, `in/02-product-docs/user-flows-logic-learning.md`, `in/02-product-docs/game-direction-age-10.md`, `in/02-product-docs/game-systems-age-10.md`
