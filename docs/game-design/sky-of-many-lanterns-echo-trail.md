# Sky Of Many Lanterns: Echo Trail

## Product Direction
Turn the current logic-practice shell into a pseudo-2D adventure game about crossing hand-built scenes, discovering lost places, and relighting a broken sky world. The player should feel like they are traveling through a place, not opening a lesson list.

## Fantasy
You are `Mira`, a young route-runner who falls through a torn beacon line during the Festival of Lanterns. Your guide is `Nilo`, a storm moth that can read old light. The sky roads are breaking because an ancient force called `The Quiet` is swallowing memory from the beacons. To stop it, Mira must cross twenty drifting stages, restore the Lantern Spine, and wake the sleeping districts before the world forgets its own map.

## Plot Arc
### Act I: Lantern Reach
Mira survives the fall, finds Nilo, and learns that every dead beacon still remembers a fragment of the world. Restoring the first five routes reveals that The Quiet is not a monster but a spreading absence left behind by abandoned signal towers.

### Act II: Wind Archive
The old archive islands hold the route blueprints that can reconnect the sky roads. Mira discovers that earlier runners hid the truth: the Lantern Spine was designed to be walked, not controlled. The player stops chasing a machine fix and starts reviving a living network.

### Act III: Stormglass Wilds
The wild beacons react to weather, roots, and memory. Mira learns to work with the world instead of forcing it. Nilo regains enough memory to reveal the final route to the observatory.

### Act IV: The High Observatory
The final district is a shattered celestial machine suspended over empty sky. Mira restores the last route, turns the observatory back into a bridge between districts, and chooses to reopen the world for travelers instead of sealing it to keep it safe.

## Core Game Feel
- Side-on pseudo-2D presentation with layered parallax backgrounds, foreground silhouettes, and a traveler moving along hand-authored stage landmarks.
- Discovery-first flow: each level should feel like entering a new place with its own silhouette, hazard, and relic.
- World verbs are simple but meaningful: `move`, `inspect`, `attune`, `repair`, `unlock`.
- Logic challenges still exist, but they appear as shrines, mechanisms, and route seals inside the world.

## Player Loop
1. Choose the next unlocked route from the atlas.
2. Enter a pseudo-2D stage with five landmarks.
3. Move Mira across the route, triggering discoveries, hazards, and shrine puzzles.
4. Spend or regain `Lantern Charge` through play.
5. Finish the beacon, earn relics, and unlock the next route plus camp journal entries.

## Mechanics
### Traversal
- Each level is a horizontal stage with five major landmarks.
- Mira advances node to node with a visible travel animation across a layered scene.
- Some landmarks offer a branch choice:
  - safer route, lower reward
  - riskier route, higher relic reward

### Resources
- `Lantern Charge`: health and energy together. Wrong puzzle answers or risky route choices cost charge.
- `Relics`: optional collectibles that reward exploration and drive level completion quality.
- `Route Sparks`: earned on level completion and used only as meta progression flavor, not a grind gate.

### Shrine Challenges
- Two logic shrines per level.
- Shrines use existing reviewed task-bank content, but each challenge is framed as a world action:
  - align bridge glyphs
  - decode signal rhythm
  - choose the true route seal

### Discovery Beats
- Every level contains at least one optional world note, memory shard, or visual landmark.
- Discoveries fill a journal entry that makes the world feel authored rather than procedural.

### Upgrade Ladder
- Level 5 reward: `Wind Thread`
  - reveals hidden side caches on later stages
- Level 10 reward: `Echo Lens`
  - previews danger or relic value before a branch choice
- Level 15 reward: `Bridge Seed`
  - lets Mira restore broken shortcut platforms
- Level 20 reward: `Spine Flame`
  - final world restore and ending state

## Win / Fail Shape
- A level is cleared when the final beacon is restored.
- The player can retry a stage without losing world progression.
- Strong completion means:
  - beacon restored
  - both shrines solved
  - relic cache found
  - enough charge preserved

## Campaign Structure
Each level has:
- a biome identity
- one stage gimmick
- two shrine puzzles
- one relic target
- one story beat

| # | Region | Level | Gimmick | Story Beat |
|---|--------|-------|---------|------------|
| 1 | Lantern Reach | Fallen Ferry | Learn route movement | Mira survives the fall and meets Nilo |
| 2 | Lantern Reach | Signal Stair | Rising platforms | First proof the beacons still remember |
| 3 | Lantern Reach | Sun-Kite Orchard | Branch choice intro | Mira finds the first relic orchard |
| 4 | Lantern Reach | Brass Bridge Hollow | Hazard timing | The Quiet drains an old market route |
| 5 | Lantern Reach | Beacon Of First Fire | First act finale | Win `Wind Thread` and reopen Lantern Reach |
| 6 | Wind Archive | Whispering Stacks | Hidden cache reveal | The archive whispers old route names |
| 7 | Wind Archive | Cartographer's Spine | Multi-stop repair chain | Mira discovers lost route sketches |
| 8 | Wind Archive | Paperwing Ravine | Wind branch routes | Nilo recalls the Lantern Spine myth |
| 9 | Wind Archive | Clockroot Terrace | Timed route seals | The old towers were built to be walked |
| 10 | Wind Archive | Archive Crown | Second act finale | Win `Echo Lens` and reveal the observatory path |
| 11 | Stormglass Wilds | Rain-Needle Flats | Weather loss/gain | The wild routes answer to living storms |
| 12 | Stormglass Wilds | Moss Circuit | Recover charge by exploring | Discovery becomes stronger than rushing |
| 13 | Stormglass Wilds | Mirror Fen | False path previews | Mira learns how The Quiet imitates routes |
| 14 | Stormglass Wilds | Thunderloom Canopy | Risk-reward vertical branches | Nilo recovers the last map fragment |
| 15 | Stormglass Wilds | Wilds Heart Beacon | Third act finale | Win `Bridge Seed` and wake the wild beacon choir |
| 16 | High Observatory | Glass Ladder | Broken shortcut repair | The observatory hangs above empty sky |
| 17 | High Observatory | Hollow Orrery | Rotating landmark order | Mira sees the world machine from inside |
| 18 | High Observatory | Starwell Causeway | Consecutive shrine chain | The Quiet is exposed as abandoned signal logic |
| 19 | High Observatory | Moon Reservoir | Charge management finale setup | Mira decides to restore travel, not control |
| 20 | High Observatory | Lantern Spine | Final multi-phase route restore | Win `Spine Flame` and relight the world |

## Implementation Shape
### Slice 1
- Adventure design doc
- 20-level data model
- progression and world-state engine

### Slice 2
- New pseudo-2D app shell
- atlas, camp, and side-view route scene
- traveler animation, landmark rendering, branch choices

### Slice 3
- shrine challenge integration
- journal / relic / upgrade systems
- ending flow, revised tests, and deploy verification

## Quality Bar
- It must feel like a real place with authored route names and visual identity.
- The player should always see where they are in the world and what they are restoring.
- The logic layer must support the adventure fantasy, never replace it.
- If a game critic hat puts this down after two minutes and says “this is a themed worksheet,” the design has failed.
