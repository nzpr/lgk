# Evolution Event: pivot to Godot browser game

## Timestamp
2026-03-14T17:19:50+00:00

## Trigger
The user explicitly rejected further frontend-only polish and requested that the actual product be built in Godot and published in the browser.

## Change
Defined the Godot migration graph for `Sky of Many Lanterns: Echo Trail`, including toolchain bootstrap, data migration, route-scene implementation, Godot Web export, CI, and GitHub Pages deployment.

## Decision Link
- Task decision: [TASK-009-pivot-to-godot-browser-game.md](../../docs/decisions/TASK-009-pivot-to-godot-browser-game.md)

## Validation Evidence
- `docs/plans/TASK-009-godot-web-game-migration-graph.md`
- Official Godot Web export requirements reviewed

## Outcome
Improved

## Follow-up
- Bootstrap the Godot toolchain locally, create the project skeleton, and ship the first playable Web-exportable route slice.
