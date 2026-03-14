# Evolution Event: pivot to pseudo-2d adventure game

## Timestamp
2026-03-14T16:42:26+00:00

## Trigger
The user rejected the current shipped product as not being a real game and requested a pseudo-2D adventure experience with a stronger plot, explicit mechanics, and a 20-level world-discovery campaign.

## Change
Defined a new product direction for `Sky of Many Lanterns: Echo Trail`, including plot, player fantasy, level loop, upgrade ladder, and a full 20-level campaign structure.
Implemented the first runtime slice for that direction: authored 20-level data, adventure progression state, deterministic shrine challenge binding, and level completion logic.
Implemented the second runtime slice: replaced the old household-dashboard shell with a dedicated pseudo-2D adventure presentation, atlas progression screen, persistent route play, and end-to-end browser coverage for the new loop.
Implemented a gameplay-improvement slice: non-shrine landmarks now offer careful-vs-bold traversal choices, route flow builds and ranks a run, and save migration keeps older players compatible with the new state shape.
Implemented a visual-polish slice: the game now uses a pseudo-3D diorama presentation with a layered hero scene, stronger atlas route cards, a perspective route boardwalk, animated atmospheric props, and depth-scaled landmarks.

## Decision Link
- Task decision: [TASK-008-pivot-to-pseudo-2d-adventure-game.md](../../docs/decisions/TASK-008-pivot-to-pseudo-2d-adventure-game.md)

## Validation Evidence
- `docs/game-design/sky-of-many-lanterns-echo-trail.md`
- `npm run test:unit`
- `CI=true PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npm run validate`

## Outcome
Improved

## Follow-up
- Push the validated runtime slice, verify GitHub Actions, and confirm the deployed Pages build reflects the new game shell.
