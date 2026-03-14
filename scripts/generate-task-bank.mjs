import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const skillSources = {
  classification: [1, 3, 11],
  patterns: [3, 9, 10],
  ifThen: [2, 12, 17],
  contradiction: [4, 6, 14],
  deduction: [10, 11, 15],
}

const chapters = [
  ['Lantern Reach', 1],
  ['Lantern Reach', 2],
  ['Lantern Reach', 3],
  ['The Wind Archive', 1],
  ['The Wind Archive', 2],
  ['The Wind Archive', 3],
  ['Stormglass Wilds', 1],
  ['Stormglass Wilds', 2],
  ['Stormglass Wilds', 3],
  ['The High Observatory', 1],
  ['The High Observatory', 2],
  ['The High Observatory', 3],
]

function makeExplanation(summary, first, second, whyNow) {
  return {
    summary,
    steps: [first, second],
    whyNow,
  }
}

function buildClassificationTasks() {
  const seeds = [
    {
      id: 'repair-tools',
      label: 'bridge repair tools',
      members: ['rope clamp', 'gear key', 'glass wrench'],
      outsider: 'cloud pear',
      fit: 'signal hammer',
      mission: 'repair quest',
      reward: 'A bridge lock clicks into place.',
    },
    {
      id: 'weather-readers',
      label: 'weather-reading tools',
      members: ['wind vane', 'storm dial', 'mist ribbon'],
      outsider: 'soup ladle',
      fit: 'rain gauge',
      mission: 'route quest',
      reward: 'The beacon can read the sky again.',
    },
    {
      id: 'archive-notes',
      label: 'archive records',
      members: ['route log', 'beacon sketch', 'village message'],
      outsider: 'glider wheel',
      fit: 'signal journal',
      mission: 'investigation quest',
      reward: 'A hidden shelf slides open.',
    },
    {
      id: 'lantern-parts',
      label: 'lantern parts',
      members: ['glass lens', 'light wick', 'brass ring'],
      outsider: 'bread basket',
      fit: 'glow filament',
      mission: 'repair quest',
      reward: 'A lantern frame steadies in Tala’s hands.',
    },
    {
      id: 'village-supplies',
      label: 'village supply bundles',
      members: ['grain sack', 'water jar', 'blanket roll'],
      outsider: 'signal crystal',
      fit: 'fruit crate',
      mission: 'service quest',
      reward: 'The village landing platform reopens.',
    },
  ]

  return seeds.flatMap((seed, index) => {
    const [region, chapter] = chapters[index]
    return [
      {
        id: `classification-${seed.id}-odd`,
        title: `Sort the ${seed.id.replaceAll('-', ' ')}`,
        skill: 'classification',
        subskill: 'odd-one-out',
        difficulty: 1,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Mira is packing ${seed.label}. Which item does not belong with the others?`,
        choices: [seed.members[0], seed.outsider, seed.members[1], seed.members[2]],
        correctIndex: 1,
        hintSteps: [
          `Three choices all help with the same job: ${seed.label}.`,
          `Look for the one item that cannot be used in that kind of kit.`,
        ],
        explanation: makeExplanation(
          `${seed.outsider} does not belong because the other three are all part of ${seed.label}.`,
          `First notice what the matching items have in common.`,
          `Then remove the one choice that breaks that shared rule.`,
          'Classification means finding the rule first, then checking each item against it.',
        ),
        sourceTrace: {
          sourceIds: skillSources.classification,
          note: 'Reviewed classification exercise adapted from the logic corpus into expedition inventory sorting.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `classification-${seed.id}-label`,
        title: `Name the right bundle`,
        skill: 'classification',
        subskill: 'group-label',
        difficulty: 2,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `These items belong together: ${seed.members.join(', ')}, and ${seed.fit}. Which label fits that set best?`,
        choices: [seed.label, 'camp snacks', 'storm creatures', 'festival music'],
        correctIndex: 0,
        hintSteps: [
          'Do not look at the items one by one. Look for the one job they all share.',
          'Only one answer names the whole group instead of a random theme.',
        ],
        explanation: makeExplanation(
          `${seed.label} is correct because every item in the set helps with that same mission role.`,
          'A category label should cover every example in the group.',
          'If one item would not fit the label, the label is too broad or wrong.',
          'Strong classification uses one clean rule that works for every example.',
        ),
        sourceTrace: {
          sourceIds: skillSources.classification,
          note: 'Reviewed category-label task using corpus-inspired sorting and grouping patterns.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `classification-${seed.id}-fit`,
        title: `Complete the kit`,
        skill: 'classification',
        subskill: 'set-completion',
        difficulty: 3,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Tala already packed ${seed.members.join(', ')}. Which choice should join them to keep the same kind of kit?`,
        choices: [seed.fit, 'feather pillow', 'festival ribbon', 'tea biscuit'],
        correctIndex: 0,
        hintSteps: [
          'Ask which option matches the same mission use as the packed items.',
          'Three options are harmless, but only one truly belongs in the same kit.',
        ],
        explanation: makeExplanation(
          `${seed.fit} matches the same category as the packed items, so it completes the kit.`,
          'Good classification can work in reverse: once you know the category, add the matching item.',
          'Ignore choices that are nice to have but serve a different purpose.',
          'This helps a Pathfinder add the right tool instead of grabbing something random.',
        ),
        sourceTrace: {
          sourceIds: skillSources.classification,
          note: 'Reviewed set-completion task grounded in curated classification practice.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `classification-${seed.id}-belongs`,
        title: `Choose the right pile`,
        skill: 'classification',
        subskill: 'placement-by-rule',
        difficulty: 4,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Orin places ${seed.fit} on the table. Which pile should it go into?`,
        choices: [seed.label, 'meal basket', 'festival extras', 'animal care'],
        correctIndex: 0,
        hintSteps: [
          `Think about the rule behind ${seed.fit}, not what it looks like.`,
          'The right pile is the one whose purpose matches the item’s job.',
        ],
        explanation: makeExplanation(
          `${seed.fit} belongs with ${seed.label} because it serves that same expedition role.`,
          'A classification rule should guide where a new item goes.',
          'The best answer is the pile that would still make sense for every item in the set.',
          'This is how Pathfinders keep fast-moving missions organized without guesswork.',
        ),
        sourceTrace: {
          sourceIds: skillSources.classification,
          note: 'Reviewed placement-by-rule task with explicit category reasoning and source trace.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
    ]
  })
}

function buildPatternTasks() {
  const seeds = [
    {
      id: 'amber-route',
      sequence: ['gold', 'silver', 'gold', 'silver'],
      next: 'gold',
      numberStart: [2, 4, 6, 8],
      numberNext: '10',
      mission: 'route quest',
      reward: 'A route line draws itself across the map.',
    },
    {
      id: 'echo-chimes',
      sequence: ['north', 'east', 'north', 'east'],
      next: 'north',
      numberStart: [3, 6, 9, 12],
      numberNext: '15',
      mission: 'investigation quest',
      reward: 'The echo tower answers in the right rhythm.',
    },
    {
      id: 'mirror-pulses',
      sequence: ['sun', 'moon', 'sun', 'moon'],
      next: 'sun',
      numberStart: [5, 7, 9, 11],
      numberNext: '13',
      mission: 'repair quest',
      reward: 'A mirror array flashes in sequence.',
    },
    {
      id: 'bridge-lights',
      sequence: ['short', 'short', 'long', 'short', 'short', 'long'],
      next: 'short',
      numberStart: [4, 8, 12, 16],
      numberNext: '20',
      mission: 'service quest',
      reward: 'Bridge lights ripple in a clean wave.',
    },
    {
      id: 'storm-ribbon',
      sequence: ['left', 'right', 'left', 'right'],
      next: 'left',
      numberStart: [1, 3, 5, 7],
      numberNext: '9',
      mission: 'route quest',
      reward: 'A storm ribbon settles and points the safe way.',
    },
  ]

  return seeds.flatMap((seed, index) => {
    const [region, chapter] = chapters[index + 2]
    return [
      {
        id: `patterns-${seed.id}-signal`,
        title: 'Read the lantern signal',
        skill: 'patterns',
        subskill: 'alternation',
        difficulty: 1,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `The lantern pulses go ${seed.sequence.join(', ')}. What comes next?`,
        choices: [seed.next, 'double', 'quiet', 'turn'],
        correctIndex: 0,
        hintSteps: [
          'Say the pattern slowly and check which part keeps repeating.',
          'The answer should continue the same rhythm, not start a new one.',
        ],
        explanation: makeExplanation(
          `${seed.next} continues the repeated pattern exactly.`,
          'A pattern is a rule that repeats or grows in a steady way.',
          'When the first four or six parts repeat, the next part follows that same rule.',
          'Pattern reading helps Pathfinders decode route signals without guessing.',
        ),
        sourceTrace: {
          sourceIds: skillSources.patterns,
          note: 'Reviewed pattern-extension task adapted from curated signal and sequence exercises.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `patterns-${seed.id}-number`,
        title: 'Restore the route count',
        skill: 'patterns',
        subskill: 'numeric-sequence',
        difficulty: 2,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Route stones show ${seed.numberStart.join(', ')}. Which number should come next?`,
        choices: [seed.numberNext, '6', '11', '14'],
        correctIndex: 0,
        hintSteps: [
          'Compare each pair of numbers. How much does the count change each time?',
          'Once you see the step size, use it one more time.',
        ],
        explanation: makeExplanation(
          `${seed.numberNext} is correct because the numbers grow by the same amount each time.`,
          'Look at the difference between one number and the next.',
          'Apply that same difference once more to continue the pattern.',
          'This is the same skill the guild uses to predict route timing and pulse counts.',
        ),
        sourceTrace: {
          sourceIds: skillSources.patterns,
          note: 'Reviewed numeric-pattern task drawn from logic and puzzle source material.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `patterns-${seed.id}-missing`,
        title: 'Find the missing pulse',
        skill: 'patterns',
        subskill: 'missing-step',
        difficulty: 3,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `A pulse strip reads ${seed.sequence[0]}, ?, ${seed.sequence[2]}, ${seed.sequence[3]}. Which piece fits the missing spot?`,
        choices: [seed.sequence[1], seed.sequence[2], 'turn', 'quiet'],
        correctIndex: 0,
        hintSteps: [
          'Use the repeating rule from the pieces you can already see.',
          'The missing part must make the full row repeat cleanly.',
        ],
        explanation: makeExplanation(
          `${seed.sequence[1]} completes the pattern and keeps the rule steady.`,
          'A missing-step problem still uses the same repeating or growing rule.',
          'Test each option and keep the one that makes the whole row consistent.',
          'This helps a Pathfinder repair broken signals when one lantern flickers out.',
        ),
        sourceTrace: {
          sourceIds: skillSources.patterns,
          note: 'Reviewed missing-step pattern exercise with explicit continuation logic.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `patterns-${seed.id}-choice`,
        title: 'Choose the matching strip',
        skill: 'patterns',
        subskill: 'matching-rule',
        difficulty: 4,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Which strip follows the same rule as ${seed.sequence.join(', ')}?`,
        choices: [
          `${seed.sequence[0]}, ${seed.sequence[1]}, ${seed.sequence[0]}, ${seed.sequence[1]}`,
          'gold, gold, silver, silver',
          'north, south, east, west',
          'short, long, long, short',
        ],
        correctIndex: 0,
        hintSteps: [
          'Ignore the exact words and compare the structure.',
          'Only one answer repeats in the same order and rhythm.',
        ],
        explanation: makeExplanation(
          'The first strip matches because it repeats using the same structure as the original.',
          'Pattern matching is about the rule, not the decoration.',
          'If the order changes, the rule changes too.',
          'That is how the guild compares route codes even when the symbols look different.',
        ),
        sourceTrace: {
          sourceIds: skillSources.patterns,
          note: 'Reviewed matching-rule task with structure-over-surface emphasis.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
    ]
  })
}

function buildIfThenTasks() {
  const seeds = [
    {
      id: 'bridge-switch',
      rule: 'If the bridge lantern is blue, reopen the west bridge. If it is amber, check the rope wheel.',
      condition: 'The bridge lantern is blue.',
      correct: 'Reopen the west bridge.',
      mission: 'repair quest',
      reward: 'The west bridge unfolds over the clouds.',
    },
    {
      id: 'storm-beacon',
      rule: 'If the storm dial points east, lower the silver vane. If it points west, raise the copper vane.',
      condition: 'The storm dial points west.',
      correct: 'Raise the copper vane.',
      mission: 'route quest',
      reward: 'A safe wind lane steadies for the gliders.',
    },
    {
      id: 'archive-lock',
      rule: 'If the archive key glows green, open shelf three. If it glows violet, open shelf five.',
      condition: 'The key glows green.',
      correct: 'Open shelf three.',
      mission: 'investigation quest',
      reward: 'A hidden row of maps slides forward.',
    },
    {
      id: 'garden-tubes',
      rule: 'If the tube is marked sunrise, send water north. If it is marked moonrise, send water south.',
      condition: 'The tube is marked moonrise.',
      correct: 'Send water south.',
      mission: 'service quest',
      reward: 'The glow vines begin to brighten again.',
    },
    {
      id: 'mirror-gate',
      rule: 'If the mirror shows a star, angle it high. If it shows a circle, angle it low.',
      condition: 'The mirror shows a star.',
      correct: 'Angle it high.',
      mission: 'route quest',
      reward: 'The observatory gate unlocks with a quiet click.',
    },
  ]

  return seeds.flatMap((seed, index) => {
    const [region, chapter] = chapters[index + 4]
    return [
      {
        id: `ifthen-${seed.id}-basic`,
        title: 'Read the machine rule',
        skill: 'ifThen',
        subskill: 'single-condition',
        difficulty: 1,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `${seed.rule} ${seed.condition} What should Mira do?`,
        choices: [seed.correct, 'Wait and watch', 'Do both actions', 'Ask a villager'],
        correctIndex: 0,
        hintSteps: [
          'Find the condition that is true right now.',
          'Then follow only the action attached to that condition.',
        ],
        explanation: makeExplanation(
          seed.correct,
          'An if/then rule only tells you what to do when its condition is true.',
          'Ignore the other branch because its condition did not happen.',
          'Pathfinders use this skill to operate calm, rule-based machines safely.',
        ),
        sourceTrace: {
          sourceIds: skillSources.ifThen,
          note: 'Reviewed conditional-reasoning task using machine control rules inspired by the logic corpus.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `ifthen-${seed.id}-reverse`,
        title: 'Match the condition',
        skill: 'ifThen',
        subskill: 'condition-action-match',
        difficulty: 2,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `The crew just did this action: "${seed.correct}" Which condition must have been true?`,
        choices: [seed.condition.replace('.', ''), 'The opposite signal appeared', 'Both signals appeared', 'No signal appeared'],
        correctIndex: 0,
        hintSteps: [
          'Work backward from the action to the rule that caused it.',
          'Only one condition points to that exact move.',
        ],
        explanation: makeExplanation(
          `${seed.condition} leads to that action, so it must have been the true condition.`,
          'Conditional reasoning can move backward too: action tells you which rule branch was used.',
          'Choose the condition linked to the exact action you saw.',
          'That lets a Pathfinder explain why a machine acted a certain way.',
        ),
        sourceTrace: {
          sourceIds: skillSources.ifThen,
          note: 'Reviewed reverse-condition task built from constrained logic rules.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `ifthen-${seed.id}-block`,
        title: 'Avoid the wrong branch',
        skill: 'ifThen',
        subskill: 'branch-discrimination',
        difficulty: 3,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Tala says: "${seed.rule}" ${seed.condition} Which action should the crew NOT do first?`,
        choices: ['Do the other branch from the rule.', seed.correct, 'Mark the result in the log', 'Stay calm'],
        correctIndex: 0,
        hintSteps: [
          'One choice breaks the rule because it belongs to the other branch.',
          'The other answers could still happen, but only one is wrong first.',
        ],
        explanation: makeExplanation(
          'The other branch is wrong because it belongs to a condition that is not true.',
          'If/then reasoning means following the branch that matches the current signal.',
          'Using the wrong branch can undo the repair or send the crew the wrong way.',
          'That is why calm rule reading matters more than speed.',
        ),
        sourceTrace: {
          sourceIds: skillSources.ifThen,
          note: 'Reviewed branch-discrimination task tied to safe machine handling.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `ifthen-${seed.id}-two-step`,
        title: 'Plan the first move',
        skill: 'ifThen',
        subskill: 'conditional-planning',
        difficulty: 4,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `The rule decides the first move, and after that Orin will record the result. ${seed.rule} ${seed.condition} What is the first move?`,
        choices: [seed.correct, 'Record the result first', 'Use both branches at once', 'Skip to the reward scene'],
        correctIndex: 0,
        hintSteps: [
          'Sequence matters. The rule controls the first move before anything else.',
          'Pick the action linked to the true condition, not the step that happens later.',
        ],
        explanation: makeExplanation(
          `The first move is "${seed.correct}" because the true condition selects that branch before any later step.`,
          'Conditional planning starts by checking which condition is active.',
          'Only then do you take the matching action and move to later tasks.',
          'This keeps Pathfinder repairs steady even when missions feel busy.',
        ),
        sourceTrace: {
          sourceIds: skillSources.ifThen,
          note: 'Reviewed two-step conditional-planning task grounded in deterministic rules.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
    ]
  })
}

function buildContradictionTasks() {
  const seeds = [
    {
      id: 'tower-notes',
      setup: [
        'The west tower lantern was dark all morning.',
        'The west tower lantern was glowing at sunrise.',
        'The tower keeper had not repaired the lantern yet.',
      ],
      wrong: 'The west tower lantern was glowing at sunrise.',
      mission: 'investigation quest',
      reward: 'A false report gets cleared from the tower log.',
    },
    {
      id: 'bridge-messages',
      setup: [
        'No cargo crossed the bridge before lunch.',
        'A grain cart crossed the bridge at dawn.',
        'The bridge gate stayed closed until lunch.',
      ],
      wrong: 'A grain cart crossed the bridge at dawn.',
      mission: 'service quest',
      reward: 'The bridge report becomes trustworthy again.',
    },
    {
      id: 'archive-pages',
      setup: [
        'Shelf five stayed locked all day.',
        'Mira removed a journal from shelf five at noon.',
        'Nobody had the spare key at noon.',
      ],
      wrong: 'Mira removed a journal from shelf five at noon.',
      mission: 'investigation quest',
      reward: 'The archive timeline finally fits together.',
    },
    {
      id: 'storm-dial',
      setup: [
        'The storm dial pointed east the whole time.',
        'No one touched the dial after breakfast.',
        'At noon the dial pointed west.',
      ],
      wrong: 'At noon the dial pointed west.',
      mission: 'route quest',
      reward: 'The weather log stops sending mixed warnings.',
    },
    {
      id: 'village-lights',
      setup: [
        'Every lantern in the lane was dark at dusk.',
        'The baker said the lane glowed brightly at dusk.',
        'The lantern relight had not started yet.',
      ],
      wrong: 'The baker said the lane glowed brightly at dusk.',
      mission: 'service quest',
      reward: 'The lane report reads clearly at last.',
    },
  ]

  return seeds.flatMap((seed, index) => {
    const [region, chapter] = chapters[index + 6]
    return [
      {
        id: `contradiction-${seed.id}-which`,
        title: 'Catch the false note',
        skill: 'contradiction',
        subskill: 'incompatible-claim',
        difficulty: 2,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Three notes should describe the same event. Which one cannot fit with the others?\n1. ${seed.setup[0]}\n2. ${seed.setup[1]}\n3. ${seed.setup[2]}`,
        choices: [seed.setup[0], seed.setup[1], seed.setup[2], 'All three can fit'],
        correctIndex: 1,
        hintSteps: [
          'Find the claim that breaks what the other notes say happened.',
          'If two notes make one timeline, the contradiction is the one that cannot fit into it.',
        ],
        explanation: makeExplanation(
          `"${seed.wrong}" contradicts the other notes, so it cannot be true at the same time.`,
          'A contradiction means two statements cannot both be true together.',
          'Keep the notes that form one consistent story and remove the one that breaks it.',
          'That helps Pathfinders trust the right report before acting.',
        ),
        sourceTrace: {
          sourceIds: skillSources.contradiction,
          note: 'Reviewed contradiction-detection task adapted into guild-note auditing.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `contradiction-${seed.id}-repair`,
        title: 'Repair the report',
        skill: 'contradiction',
        subskill: 'report-repair',
        difficulty: 3,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Which note should Tala remove to make the report consistent?`,
        choices: [seed.setup[0], seed.wrong, seed.setup[2], 'Remove nothing'],
        correctIndex: 1,
        hintSteps: [
          'You only need to remove one note to make the story fit again.',
          'Choose the note that fights with the timeline built by the other two.',
        ],
        explanation: makeExplanation(
          `Removing "${seed.wrong}" leaves a consistent report behind.`,
          'Report repair is contradiction detection with a clear action: remove the impossible claim.',
          'The best answer is the note that prevents the other facts from fitting together.',
          'This keeps the guild from making decisions using bad evidence.',
        ),
        sourceTrace: {
          sourceIds: skillSources.contradiction,
          note: 'Reviewed report-repair exercise tied to conflict resolution in evidence.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `contradiction-${seed.id}-question`,
        title: 'Ask the right question',
        skill: 'contradiction',
        subskill: 'conflict-check',
        difficulty: 4,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Which question would help check the contradiction fastest?`,
        choices: [
          'Which note talks about the same moment in time?',
          'What color was the tower paint?',
          'Who likes soup for lunch?',
          'How high are the clouds today?',
        ],
        correctIndex: 0,
        hintSteps: [
          'A good contradiction question checks whether the notes really describe the same time or event.',
          'Only one choice helps compare the claims directly.',
        ],
        explanation: makeExplanation(
          'Checking whether the notes describe the same moment helps expose the contradiction quickly.',
          'Contradiction spotting gets easier when you compare time, place, and event carefully.',
          'Questions about unrelated details do not help you test the conflict.',
          'This is how a calm investigator keeps the mission focused.',
        ),
        sourceTrace: {
          sourceIds: skillSources.contradiction,
          note: 'Reviewed conflict-check task emphasizing useful verification questions.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `contradiction-${seed.id}-fit`,
        title: 'Choose the safe conclusion',
        skill: 'contradiction',
        subskill: 'safe-inference',
        difficulty: 5,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Until the contradiction is fixed, what is the safest conclusion?`,
        choices: [
          'One note is wrong, so the crew should check before acting.',
          'Every note must be true somehow.',
          'The loudest speaker is always correct.',
          'Contradictions never matter in real missions.',
        ],
        correctIndex: 0,
        hintSteps: [
          'A contradiction means you should slow down and verify, not guess.',
          'The safe conclusion respects uncertainty instead of pretending it is solved.',
        ],
        explanation: makeExplanation(
          'The safest conclusion is that one note is wrong and the crew should verify before acting.',
          'Contradictions are a signal to pause and check evidence.',
          'Good reasoning protects the mission from fast but careless decisions.',
          'That is part of what makes a Pathfinder trustworthy.',
        ),
        sourceTrace: {
          sourceIds: skillSources.contradiction,
          note: 'Reviewed safe-inference task tied to contradiction handling and mission safety.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
    ]
  })
}

function buildDeductionTasks() {
  const seeds = [
    {
      id: 'glider-docks',
      clues: [
        'The supply glider did not land at the north dock.',
        'The glider carrying grain landed beside the green banner.',
        'The east dock has the green banner.',
      ],
      answer: 'The grain glider landed at the east dock.',
      mission: 'route quest',
      reward: 'The dock ledger finally points to the right island.',
    },
    {
      id: 'tool-crate',
      clues: [
        'The repair crystal is not in the blue crate.',
        'The crate on the top shelf holds the repair crystal.',
        'The green crate is on the top shelf.',
      ],
      answer: 'The repair crystal is in the green crate.',
      mission: 'repair quest',
      reward: 'Mira grabs the right crate on the first try.',
    },
    {
      id: 'signal-route',
      clues: [
        'The true route avoids the fog bridge.',
        'Only the south route avoids the fog bridge and reaches the tower.',
        'The crew must reach the tower today.',
      ],
      answer: 'The crew should take the south route.',
      mission: 'route quest',
      reward: 'The route line reaches the tower without delay.',
    },
    {
      id: 'archive-key',
      clues: [
        'The silver key is not in Mira’s pocket.',
        'The key in Tala’s satchel opens shelf seven.',
        'The silver key opens shelf seven.',
      ],
      answer: 'The silver key is in Tala’s satchel.',
      mission: 'investigation quest',
      reward: 'Shelf seven opens with a quiet flash.',
    },
    {
      id: 'lantern-lens',
      clues: [
        'The cracked lens cannot go on the main beacon.',
        'Only the clear lens is safe for the main beacon.',
        'The clear lens is in Orin’s wrapped case.',
      ],
      answer: 'Use the lens from Orin’s wrapped case.',
      mission: 'repair quest',
      reward: 'The main beacon shines without flicker.',
    },
  ]

  return seeds.flatMap((seed, index) => {
    const [region, chapter] = chapters[index + 7]
    return [
      {
        id: `deduction-${seed.id}-solve`,
        title: 'Use every clue',
        skill: 'deduction',
        subskill: 'multi-clue-choice',
        difficulty: 2,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `${seed.clues.join(' ')} What can Tala conclude?`,
        choices: [seed.answer, 'No clue helps', 'The opposite must be true', 'Every choice could work'],
        correctIndex: 0,
        hintSteps: [
          'Do not use one clue alone. Stack them together.',
          'The answer must fit all the clues, not just the loudest one.',
        ],
        explanation: makeExplanation(
          seed.answer,
          'Deduction combines several true clues until only one answer remains.',
          'If an answer breaks even one clue, remove it.',
          'That is how Pathfinders make solid choices under pressure.',
        ),
        sourceTrace: {
          sourceIds: skillSources.deduction,
          note: 'Reviewed multi-clue deduction task adapted from the curated logic corpus.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `deduction-${seed.id}-reject`,
        title: 'Reject the wrong answer',
        skill: 'deduction',
        subskill: 'elimination',
        difficulty: 3,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `${seed.clues.join(' ')} Which answer should Orin reject first?`,
        choices: ['Any choice that breaks a clue', seed.answer, 'The last thing someone said', 'The prettiest option'],
        correctIndex: 0,
        hintSteps: [
          'Elimination comes before guessing.',
          'The first answer to reject is the one that does not fit the clues.',
        ],
        explanation: makeExplanation(
          'Reject any choice that breaks a clue first, then keep narrowing the options.',
          'Deduction often works by removing impossible answers.',
          'That leaves the one answer that still fits everything.',
          'This keeps route decisions calm and evidence-based.',
        ),
        sourceTrace: {
          sourceIds: skillSources.deduction,
          note: 'Reviewed elimination-style deduction task with explicit evidence filtering.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `deduction-${seed.id}-question`,
        title: 'Find the useful clue',
        skill: 'deduction',
        subskill: 'supporting-clue',
        difficulty: 4,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Which kind of clue helps deduction the most in this mission?`,
        choices: [
          'A clue that removes one option and supports another',
          'A clue about someone’s favorite dessert',
          'A clue that changes every minute for no reason',
          'A clue about the weather last year',
        ],
        correctIndex: 0,
        hintSteps: [
          'Useful deduction clues narrow the options.',
          'A clue is helpful when it rules something out or confirms a needed match.',
        ],
        explanation: makeExplanation(
          'The best clue removes one option and supports another, because deduction gets stronger as the choices narrow.',
          'Good clues change the answer space.',
          'Fun but unrelated facts do not help you conclude anything.',
          'That is why the guild records mission facts carefully instead of collecting random details.',
        ),
        sourceTrace: {
          sourceIds: skillSources.deduction,
          note: 'Reviewed supporting-clue task tied to deductive narrowing and evidence quality.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
      {
        id: `deduction-${seed.id}-confidence`,
        title: 'Explain the conclusion',
        skill: 'deduction',
        subskill: 'reasoned-conclusion',
        difficulty: 5,
        ageBand: '9-11',
        region,
        chapter,
        missionType: seed.mission,
        prompt: `Why is the best answer in this mission trustworthy?`,
        choices: [
          'Because it fits every clue at the same time',
          'Because it sounds exciting',
          'Because Tala likes it best',
          'Because it appeared first on the list',
        ],
        correctIndex: 0,
        hintSteps: [
          'A trustworthy conclusion is supported by all the clues together.',
          'Reasoning beats popularity, order, and excitement.',
        ],
        explanation: makeExplanation(
          'The best answer is trustworthy because it fits every clue at the same time.',
          'Deduction is stronger than guessing because the evidence holds the answer up.',
          'If an answer relies on feelings alone, it is not a real deduction.',
          'That is the habit the Pathfinder guild wants to grow session after session.',
        ),
        sourceTrace: {
          sourceIds: skillSources.deduction,
          note: 'Reviewed reasoned-conclusion task aligned with deductive justification.',
        },
        reviewState: 'approved',
        rewardLabel: seed.reward,
      },
    ]
  })
}

const taskBank = [
  ...buildClassificationTasks(),
  ...buildPatternTasks(),
  ...buildIfThenTasks(),
  ...buildContradictionTasks(),
  ...buildDeductionTasks(),
]

const scriptDir = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(scriptDir, '../src/generated/taskBank.json')
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(taskBank, null, 2)}\n`)

console.log(`Generated ${taskBank.length} reviewed tasks at ${outputPath}`)
