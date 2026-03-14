# Evolution Event: pivot to Godot browser game

## Timestamp
2026-03-14T17:19:50+00:00

## Trigger
The user explicitly rejected further frontend-only polish and requested that the actual product be built in Godot and published in the browser.

## Change
Defined the Godot migration graph for `Sky of Many Lanterns: Echo Trail`, including toolchain bootstrap, data migration, route-scene implementation, Godot Web export, CI, and GitHub Pages deployment.
Implemented the first migration slice: local Godot bootstrap scripts, a new in-repo Godot project, a playable vertical-slice route scene, and a successful local Web export.

## Decision Link
- Task decision: [TASK-009-pivot-to-godot-browser-game.md](../../docs/decisions/TASK-009-pivot-to-godot-browser-game.md)

## Validation Evidence
- `docs/plans/TASK-009-godot-web-game-migration-graph.md`
- Official Godot Web export requirements reviewed
- `npm run godot:check`
- `npm run godot:export:web`

## Outcome
Improved

## Follow-up
- Expand the Godot vertical slice into campaign data flow, then replace CI and Pages deployment with Godot Web export.
