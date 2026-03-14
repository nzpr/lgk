import type { AdventureLevel, LevelLandmark } from './types'

function landmark(
  id: string,
  title: string,
  kind: LevelLandmark['kind'],
  description: string,
  sceneDetail: string,
  extras: Partial<Omit<LevelLandmark, 'id' | 'title' | 'kind' | 'description' | 'sceneDetail'>> =
    {},
): LevelLandmark {
  return {
    id,
    title,
    kind,
    description,
    sceneDetail,
    journalText: extras.journalText ?? description,
    ...extras,
  }
}

export const adventureLevels: AdventureLevel[] = [
  {
    id: 'fallen-ferry',
    index: 1,
    region: 'Lantern Reach',
    title: 'Fallen Ferry',
    tagline: 'A broken dock swings over the first gap in the sky.',
    goal: 'Cross the ferry ruin and relight the first travel lantern.',
    storyBeat: 'Mira survives the fall and meets Nilo beside a drowned route bell.',
    reward: 'The first district lantern wakes and answers with a warm pulse.',
    palette: {
      skyTop: '#183052',
      skyBottom: '#e9b86c',
      far: '#2a476e',
      mid: '#406a8a',
      ground: '#8d5c3b',
      accent: '#ffd27d',
    },
    challengeSkills: ['classification', 'patterns'],
    landmarks: [
      landmark(
        'ferry-start',
        'Shoreline Bell',
        'start',
        'The ferry pier still hums when Nilo lands on the rusted chain.',
        'A dangling bell and rope posts frame the first path.',
        { chargeDelta: 1 },
      ),
      landmark(
        'ferry-cache',
        'Cargo Drift',
        'cache',
        'A cargo crate cracked open in the clouds. Mira can scavenge lightcloth from it.',
        'Loose planks and torn sailcloth float under the route.',
        { relicDelta: 1, journalText: 'Mira finds the first salvage cache in the ferry drift.' },
      ),
      landmark(
        'ferry-shrine',
        'Dock Seal',
        'shrine',
        'The ferry seal only opens when its carved cargo marks are sorted correctly.',
        'A brass plate locks the boarding ramp in place.',
        { challengeSkill: 'classification' },
      ),
      landmark(
        'ferry-choice',
        'Chain Gap',
        'hazard',
        'Two chain runs cross the gap: one steady, one glowing with trapped sparks.',
        'The route narrows into a swinging chain bridge.',
        {
          choice: {
            prompt: 'How should Mira cross the broken chain?',
            safe: {
              id: 'safe',
              label: 'Take the steady chain',
              summary: 'Slower, but stable.',
              outcome: 'Mira reaches the far side without losing her footing.',
              chargeDelta: 0,
              relicDelta: 0,
              journalText: 'Mira chooses the slower chain and keeps the route calm.',
            },
            risky: {
              id: 'risky',
              label: 'Leap the spark chain',
              summary: 'Risk charge for a hidden relic.',
              outcome: 'The spark chain bites back, but Mira pulls a bright relic from its knot.',
              chargeDelta: -1,
              relicDelta: 1,
              journalText: 'Mira risks the spark chain and steals a relic from the arc.',
            },
          },
        },
      ),
      landmark(
        'ferry-beacon',
        'First Lantern',
        'beacon',
        'The smallest beacon in Lantern Reach waits for a pulse to wake.',
        'A squat brass lantern hangs above the void, dark but listening.',
        { journalText: 'The first lantern answers Mira and proves the routes can still wake.' },
      ),
    ],
  },
  {
    id: 'signal-stair',
    index: 2,
    region: 'Lantern Reach',
    title: 'Signal Stair',
    tagline: 'A stairway of suspended plates climbs into the fog.',
    goal: 'Wake the signal stair and reopen the ascent to the western roofs.',
    storyBeat: 'The first restored routes show Mira that every beacon keeps a memory.',
    reward: 'A stair beacon lights and sketches the old roofline across the haze.',
    palette: {
      skyTop: '#1b3359',
      skyBottom: '#f4cb85',
      far: '#31537e',
      mid: '#4d7695',
      ground: '#7b6047',
      accent: '#ffd987',
    },
    challengeSkills: ['patterns', 'ifThen'],
    landmarks: [
      landmark('stair-start', 'Roof Ledge', 'start', 'The roofs step upward into pale weather.', 'A slanted roof ledge opens the climb.', {
        chargeDelta: 1,
      }),
      landmark('stair-vista', 'Weather Banner', 'vista', 'An old route banner snaps in the updraft, showing the climb is still watched.', 'A banner mast leans out over the stair.', {
        journalText: 'The weather banners still carry route codes for the stair.',
      }),
      landmark('stair-shrine', 'Pulse Plates', 'shrine', 'The stair plates only rise if the pulse order is read correctly.', 'A row of metal plates flickers in sequence.', {
        challengeSkill: 'patterns',
      }),
      landmark('stair-hazard', 'Loose Plate', 'hazard', 'One plate drops under Mira’s foot, draining charge before Nilo steadies the line.', 'A cracked plate hangs on one bolt.', {
        chargeDelta: -1,
      }),
      landmark('stair-beacon', 'Signal Brazier', 'beacon', 'The brazier at the stair summit waits for a correct route condition.', 'A bowl-shaped signal fire sits above the last step.', {
        journalText: 'The signal brazier redraws the western roof ascent in living light.',
      }),
    ],
  },
  {
    id: 'sun-kite-orchard',
    index: 3,
    region: 'Lantern Reach',
    title: 'Sun-Kite Orchard',
    tagline: 'Paper kites and fruit trees float on a sloped terrace of wind.',
    goal: 'Search the orchard for a lost map shard and relight its weather post.',
    storyBeat: 'The route world stops feeling broken and starts feeling worth saving.',
    reward: 'The orchard weather post begins steering safe wind through the district.',
    palette: {
      skyTop: '#173b59',
      skyBottom: '#efc768',
      far: '#2f5d74',
      mid: '#6f8f62',
      ground: '#91633d',
      accent: '#ffe07f',
    },
    challengeSkills: ['deduction', 'classification'],
    landmarks: [
      landmark('orchard-start', 'Kite Gate', 'start', 'A wooden arch hung with torn kites marks the orchard edge.', 'Kites sway between fruit trees.', {
        relicDelta: 1,
      }),
      landmark('orchard-choice', 'Split Terrace', 'hazard', 'One terrace is shaded and quiet. The other glitters with trapped map foil.', 'Two terraces fork around a hanging plum tree.', {
        choice: {
          prompt: 'Which terrace should Mira search?',
          safe: {
            id: 'safe',
            label: 'Take the shaded terrace',
            summary: 'Preserve charge, miss the foil cache.',
            outcome: 'The shade keeps the route calm and Mira crosses without loss.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira stays patient and lets the quiet terrace guide her.',
          },
          risky: {
            id: 'risky',
            label: 'Take the foil terrace',
            summary: 'Grab relics, risk the wind shear.',
            outcome: 'The foil terrace tears at the wind, but Mira pockets a relic before the gust throws her sideways.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira gambles on the foil terrace and comes away brighter but singed.',
          },
        },
      }),
      landmark('orchard-shrine', 'Map Rake', 'shrine', 'A rake of brass teeth hides the true map shard among false markers.', 'Map teeth glint between hanging roots.', {
        challengeSkill: 'deduction',
      }),
      landmark('orchard-cache', 'Fruit Loft', 'cache', 'A loft full of dried sunfruit gives Mira strength for the last climb.', 'A loft tucked into the orchard wall glows warm.', {
        chargeDelta: 1,
        relicDelta: 1,
      }),
      landmark('orchard-beacon', 'Weather Post', 'beacon', 'The weather post wakes when the orchard map is returned to it.', 'A tall brass pole hums over the fruit canopy.', {
        journalText: 'The orchard weather post bends the wind into safe ribbons again.',
      }),
    ],
  },
  {
    id: 'brass-bridge-hollow',
    index: 4,
    region: 'Lantern Reach',
    title: 'Brass Bridge Hollow',
    tagline: 'A market bridge sags above a dark hollow full of clock scraps.',
    goal: 'Restore the market bridge and stop The Quiet from draining its trade light.',
    storyBeat: 'Mira first sees the shape of The Quiet in the places people abandoned.',
    reward: 'The bridge market brightens and small route lanterns return to the stalls.',
    palette: {
      skyTop: '#162843',
      skyBottom: '#d9ad63',
      far: '#433d5d',
      mid: '#6f5d64',
      ground: '#755139',
      accent: '#ffcf76',
    },
    challengeSkills: ['contradiction', 'patterns'],
    landmarks: [
      landmark('bridge-start', 'Market Arch', 'start', 'The hollow begins beneath a market arch full of cold bells.', 'Collapsed stalls line a brass walkway.', {
        chargeDelta: 1,
      }),
      landmark('bridge-vista', 'Clockwell', 'vista', 'Below the bridge, old clock parts sway in the dark and echo back false routes.', 'A deep hollow breathes under the bridge.', {
        journalText: 'The hollow repeats route signals with an empty voice.',
      }),
      landmark('bridge-shrine', 'Trader Seal', 'shrine', 'The market gate only opens when the false bridge message is exposed.', 'A merchant seal blocks the strongest span.', {
        challengeSkill: 'contradiction',
      }),
      landmark('bridge-cache', 'Bell Hook', 'cache', 'A bell hook still holds a trader relic wrapped in copper thread.', 'A hook hangs above the hollow with something gleaming on it.', {
        relicDelta: 1,
      }),
      landmark('bridge-beacon', 'Bridge Crown', 'beacon', 'The bridge crown burns high enough to push The Quiet back from the market.', 'A crown-shaped brazier hangs at the far end of the span.', {
        journalText: 'The bridge crown burns away the hush over the market hollow.',
      }),
    ],
  },
  {
    id: 'beacon-of-first-fire',
    index: 5,
    region: 'Lantern Reach',
    title: 'Beacon Of First Fire',
    tagline: 'The district capstone waits above all the first routes Mira restored.',
    goal: 'Ignite the first major beacon and bind Lantern Reach back into the route web.',
    storyBeat: 'Lantern Reach returns to the map and gifts Mira the Wind Thread.',
    reward: 'Upgrade earned: Wind Thread.',
    rewardUpgrade: 'windThread',
    palette: {
      skyTop: '#102a4a',
      skyBottom: '#f0ba67',
      far: '#35577c',
      mid: '#587698',
      ground: '#835738',
      accent: '#ffe39a',
    },
    challengeSkills: ['ifThen', 'deduction'],
    landmarks: [
      landmark('firstfire-start', 'District Lift', 'start', 'The district lift climbs through every lantern Mira already woke.', 'Suspended ladders and lit windows fall away beneath the route.', {
        chargeDelta: 1,
      }),
      landmark('firstfire-shrine-1', 'Wind Valve', 'shrine', 'A wind valve must be opened by reading its route condition.', 'A ring of brass vanes surrounds the climb.', {
        challengeSkill: 'ifThen',
      }),
      landmark('firstfire-choice', 'Open Span', 'hazard', 'The final climb offers a calm ridge or a wind-torn shortcut full of relic sparks.', 'The path forks into a narrow ridge and a storm-bright cable.', {
        choice: {
          prompt: 'How should Mira make the final climb?',
          safe: {
            id: 'safe',
            label: 'Climb the ridge',
            summary: 'Keep charge for the beacon.',
            outcome: 'The ridge is slow, but Mira reaches the top ready to light the fire.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira takes the ridge and saves her strength for the beacon itself.',
          },
          risky: {
            id: 'risky',
            label: 'Ride the storm cable',
            summary: 'Fast, bright, and rough.',
            outcome: 'The cable throws sparks and one cuts Mira’s hand, but it hides a relic knot near the summit.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira rides the storm cable and arrives with an extra relic and a scorched glove.',
          },
        },
      }),
      landmark('firstfire-shrine-2', 'Capstone Latch', 'shrine', 'The capstone latch responds only to the strongest remaining deduction.', 'A final brass latch anchors the district beacon.', {
        challengeSkill: 'deduction',
      }),
      landmark('firstfire-beacon', 'First Fire', 'beacon', 'The great district beacon wakes with the first honest flame Mira has carried all day.', 'A towering lantern bowl opens above the whole district.', {
        journalText: 'Lantern Reach returns to the sky map and gifts Mira the Wind Thread.',
      }),
    ],
  },
  {
    id: 'whispering-stacks',
    index: 6,
    region: 'Wind Archive',
    title: 'Whispering Stacks',
    tagline: 'Archive towers lean over endless shelves and breathless paper bridges.',
    goal: 'Enter the archive and pull the first route ledger from its sealed stack.',
    storyBeat: 'Mira discovers that the route world was built to be walked and remembered.',
    reward: 'The first archive shelf wakes and begins whispering route names again.',
    palette: {
      skyTop: '#24325c',
      skyBottom: '#b5d0b8',
      far: '#47517b',
      mid: '#69826d',
      ground: '#6b5648',
      accent: '#bfe4d4',
    },
    challengeSkills: ['patterns', 'contradiction'],
    landmarks: [
      landmark('stacks-start', 'Ledger Dock', 'start', 'A dock of stacked books floats beside the archive shell.', 'Shelf bridges and paper ropes sway over the void.', {
        chargeDelta: 1,
      }),
      landmark('stacks-cache', 'Scribe Nest', 'cache', 'A nest of old note-birds holds a relic thread in its paper cup.', 'A paper nest clings to the side of a shelf tower.', {
        relicDelta: 1,
      }),
      landmark('stacks-shrine', 'Shelf Pulse', 'shrine', 'A shelf bridge rises only in the right rhythm.', 'A stack bridge flickers with sequence lights.', {
        challengeSkill: 'patterns',
      }),
      landmark('stacks-vista', 'Listening Rail', 'vista', 'The rail hums with route names spoken by no visible mouth.', 'A rail of brass feathers points toward deeper stacks.', {
        journalText: 'The archive still knows the routes by name, even after years of silence.',
      }),
      landmark('stacks-beacon', 'Ledger Torch', 'beacon', 'The shelf torch opens the first sealed ledger once it is fed living light.', 'A scholar torch hangs above a locked shelf door.', {
        journalText: 'The first archive shelf opens and releases a surviving route ledger.',
      }),
    ],
  },
  {
    id: 'cartographers-spine',
    index: 7,
    region: 'Wind Archive',
    title: "Cartographer's Spine",
    tagline: 'A long backbone bridge binds map rooms that no one has entered in years.',
    goal: 'Cross the backbone bridge and rebuild the route index.',
    storyBeat: 'Mira begins reconstructing the world map instead of chasing isolated beacons.',
    reward: 'The route index hums awake and starts sketching bridges into the air.',
    palette: {
      skyTop: '#2a345e',
      skyBottom: '#c9d6c3',
      far: '#4d5e79',
      mid: '#7a806b',
      ground: '#735948',
      accent: '#d5e7cf',
    },
    challengeSkills: ['classification', 'ifThen'],
    landmarks: [
      landmark('spine-start', 'Index Gate', 'start', 'Map frames hang like ribs around the first bridge span.', 'The archive backbone begins at a ribbed gate.', {
        chargeDelta: 1,
      }),
      landmark('spine-choice', 'Broken Spine', 'hazard', 'A bridge segment has split: a stable crawl path and a bright broken arch.', 'The backbone bridge snaps over a map shaft.', {
        choice: {
          prompt: 'Which span should Mira trust?',
          safe: {
            id: 'safe',
            label: 'Crawl the stable ribs',
            summary: 'Longer, but calm.',
            outcome: 'Mira crawls the ribs and keeps the map case steady.',
            chargeDelta: 0,
            relicDelta: 0,
            journalText: 'Mira chooses patience over showmanship on the broken spine.',
          },
          risky: {
            id: 'risky',
            label: 'Leap the bright arch',
            summary: 'Faster, but unstable.',
            outcome: 'The leap succeeds, but the arch bites charge from the lantern thread.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira clears the bright arch and tears a relic shard from its rail.',
          },
        },
      }),
      landmark('spine-shrine', 'Index Teeth', 'shrine', 'The index teeth sort maps by the right route family.', 'A set of brass teeth surrounds the route index drawer.', {
        challengeSkill: 'classification',
      }),
      landmark('spine-cache', 'Quiet Draft', 'cache', 'A trapped draft hides behind a fallen atlas and restores some charge.', 'A torn atlas wall shields a still pocket of air.', {
        chargeDelta: 1,
      }),
      landmark('spine-beacon', 'Index Lantern', 'beacon', 'The index lantern projects map lines when the route rule is satisfied.', 'A hovering lamp waits over the archive floor.', {
        journalText: 'The route index wakes and starts drawing missing bridges in light.',
      }),
    ],
  },
  {
    id: 'paperwing-ravine',
    index: 8,
    region: 'Wind Archive',
    title: 'Paperwing Ravine',
    tagline: 'Paper gliders drift between canyon walls cut from torn ledgers.',
    goal: 'Ride the paper winds and recover a missing observatory map shard.',
    storyBeat: 'Nilo remembers the Lantern Spine as a pilgrimage route, not a machine corridor.',
    reward: 'A hidden chart chamber opens in the canyon wall.',
    palette: {
      skyTop: '#263d69',
      skyBottom: '#d6d2a8',
      far: '#5b6792',
      mid: '#8d8a66',
      ground: '#765744',
      accent: '#f0e2a0',
    },
    challengeSkills: ['deduction', 'patterns'],
    landmarks: [
      landmark('ravine-start', 'Glider Roost', 'start', 'Paper gliders wheel in wide circles around the ravine mouth.', 'A roost platform tilts into the wind.', {
        relicDelta: 1,
      }),
      landmark('ravine-vista', 'Chart Wall', 'vista', 'The canyon wall is lined with maps stitched into the stone.', 'Layers of torn charts make up the ravine face.', {
        journalText: 'The paper ravine records old flights as if the air itself were a library.',
      }),
      landmark('ravine-shrine', 'Wind Proof', 'shrine', 'A glider gate unlocks when the true route deduction is made.', 'A ring gate hums above the canyon flow.', {
        challengeSkill: 'deduction',
      }),
      landmark('ravine-hazard', 'Slipstream', 'hazard', 'A sudden slipstream steals charge unless Mira braces with the Wind Thread.', 'The canyon narrows and the wind accelerates hard.', {
        chargeDelta: -1,
      }),
      landmark('ravine-beacon', 'Chart Chamber', 'beacon', 'The chamber door opens once the ravine route is proven.', 'A lamp-shaped chamber is carved into the chart wall.', {
        journalText: 'The chart chamber opens and Nilo remembers the true purpose of the Lantern Spine.',
      }),
    ],
  },
  {
    id: 'clockroot-terrace',
    index: 9,
    region: 'Wind Archive',
    title: 'Clockroot Terrace',
    tagline: 'Tree roots and clock gears have grown together on the archive edge.',
    goal: 'Restore the terrace timing locks and recover the star chart spindle.',
    storyBeat: 'The world’s machinery looks less dead and more asleep.',
    reward: 'The terrace lock sings and points to the archive crown.',
    palette: {
      skyTop: '#314267',
      skyBottom: '#c7c099',
      far: '#5a6387',
      mid: '#7e7d5e',
      ground: '#6c513f',
      accent: '#f4da84',
    },
    challengeSkills: ['ifThen', 'classification'],
    landmarks: [
      landmark('clockroot-start', 'Gear Gate', 'start', 'Roots thread through the teeth of a giant wall clock.', 'The terrace begins at a clock gate wrapped in roots.', {
        chargeDelta: 1,
      }),
      landmark('clockroot-cache', 'Root Cup', 'cache', 'A root cup catches rain-light and restores Mira’s lantern charge.', 'A curled root bowl glows at the edge of the path.', {
        chargeDelta: 1,
      }),
      landmark('clockroot-shrine', 'Timing Lock', 'shrine', 'The terrace opens only when the condition of its timing lock is read correctly.', 'A square brass lock ticks beneath the roots.', {
        challengeSkill: 'ifThen',
      }),
      landmark('clockroot-choice', 'Split Escarpment', 'hazard', 'One branch winds through roots. Another cuts over exposed gears full of relic sparks.', 'The terrace splits between green cover and metal shine.', {
        choice: {
          prompt: 'Which route should Mira take?',
          safe: {
            id: 'safe',
            label: 'Follow the roots',
            summary: 'Recover calmly.',
            outcome: 'The roots cradle the lantern and Nilo finds the right footholds.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira trusts the roots and the terrace carries her safely.',
          },
          risky: {
            id: 'risky',
            label: 'Cross the open gears',
            summary: 'Gain relics, lose footing.',
            outcome: 'Mira snatches a relic from the exposed gears but scrapes charge on the climb.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira raids the open gears and pays for it in charge.',
          },
        },
      }),
      landmark('clockroot-beacon', 'Terrace Bell', 'beacon', 'The terrace bell rings once the timing lock and route rule agree.', 'A bell tower rises from root and gear alike.', {
        journalText: 'The terrace bell points Mira toward the crown of the archive.',
      }),
    ],
  },
  {
    id: 'archive-crown',
    index: 10,
    region: 'Wind Archive',
    title: 'Archive Crown',
    tagline: 'The highest archive dome floats over the district like a sleeping observatory.',
    goal: 'Restore the crown dome and recover the lens that reveals the hidden route.',
    storyBeat: 'The second district returns to life and gifts Mira the Echo Lens.',
    reward: 'Upgrade earned: Echo Lens.',
    rewardUpgrade: 'echoLens',
    palette: {
      skyTop: '#2b355b',
      skyBottom: '#d8d7b2',
      far: '#535e81',
      mid: '#84876e',
      ground: '#6a523f',
      accent: '#dff3d4',
    },
    challengeSkills: ['contradiction', 'deduction'],
    landmarks: [
      landmark('crown-start', 'Archive Lift', 'start', 'A lift of book spines carries Mira toward the crown dome.', 'The district glows faintly beneath the lift.', {
        chargeDelta: 1,
      }),
      landmark('crown-shrine-1', 'False Choir', 'shrine', 'A choir of echo bells tries to hide the true route statement.', 'Bell mouths line the dome approach.', {
        challengeSkill: 'contradiction',
      }),
      landmark('crown-cache', 'Lens Niche', 'cache', 'A niche in the dome wall hides an old lens shard and a relic cache.', 'A quiet alcove opens above the cloudline.', {
        relicDelta: 1,
      }),
      landmark('crown-shrine-2', 'Crown Aperture', 'shrine', 'The crown aperture opens only for the strongest final deduction.', 'The dome iris locks around a pale core of light.', {
        challengeSkill: 'deduction',
      }),
      landmark('crown-beacon', 'Crown Dome', 'beacon', 'The dome projects hidden routes when Mira feeds it living flame.', 'The highest archive light waits above the whole district.', {
        journalText: 'The archive crown gifts Mira the Echo Lens and the hidden path beyond the district.',
      }),
    ],
  },
  {
    id: 'rain-needle-flats',
    index: 11,
    region: 'Stormglass Wilds',
    title: 'Rain-Needle Flats',
    tagline: 'Storm needles rise from soaked grass and ring in the rain.',
    goal: 'Walk the first wild route and prove the beacons answer to weather as much as wiring.',
    storyBeat: 'The wild routes show that the sky was always half-living.',
    reward: 'The first storm beacon hums with weather instead of machinery.',
    palette: {
      skyTop: '#314364',
      skyBottom: '#8db2a3',
      far: '#49677e',
      mid: '#5f8469',
      ground: '#4f5d43',
      accent: '#c6fff1',
    },
    challengeSkills: ['patterns', 'ifThen'],
    landmarks: [
      landmark('needle-start', 'Wet Marker', 'start', 'A route marker tilts in the flooded grass.', 'Storm needles ring as rain crosses them.', {
        chargeDelta: 1,
      }),
      landmark('needle-vista', 'Rain Choir', 'vista', 'Every needle sings at a different pitch as the weather shifts.', 'Slender towers glisten through the mist.', {
        journalText: 'The first wild district answers like an instrument, not a machine.',
      }),
      landmark('needle-shrine', 'Needle Rhythm', 'shrine', 'The needle field opens when the weather rhythm is continued correctly.', 'Rain strikes the needles in repeating pulses.', {
        challengeSkill: 'patterns',
      }),
      landmark('needle-hazard', 'Flooded Drift', 'hazard', 'Mira wades through a flooded cut and loses charge to the cold.', 'The path dips into stormwater and hidden stone.', {
        chargeDelta: -1,
      }),
      landmark('needle-beacon', 'Storm Stake', 'beacon', 'The first storm stake wakes when Mira proves she can read the weather route.', 'A storm-scarred post rises from the flats.', {
        journalText: 'The wild beacon hums with weather and invites Mira deeper into the storms.',
      }),
    ],
  },
  {
    id: 'moss-circuit',
    index: 12,
    region: 'Stormglass Wilds',
    title: 'Moss Circuit',
    tagline: 'Living moss trails wrap old circuits and turn metal green again.',
    goal: 'Restore a route where living growth has become the only working wire.',
    storyBeat: 'Mira stops treating the wilds as broken technology and starts treating them as a partner.',
    reward: 'The moss circuit relights and grows fresh path marks.',
    palette: {
      skyTop: '#2c485f',
      skyBottom: '#9dc28d',
      far: '#4b6d70',
      mid: '#648f57',
      ground: '#4a5c39',
      accent: '#d8ffaf',
    },
    challengeSkills: ['classification', 'deduction'],
    landmarks: [
      landmark('moss-start', 'Green Rail', 'start', 'The circuit begins on a rail wrapped in bright moss.', 'Moss bridges the gaps where copper once ran.', {
        chargeDelta: 1,
      }),
      landmark('moss-cache', 'Glow Basin', 'cache', 'A basin of glow moss restores charge and hides a relic bead.', 'A hollow stone bowl shimmers under the vines.', {
        chargeDelta: 1,
        relicDelta: 1,
      }),
      landmark('moss-shrine', 'Living Switch', 'shrine', 'The living switch sorts true route growth from false weeds.', 'A braided knot of stems and brass blocks the trail.', {
        challengeSkill: 'classification',
      }),
      landmark('moss-choice', 'Vine Span', 'hazard', 'One vine span is sturdy. The other glows with rare spores and danger.', 'Two vine bridges hang over a green ravine.', {
        choice: {
          prompt: 'Which vine span should Mira trust?',
          safe: {
            id: 'safe',
            label: 'Use the thick vine',
            summary: 'Stable and plain.',
            outcome: 'Mira crosses on the heavy vine with little trouble.',
            chargeDelta: 0,
            relicDelta: 0,
            journalText: 'Mira trusts the strongest-looking growth and moves steadily through the circuit.',
          },
          risky: {
            id: 'risky',
            label: 'Cross the glowing vine',
            summary: 'Rare spores, sharp bite.',
            outcome: 'The spores cling to Mira’s gloves and yield a relic, but the vine lashes charge from the lantern.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira crosses the glowing vine and comes away stung but richer.',
          },
        },
      }),
      landmark('moss-beacon', 'Growth Node', 'beacon', 'The growth node wakes when metal and moss finally agree on the route.', 'A node of roots and copper opens like a flower.', {
        journalText: 'The moss circuit relights and marks the path with living green fire.',
      }),
    ],
  },
  {
    id: 'mirror-fen',
    index: 13,
    region: 'Stormglass Wilds',
    title: 'Mirror Fen',
    tagline: 'Shallow water reflects false routes beside the real ones.',
    goal: 'Cross the fen without following the route The Quiet wants Mira to see.',
    storyBeat: 'The Quiet finally reveals how it steals paths: by copying them badly.',
    reward: 'The fen mirror cracks and shows the true observatory line.',
    palette: {
      skyTop: '#37506d',
      skyBottom: '#87b5b3',
      far: '#517b8d',
      mid: '#68876d',
      ground: '#536347',
      accent: '#c7fcff',
    },
    challengeSkills: ['contradiction', 'patterns'],
    landmarks: [
      landmark('fen-start', 'Mirror Dock', 'start', 'The first step into the fen already reflects two possible paths.', 'Shallow mirror water covers the ground.', {
        chargeDelta: 1,
      }),
      landmark('fen-vista', 'Still Flats', 'vista', 'The still water copies the sky so perfectly it feels like another world below.', 'Mirror-flat water stretches past the route posts.', {
        journalText: 'The fen teaches Mira that The Quiet does not invent; it imitates.',
      }),
      landmark('fen-shrine', 'False Reflection', 'shrine', 'The route only opens once the false statement in the reflection is exposed.', 'A silvered route seal lies half under the water.', {
        challengeSkill: 'contradiction',
      }),
      landmark('fen-hazard', 'Cold Crossing', 'hazard', 'The water cuts charge from the lantern line as Mira crosses.', 'A flooded stretch forces a careful crossing.', {
        chargeDelta: -1,
      }),
      landmark('fen-beacon', 'Mirror Crack', 'beacon', 'The beacon breaks the false reflection and reveals the next true line.', 'A mirrored lantern stands in the fen center.', {
        journalText: 'The mirror fen cracks and exposes the true observatory line beyond the marsh.',
      }),
    ],
  },
  {
    id: 'thunderloom-canopy',
    index: 14,
    region: 'Stormglass Wilds',
    title: 'Thunderloom Canopy',
    tagline: 'Huge woven vines hang over a storm valley full of electric pollen.',
    goal: 'Climb the canopy and gather the map fragment hidden above the thunderloom.',
    storyBeat: 'Nilo recovers the final map fragment needed to reach the High Observatory.',
    reward: 'The canopy opens a route ladder toward the observatory skyline.',
    palette: {
      skyTop: '#2d4768',
      skyBottom: '#7fc0b0',
      far: '#446b83',
      mid: '#5d8d63',
      ground: '#4b5f41',
      accent: '#d7f989',
    },
    challengeSkills: ['ifThen', 'deduction'],
    landmarks: [
      landmark('canopy-start', 'Vine Root', 'start', 'The thunderloom begins in a root cradle swaying over a valley of static mist.', 'Massive vines climb into the storm canopy.', {
        relicDelta: 1,
      }),
      landmark('canopy-choice', 'Pollen Fork', 'hazard', 'One canopy path is calm and dim. The other glitters with relic pollen and live current.', 'The vines split around a storm blossom.', {
        choice: {
          prompt: 'Which canopy route should Mira climb?',
          safe: {
            id: 'safe',
            label: 'Take the dim braid',
            summary: 'Steady and quiet.',
            outcome: 'The dim braid keeps Mira out of the worst current.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira takes the quiet braid and saves charge for the summit.',
          },
          risky: {
            id: 'risky',
            label: 'Cut through the pollen glow',
            summary: 'More relics, more static.',
            outcome: 'Static pollen burns the lantern line, but Mira comes away with a bright relic.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira climbs through static pollen and pays for it in charge.',
          },
        },
      }),
      landmark('canopy-shrine', 'Storm Loom', 'shrine', 'The loom knot only releases when the route condition is interpreted correctly.', 'A woven storm knot crackles in the canopy.', {
        challengeSkill: 'ifThen',
      }),
      landmark('canopy-cache', 'Sky Nest', 'cache', 'A sky nest holds the last wild relic and enough warm down to steady Mira’s charge.', 'A nest woven from vine silk hangs near the summit.', {
        chargeDelta: 1,
        relicDelta: 1,
      }),
      landmark('canopy-beacon', 'Route Ladder', 'beacon', 'The route ladder wakes and points straight at the observatory skyline.', 'A ladder of living light hangs over the valley.', {
        journalText: 'The route ladder reveals the final path to the High Observatory.',
      }),
    ],
  },
  {
    id: 'wilds-heart-beacon',
    index: 15,
    region: 'Stormglass Wilds',
    title: 'Wilds Heart Beacon',
    tagline: 'A living beacon choir sleeps in the roots of a storm-lit basin.',
    goal: 'Wake the wild beacon choir and earn the Bridge Seed.',
    storyBeat: 'The wild district joins Mira’s journey and gifts her the Bridge Seed.',
    reward: 'Upgrade earned: Bridge Seed.',
    rewardUpgrade: 'bridgeSeed',
    palette: {
      skyTop: '#254563',
      skyBottom: '#9cc592',
      far: '#3f6e7b',
      mid: '#628f55',
      ground: '#46593a',
      accent: '#f0ffb0',
    },
    challengeSkills: ['classification', 'contradiction'],
    landmarks: [
      landmark('heart-start', 'Choir Root', 'start', 'The basin floor glows with roots that answer Mira’s steps.', 'Root lights thread through the basin.', {
        chargeDelta: 1,
      }),
      landmark('heart-shrine-1', 'Seed Vault', 'shrine', 'The seed vault only opens when the true route family is identified.', 'A root vault blocks the choir path.', {
        challengeSkill: 'classification',
      }),
      landmark('heart-vista', 'Choir Basin', 'vista', 'Sleeping beacons rise from the basin like flowers before dawn.', 'A circle of living beacons waits in the dark.', {
        journalText: 'The wild beacons look more like a choir than a machine.',
      }),
      landmark('heart-shrine-2', 'Root Oath', 'shrine', 'The basin oath rejects the false route statement and waits for the contradiction to be exposed.', 'A ring of roots tightens around the final lift.', {
        challengeSkill: 'contradiction',
      }),
      landmark('heart-beacon', 'Wilds Heart', 'beacon', 'The beacon choir wakes together when Mira plants living flame in the basin.', 'A chorus of green-white lights rises through the roots.', {
        journalText: 'The wild beacon choir wakes and gifts Mira the Bridge Seed.',
      }),
    ],
  },
  {
    id: 'glass-ladder',
    index: 16,
    region: 'High Observatory',
    title: 'Glass Ladder',
    tagline: 'A ladder of broken glass decks climbs toward the dead observatory.',
    goal: 'Re-enter the observatory district and stabilize its first shattered ascent.',
    storyBeat: 'The final district finally comes into view as a broken celestial machine.',
    reward: 'The first observatory rung holds and opens the higher route.',
    palette: {
      skyTop: '#20283f',
      skyBottom: '#8da1bf',
      far: '#43506f',
      mid: '#7080a4',
      ground: '#5b5e7b',
      accent: '#d2e0ff',
    },
    challengeSkills: ['patterns', 'ifThen'],
    landmarks: [
      landmark('glass-start', 'Rung Dock', 'start', 'The first glass deck shivers as Mira steps onto it.', 'Glass ladders climb toward the dark observatory shell.', {
        chargeDelta: 1,
      }),
      landmark('glass-cache', 'Wind Thread Hook', 'cache', 'The Wind Thread pulls a hidden cache from beneath a ladder rung.', 'A hook hangs under a shattered step.', {
        relicDelta: 1,
        journalText: 'The Wind Thread exposes hidden caches in the observatory climb.',
      }),
      landmark('glass-shrine', 'Rung Sequence', 'shrine', 'The broken ladder only rebuilds if its rung sequence is continued correctly.', 'Glass rungs blink in cold rhythm.', {
        challengeSkill: 'patterns',
      }),
      landmark('glass-hazard', 'Shatter Step', 'hazard', 'A cracked rung cuts charge from the lantern as Mira lands on it.', 'One ladder span splinters underfoot.', {
        chargeDelta: -1,
      }),
      landmark('glass-beacon', 'First Rung Beacon', 'beacon', 'A cold observatory lamp wakes on the first stable rung.', 'A blue-white lamp hangs over the climb.', {
        journalText: 'The first observatory rung steadies and makes the high path real again.',
      }),
    ],
  },
  {
    id: 'hollow-orrery',
    index: 17,
    region: 'High Observatory',
    title: 'Hollow Orrery',
    tagline: 'A gigantic empty orrery turns in silence around a missing center.',
    goal: 'Cross the turning machine and restore its route orbit.',
    storyBeat: 'Mira sees the sky machine from inside and realizes it was built for travelers, not rulers.',
    reward: 'The orrery turns with purpose again and aligns the next route.',
    palette: {
      skyTop: '#1d243c',
      skyBottom: '#9aa4c2',
      far: '#46506e',
      mid: '#747e99',
      ground: '#545c73',
      accent: '#e9f0ff',
    },
    challengeSkills: ['deduction', 'classification'],
    landmarks: [
      landmark('orrery-start', 'Orbit Ring', 'start', 'The outer ring of the orrery rotates under Mira’s feet.', 'A giant ring path circles the machine.', {
        chargeDelta: 1,
      }),
      landmark('orrery-vista', 'Empty Center', 'vista', 'The orrery’s heart is missing, leaving the whole machine feeling abandoned instead of dead.', 'The center of the machine is a hollow sky well.', {
        journalText: 'The machine was designed for movement through it, not worship of it.',
      }),
      landmark('orrery-shrine', 'Orbit Proof', 'shrine', 'The orbit lock opens only for the strongest remaining conclusion.', 'A rotating lock rides the inner ring.', {
        challengeSkill: 'deduction',
      }),
      landmark('orrery-choice', 'Counterweight Split', 'hazard', 'One counterweight is steady. The other hides a relic cache behind a failing track.', 'Two weight tracks cut across the orrery shell.', {
        choice: {
          prompt: 'How should Mira cross the counterweights?',
          safe: {
            id: 'safe',
            label: 'Take the steady track',
            summary: 'Preserve charge.',
            outcome: 'Mira stays balanced and keeps the lantern line steady.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira uses the steady counterweight and saves charge for the core.',
          },
          risky: {
            id: 'risky',
            label: 'Cut through the failing track',
            summary: 'Gain relics, risk the fall.',
            outcome: 'The track coughs sparks and costs charge, but Mira tears a relic free from the hidden brace.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira raids the failing track for a relic and barely keeps balance.',
          },
        },
      }),
      landmark('orrery-beacon', 'Axis Light', 'beacon', 'The axis light restarts the orrery rotation in the right alignment.', 'A pale axis lamp hangs over the hollow center.', {
        journalText: 'The hollow orrery turns with purpose again and aligns the next route.',
      }),
    ],
  },
  {
    id: 'starwell-causeway',
    index: 18,
    region: 'High Observatory',
    title: 'Starwell Causeway',
    tagline: 'A long causeway bridges several wells of cold starlight.',
    goal: 'Cross the causeway and prove the final route logic in sequence.',
    storyBeat: 'Mira comes within reach of the Lantern Spine and the whole world’s missing center.',
    reward: 'The causeway lights a direct line into the observatory heart.',
    palette: {
      skyTop: '#1f2942',
      skyBottom: '#a2b1d0',
      far: '#445877',
      mid: '#748ba6',
      ground: '#5a6177',
      accent: '#e3f6ff',
    },
    challengeSkills: ['contradiction', 'ifThen'],
    landmarks: [
      landmark('starwell-start', 'Well Gate', 'start', 'The first starwell sits black and still beside the gate.', 'A straight causeway runs above several star wells.', {
        chargeDelta: 1,
      }),
      landmark('starwell-shrine-1', 'Well Statement', 'shrine', 'The first well must reject the false route claim before it will shine.', 'A frozen statement ring hangs above the well.', {
        challengeSkill: 'contradiction',
      }),
      landmark('starwell-cache', 'Blue Cache', 'cache', 'A blue cache hidden in the side rail restores charge for the last approach.', 'A narrow side rail hides a cold reserve lamp.', {
        chargeDelta: 1,
        relicDelta: 1,
      }),
      landmark('starwell-shrine-2', 'Causeway Lock', 'shrine', 'The causeway lock obeys only when its final condition is interpreted correctly.', 'A pale lock glows in the center of the bridge.', {
        challengeSkill: 'ifThen',
      }),
      landmark('starwell-beacon', 'Causeway Core', 'beacon', 'The causeway core ignites and opens the final observatory approach.', 'A star-fed lantern waits above the last well.', {
        journalText: 'The causeway opens the direct line into the observatory heart.',
      }),
    ],
  },
  {
    id: 'moon-reservoir',
    index: 19,
    region: 'High Observatory',
    title: 'Moon Reservoir',
    tagline: 'The observatory keeps an entire reservoir of reflected night in one suspended bowl.',
    goal: 'Restore the reservoir and hold enough charge for the final climb.',
    storyBeat: 'Mira chooses restoration over control before she even reaches the end.',
    reward: 'The reservoir fills with honest light and steadies the final ascent.',
    palette: {
      skyTop: '#202742',
      skyBottom: '#99afcb',
      far: '#485572',
      mid: '#7889a1',
      ground: '#576076',
      accent: '#f4f8ff',
    },
    challengeSkills: ['deduction', 'patterns'],
    landmarks: [
      landmark('reservoir-start', 'Reservoir Lip', 'start', 'The bowl edge hums with old moonlight.', 'A curved stone lip circles the suspended reservoir.', {
        chargeDelta: 1,
      }),
      landmark('reservoir-vista', 'Night Bowl', 'vista', 'The whole reservoir reflects a sky the world has almost forgotten.', 'Dark water shines with pale stars.', {
        journalText: 'The observatory saved night itself in a bowl of still water.',
      }),
      landmark('reservoir-choice', 'Mirror Rail', 'hazard', 'A safe rail follows the rim. A broken mirror rail hides a relic behind falling glass.', 'Two rails cut across the bowl edge.', {
        choice: {
          prompt: 'How should Mira approach the final lock?',
          safe: {
            id: 'safe',
            label: 'Follow the rim rail',
            summary: 'Keep charge for the last level.',
            outcome: 'The rim rail holds and Mira keeps the lantern flame steady.',
            chargeDelta: 1,
            relicDelta: 0,
            journalText: 'Mira chooses endurance over greed at the reservoir.',
          },
          risky: {
            id: 'risky',
            label: 'Cross the mirror rail',
            summary: 'One last relic, one last risk.',
            outcome: 'The mirror rail shatters underfoot, but Mira steals a relic from its center before escaping.',
            chargeDelta: -1,
            relicDelta: 1,
            journalText: 'Mira takes one last greedy path before the final ascent.',
          },
        },
      }),
      landmark('reservoir-shrine', 'Night Seal', 'shrine', 'The reservoir seal accepts only the strongest last deduction before the spine.', 'A blue-white seal floats above the water.', {
        challengeSkill: 'deduction',
      }),
      landmark('reservoir-beacon', 'Reservoir Crown', 'beacon', 'The crown fills the bowl with honest light and steadies Mira’s final ascent.', 'A silver crown lantern rests on the bowl center.', {
        journalText: 'The reservoir fills with honest light and prepares the way to the Lantern Spine.',
      }),
    ],
  },
  {
    id: 'lantern-spine',
    index: 20,
    region: 'High Observatory',
    title: 'Lantern Spine',
    tagline: 'The world’s central route hangs shattered over the empty sky.',
    goal: 'Relight the Lantern Spine and return the world to motion.',
    storyBeat: 'Mira does not conquer the world machine. She walks it back to life.',
    reward: 'Upgrade earned: Spine Flame.',
    rewardUpgrade: 'spineFlame',
    palette: {
      skyTop: '#171f36',
      skyBottom: '#b2bed8',
      far: '#394a69',
      mid: '#6d80a3',
      ground: '#566078',
      accent: '#fff3b5',
    },
    challengeSkills: ['classification', 'contradiction'],
    landmarks: [
      landmark('spine-start', 'Spine Threshold', 'start', 'The final threshold opens over empty air where all districts meet.', 'The broken spine stretches into the white distance.', {
        chargeDelta: 1,
      }),
      landmark('spine-shrine-1', 'Memory Lattice', 'shrine', 'The spine lattice reorders only when the true route family is named.', 'A giant lattice of lantern sockets turns in the void.', {
        challengeSkill: 'classification',
      }),
      landmark('spine-vista', 'Silent World', 'vista', 'From the spine Mira can see every relit district waiting for the last bridge.', 'All four districts glow below the final route.', {
        journalText: 'Mira sees the whole world waiting below the final bridge.',
      }),
      landmark('spine-shrine-2', 'Quiet Break', 'shrine', 'The final break in the spine only yields when The Quiet’s false route is exposed.', 'A pale seam of silence blocks the last light well.', {
        challengeSkill: 'contradiction',
      }),
      landmark('spine-beacon', 'Spine Flame', 'beacon', 'The world’s central lantern wakes and the whole sky map moves again.', 'A colossal lantern opens like dawn over the empty sky.', {
        journalText: 'The Lantern Spine relights, the routes return, and Mira chooses a world open to travelers.',
      }),
    ],
  },
]
