# Evolution Event: pivot to pseudo-2d adventure game

## Timestamp
2026-03-14T16:42:26+00:00

## Trigger
The user rejected the current shipped product as not being a real game and requested a pseudo-2D adventure experience with a stronger plot, explicit mechanics, and a 20-level world-discovery campaign.

## Change
Defined a new product direction for `Sky of Many Lanterns: Echo Trail`, including plot, player fantasy, level loop, upgrade ladder, and a full 20-level campaign structure.
Implemented the first runtime slice for that direction: authored 20-level data, adventure progression state, deterministic shrine challenge binding, and level completion logic.

## Decision Link
- Task decision: [TASK-008-pivot-to-pseudo-2d-adventure-game.md](../../docs/decisions/TASK-008-pivot-to-pseudo-2d-adventure-game.md)

## Validation Evidence
- `docs/game-design/sky-of-many-lanterns-echo-trail.md`
- `npm run test:unit`

## Outcome
Improved

## Follow-up
- Implement the new campaign engine, pseudo-2D scene presentation, and 20-level progression in small pushed slices.
