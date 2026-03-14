# Decision: polish player experience and ship v1

## Task
TASK-006

## Date
2026-03-14

## Context
The product had become operationally shippable after the QA and release automation slice, but it still read more like a capable educational app than a warm indie adventure. The brief in `in/` is explicit that the child experience must feel personal, calm, useful, and worth returning to.

## Options Considered
- Stop after the release-hardening slice and let polish remain future work.
- Spend a final slice on atmosphere, narrative framing, and interface rhythm, then cut a `v1.0.0` release point.

## Decision
Add a final player-facing polish pass to the camp, session, and landing surfaces, strengthen the world framing with route-journal and field-note elements, and mark the repo at version `1.0.0` for release tagging.

## Reasoning
The last mile matters disproportionately for a game-like product. A parent may buy the trust contract, but a child returns for feel. The extra atmosphere, pacing, and world continuity make the current implementation land closer to the product brief without destabilizing the validated core loop.

## Consequences
The app now reads as a more intentional game product, not only a functioning practice tool. Shipping at `1.0.0` also makes the release workflow and Pages deployment path concrete rather than theoretical.

## Scope
Task-specific

## Links
- Related ADR: [0001-local-first-logic-learning-web-app.md](../adr/0001-local-first-logic-learning-web-app.md)
- Related evolution event: [20260314-114201-polish-player-experience-and-ship-v1.md](../../evolution/events/20260314-114201-polish-player-experience-and-ship-v1.md)
- Evidence (files/tests): `src/App.tsx`, `src/App.css`, `package.json`, `npm run validate`
