# TASK-009 Godot Web Game Migration Graph

## Goal
Rebuild `Sky of Many Lanterns: Echo Trail` as an actual Godot game that exports to the browser and deploys on GitHub Pages with automated validation.

## Team Hats
- `PO`: product owner
- `GD`: game designer
- `NW`: narrative / world writer
- `GQ`: game critique / player advocate
- `DEV`: senior full-stack / Godot developer

## Shipping Rule
- The React prototype becomes reference material, not the shipping runtime.
- Every slice must end with a browser-runnable Godot build or a hard blocker explicitly logged.
- Godot Web export and GitHub Pages deploy are first-class product work, not end-of-project chores.

## Graph

| Node | Owner | Work | Depends On | Handoff / Done When |
|------|-------|------|------------|---------------------|
| N01 | PO | Freeze scope for the Godot pivot and define what survives from the prototype | - | Decision note exists and names the shipping target as Godot Web |
| N02 | GD | Convert the current pseudo-2D concept into a Godot-native 2.5D side-view adventure brief | N01 | Core loop, camera, verbs, and scene fantasy are explicit |
| N03 | NW | Refit plot, level beats, and tutorial sequencing for playable scene flow | N02 | Intro, district arcs, and 20-level cadence map to in-game events |
| N04 | GQ | Define the non-negotiable “this feels like a real game” criteria | N02 | Critique checklist exists for readability, juice, and friction |
| N05 | DEV | Bootstrap local Godot toolchain and matching Web export templates | N01 | Godot CLI runs locally and can export a blank Web build |
| N06 | DEV | Create the Godot project skeleton, repo layout, and asset pipeline conventions | N05 | `project.godot`, folders, and import conventions exist |
| N07 | DEV | Decide what data migrates from the React prototype and write an import contract | N02, N06 | Levels, shrine content, and tuning fields have a stable format |
| N08 | GD | Define the player verbs for route play: move, attune, surge, shrine solve, restore | N02 | Moment-to-moment input model is fixed |
| N09 | DEV | Implement core state model in Godot: campaign, route run, relics, upgrades, save data | N06, N07, N08 | The game can create, save, and resume a run |
| N10 | DEV | Implement scene loader, campaign bootstrap, and route selection flow | N06, N09 | Boot goes from title to atlas to a route scene |
| N11 | GD | Block out the camera language and pseudo-3D composition rules | N02, N08 | Camera distance, parallax layers, and scene readability rules are set |
| N12 | DEV | Build the base route scene with camera, parallax, boardwalk depth, and landmark staging | N09, N11 | One level is navigable in-engine with placeholder art |
| N13 | DEV | Implement traveler controller, landmark interaction, and route progression | N09, N12 | The player can clear a route end to end |
| N14 | DEV | Integrate shrine challenge presentation and answer resolution inside Godot UI | N07, N13 | Shrine encounters work in the route scene |
| N15 | GD | Tune route risk/reward pacing, flow meter, and level rank rules for Godot play | N08, N13, N14 | First-route and mid-route pacing feel game-like, not menu-like |
| N16 | NW | Write the intro sequence, route flavor text, and landmark feedback copy for in-engine use | N03, N13 | Title, tutorial route, and first district copy are implemented |
| N17 | DEV | Build atlas scene, level card presentation, and district progression map | N09, N10, N11 | Campaign navigation is readable and fast |
| N18 | DEV | Add juice systems: lantern glow, haze, camera drift, feedback popups, and transitions | N12, N13 | The game has readable motion and reward feedback |
| N19 | GQ | Critique and revise the first playable vertical slice | N13, N14, N15, N16, N18 | Issues are logged and turned into concrete fixes |
| N20 | DEV | Build content ingestion for all 20 levels and route-specific tuning data | N07, N17 | Full campaign data loads inside Godot |
| N21 | DEV | Implement ending flow, campaign completion state, and restart path | N17, N20 | Full campaign can complete cleanly |
| N22 | DEV | Add automated local checks: smoke launch, headless scene test, exported Web sanity check | N05, N10, N14 | CI-ready validation commands exist |
| N23 | DEV | Add GitHub Actions for Godot validation and Web export artifact generation | N05, N22 | Pushes run validation on GitHub |
| N24 | DEV | Replace Pages deploy flow with Godot Web export deployment | N23 | `main` can publish the Godot build to Pages |
| N25 | GQ | Do a browser friction pass on mobile and desktop | N21, N24 | No immediate input, readability, or loading blockers remain |
| N26 | PO | Cut release notes, distribution instructions, and player-facing “how to play” for the Godot build | N24, N25 | Repo contains a clean publish path and release explanation |

## Critical Path
`N01 -> N05 -> N06 -> N07 -> N09 -> N10 -> N12 -> N13 -> N14 -> N15 -> N19 -> N20 -> N21 -> N22 -> N23 -> N24 -> N25 -> N26`

## First Four Execution Slices
1. `N01-N07`
   Scope: commit the pivot decision, bootstrap Godot, create the project, and lock the data contract.
2. `N08-N14`
   Scope: one playable route in Godot with actual interaction and shrine flow.
3. `N15-N21`
   Scope: tune the loop, load the campaign, and implement full progression and ending.
4. `N22-N26`
   Scope: validation, CI, Web export, Pages deploy, and shipping materials.

## Rework Rule
- If `GQ` says the current slice still feels like a dressed-up menu app, work loops back to the nearest upstream design or interaction node before more content is added.

## External Dependencies
- Godot editor and matching Web export templates from official Godot downloads
- GitHub Actions runtime capable of headless Godot export
- GitHub Pages configured for deployment from Actions
