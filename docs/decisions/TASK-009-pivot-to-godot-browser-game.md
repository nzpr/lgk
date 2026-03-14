# Decision: pivot the shipping runtime to a Godot browser game

## Task
TASK-009

## Date
2026-03-14

## Context
The current product has moved much closer to a game, but it still ships as a React application. The new requirement is to build the actual product in Godot and publish it to the browser as a real game build.

## Options Considered
- Keep extending the React runtime and imitate a game more aggressively.
- Treat the React build as a prototype/reference and move the shipping runtime to Godot with Web export.

## Decision
Move the shipping runtime to Godot and target browser delivery via Godot Web export.

## Reasoning
The user’s bar is correct: a real game should be built in an actual game engine if we want scene control, camera language, animation, authored interactions, and a credible browser-playable release path. React was useful for proving design direction, but it is now the wrong runtime for the product ambition.

## Consequences
- The existing React build becomes reference material and fallback content logic, not the final game client.
- Toolchain setup becomes part of the product critical path.
- CI, deployment, and browser publishing must be rebuilt around Godot export.

## Implementation Notes
- Added a local Godot 4.6.1 bootstrap path with wrapper scripts for headless check and Web export.
- Created the first Godot project skeleton and a browser-exportable vertical slice route scene.
- Confirmed local headless boot and Godot Web export using the committed project files.
- Replaced GitHub validation, Pages deploy, and release packaging flows to target the Godot Web build instead of the React dist output.
- Added a Godot campaign data export path that converts the authored 20-level route set into browser-shippable Godot JSON content.
- Rebuilt the main Godot controller around campaign loading, save-backed progression, route resume, upgrades, and atlas-level completion states.
- Reworked the Godot route renderer toward stronger pseudo-3D depth with moving skies, region-specific backdrops, landmark props, and a more world-like boardwalk composition.
- Added district-grouped atlas presentation and a campaign ending panel so progression has clearer structure and payoff.
- Converted campaign upgrades into active route powers so traversal, shrines, and beacon moments have more tactical player input.
- Added a dedicated route-result panel so finished runs land with explicit score, reward, and next-step payoff instead of collapsing directly back to the atlas.
- Added actual route-failure stakes when charge burns out before a route is complete, plus a retry flow, so resource pressure matters and the new powers have real tactical weight.
- Added keyboard hotkeys for route and result actions so browser play is faster and lower-friction on desktop without changing the underlying game rules.
- Added distribution-facing player documentation in `docs/distribution/` so the live build now has a concrete repo-side `how to play` reference.
- Added a root [`README.md`](../../README.md) so the repo landing page explains the game’s real purpose: teaching kids logic through play, grounded in the project’s logic-book corpus, with direct links to the game and play docs.

## Scope
Task-specific

## Links
- Migration graph: [TASK-009-godot-web-game-migration-graph.md](../plans/TASK-009-godot-web-game-migration-graph.md)
- Related evolution event: [20260314-171950-pivot-to-godot-browser-game.md](../../evolution/events/20260314-171950-pivot-to-godot-browser-game.md)
