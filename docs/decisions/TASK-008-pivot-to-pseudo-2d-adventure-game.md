# Decision: pivot to a pseudo-2d adventure game

## Task
TASK-008

## Date
2026-03-14

## Context
The shipped product was structurally solid but still read as a logic-learning application with game framing. The new requirement is to turn it into a pseudo-2D adventure game centered on world discovery, authored progression, and a 20-level campaign.

## Options Considered
- Keep the current session dashboard structure and add more thematic dressing.
- Reframe the product as a proper adventure game with a side-on route scene, campaign map, and authored level progression while reusing the reviewed task bank as embedded shrine challenges.

## Decision
Pivot the runtime toward an authored pseudo-2D adventure campaign. Keep the stable deployment stack and reviewed puzzle corpus, but rebuild the player-facing loop around exploration, level progression, upgrades, and world restoration.

## Reasoning
The user is right about the current product shape: it is not a game in the strong sense. The fastest path to something that can survive a serious game critique is not incremental UI polish. It is a structural change in the fantasy, loop, and presentation layer.

## Consequences
This task becomes a directed redesign rather than a minor enhancement. Existing trusted infrastructure stays, but most of the player-facing application flow will be rewritten. The new bar is whether the product reads first as an adventure game and second as a logic system.

## Implementation Notes
The pivot now includes a dedicated campaign runtime:
- a landing screen that sells the plot and campaign fantasy immediately
- an atlas screen with authored route cards and journal continuity
- a pseudo-2D route scene with visible landmarks, route choices, shrine encounters, and persistence
- browser coverage for demo entry, full first-route completion, and in-progress reload recovery
- route-style decisions on traversal landmarks, adding a real careful-vs-bold play layer and route-flow ranking

## Scope
Task-specific

## Links
- Design doc: [sky-of-many-lanterns-echo-trail.md](../game-design/sky-of-many-lanterns-echo-trail.md)
- Related evolution event: [20260314-164226-pivot-to-pseudo-2d-adventure-game.md](../../evolution/events/20260314-164226-pivot-to-pseudo-2d-adventure-game.md)
