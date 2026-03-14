# Evolution Event: pivot to Godot browser game

## Timestamp
2026-03-14T17:19:50+00:00

## Trigger
The user explicitly rejected further frontend-only polish and requested that the actual product be built in Godot and published in the browser.

## Change
Defined the Godot migration graph for `Sky of Many Lanterns: Echo Trail`, including toolchain bootstrap, data migration, route-scene implementation, Godot Web export, CI, and GitHub Pages deployment.
Implemented the first migration slice: local Godot bootstrap scripts, a new in-repo Godot project, a playable vertical-slice route scene, and a successful local Web export.
Implemented the deployment migration slice: CI, Pages deploy, and release workflows now validate and package the Godot Web export path.
Implemented the first campaign migration slice: exported the full 20-level authored route set into Godot data, refactored the main runtime to load it, and added persistent local save/resume plus route completion tracking.
Implemented the first presentation/polish slice on top of the campaign runtime: the route renderer now stages stronger pseudo-3D scenery and ambient motion, atlas progression is grouped by district, and campaign completion has an explicit ending panel.
Implemented the next gameplay slice: unlocked upgrades now behave as active route powers, their per-run state persists, and route completion now lands on a dedicated result panel with clearer reward and onward-flow prompts.

## Decision Link
- Task decision: [TASK-009-pivot-to-godot-browser-game.md](../../docs/decisions/TASK-009-pivot-to-godot-browser-game.md)

## Validation Evidence
- `docs/plans/TASK-009-godot-web-game-migration-graph.md`
- Official Godot Web export requirements reviewed
- `npm run godot:sync:campaign`
- `npm run godot:check`
- `npm run godot:export:web`
- `npm run godot:verify:web`

## Outcome
Improved

## Follow-up
- Continue with moment-to-moment interaction depth, authored transitions, and more tactile feedback so the stronger presentation is matched by stronger play feel.
- Continue with authored transitions, stronger encounter-specific interaction patterns, and more tactile audiovisual feedback on top of the new route-power layer.
