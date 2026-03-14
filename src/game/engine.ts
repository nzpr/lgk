import { taskBank } from '../lib/engine'
import type { Skill, Task } from '../types'
import { adventureLevels } from './data'
import type {
  AdventureLevel,
  AdventureState,
  LandmarkApproach,
  LandmarkApproachId,
  AdventureUpgrade,
  JournalEntry,
  LevelCompletion,
  LevelLandmark,
  LevelRun,
  LevelTaskBinding,
  RouteChoice,
} from './types'

const STARTING_CHARGE = 5
const STARTING_FLOW = 1

function nowIso() {
  return new Date().toISOString()
}

function nextFlow(flow: number, delta: number) {
  return Math.max(0, flow + delta)
}

function updateFlow(run: LevelRun, delta: number) {
  const flow = nextFlow(run.flow, delta)
  return {
    flow,
    peakFlow: Math.max(run.peakFlow, flow),
  }
}

function defaultApproachesForLandmark(landmark: LevelLandmark): {
  careful: LandmarkApproach
  bold: LandmarkApproach
} | null {
  if (landmark.kind === 'shrine' || landmark.choice) {
    return null
  }

  const labels = {
    start: {
      careful: ['Attune to the route', 'Read the air and start cleanly.'],
      bold: ['Launch into the wind', 'Build speed early for a hotter run.'],
    },
    vista: {
      careful: ['Survey the vista', 'Study the route and preserve charge.'],
      bold: ['Glide the high line', 'Trade calm for relic reach.'],
    },
    cache: {
      careful: ['Search the cache', 'Recover what is safe to carry.'],
      bold: ['Rip the cache open', 'Grab more, but risk losing charge.'],
    },
    beacon: {
      careful: ['Kindle the beacon', 'Relight it with a steady pulse.'],
      bold: ['Overdrive the beacon', 'Force a blazing finish for extra flow.'],
    },
    hazard: {
      careful: ['Test the footing', 'Reduce the route strain first.'],
      bold: ['Punch through the hazard', 'Take the shock and keep momentum.'],
    },
  }[landmark.kind]

  return landmark.approaches ?? {
    careful: {
      id: 'careful',
      label: labels.careful[0],
      summary: labels.careful[1],
      chargeDelta: landmark.chargeDelta ?? 0,
      relicDelta: landmark.relicDelta ?? 0,
      flowDelta: 1,
      journalText: landmark.journalText,
    },
    bold: {
      id: 'bold',
      label: labels.bold[0],
      summary: labels.bold[1],
      chargeDelta: (landmark.chargeDelta ?? 0) - 1,
      relicDelta: (landmark.relicDelta ?? 0) + 1,
      flowDelta: 2,
      journalText: `${landmark.journalText} Mira pushes harder than the route expects and comes out brighter for it.`,
    },
  }
}

function rankForFlowPeak(flowPeak: number): 'B' | 'A' | 'S' | 'SS' {
  if (flowPeak >= 8) {
    return 'SS'
  }
  if (flowPeak >= 6) {
    return 'S'
  }
  if (flowPeak >= 4) {
    return 'A'
  }
  return 'B'
}

function createJournalEntry(level: AdventureLevel, title: string, text: string): JournalEntry {
  return {
    id: `${level.id}-${title.toLowerCase().replaceAll(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`,
    levelId: level.id,
    title,
    text,
  }
}

function taskPoolForSkill(skill: Skill, levelIndex: number): Task[] {
  const targetDifficulty = Math.min(4, 1 + Math.floor((levelIndex - 1) / 5))
  return taskBank
    .filter((task) => task.reviewState === 'approved' && task.skill === skill)
    .sort((left, right) => {
      const leftDistance = Math.abs(left.difficulty - targetDifficulty)
      const rightDistance = Math.abs(right.difficulty - targetDifficulty)
      if (leftDistance !== rightDistance) {
        return leftDistance - rightDistance
      }
      return left.id.localeCompare(right.id)
    })
}

function buildLevelTasks(level: AdventureLevel): LevelTaskBinding[] {
  const shrineLandmarks = level.landmarks.filter(
    (landmark) => landmark.kind === 'shrine' && landmark.challengeSkill,
  )

  return shrineLandmarks.map((landmark, skillIndex) => {
    const skill = landmark.challengeSkill as Skill
    const pool = taskPoolForSkill(skill, level.index)
    const task = pool[(level.index + skillIndex - 1) % pool.length]
    return {
      landmarkId: landmark.id,
      task,
    }
  })
}

export const levelLookup = Object.fromEntries(adventureLevels.map((level) => [level.id, level]))
export const levelTaskBindings = Object.fromEntries(
  adventureLevels.map((level) => [level.id, buildLevelTasks(level)]),
)

export function createAdventureState(playerName = 'Mira'): AdventureState {
  return {
    version: 1,
    playerName,
    currentLevelId: null,
    unlockedLevelIndex: 1,
    relics: 0,
    sparks: 0,
    upgrades: [],
    completedLevels: [],
    journal: [
      {
        id: 'opening-note',
        levelId: 'intro',
        title: 'A Fall Into Light',
        text: 'Mira falls through a torn beacon line and wakes beside Nilo on the edge of Lantern Reach.',
      },
    ],
    run: null,
    endingUnlocked: false,
  }
}

export function createAdventureDemoState(): AdventureState {
  let state = createAdventureState('Mira')
  for (const levelId of ['fallen-ferry', 'signal-stair', 'sun-kite-orchard']) {
    state = completeLevel(
      state,
      {
        levelId,
        chargeLeft: 4,
        relicsFound: 2,
        sparksEarned: 3,
        stars: 3,
        flowPeak: 5,
        rank: 'A',
        completedAt: new Date('2026-03-14T09:00:00.000Z').toISOString(),
      },
      true,
    )
  }
  state.journal.push({
    id: 'demo-note',
    levelId: 'demo',
    title: 'Echo Trail Demo',
    text: 'This camp is preloaded three routes deep so the world already feels alive when the player arrives.',
  })
  return state
}

export function getUnlockedLevels(state: AdventureState): AdventureLevel[] {
  return adventureLevels.filter((level) => level.index <= state.unlockedLevelIndex)
}

export function getCurrentLevel(levelId: string | null): AdventureLevel | null {
  return levelId ? levelLookup[levelId] ?? null : null
}

export function startLevel(state: AdventureState, levelId: string): AdventureState {
  const level = levelLookup[levelId]
  if (!level || level.index > state.unlockedLevelIndex) {
    return state
  }

  const tasks = levelTaskBindings[levelId]
  const landmarkStates = Object.fromEntries(
    level.landmarks.map((landmark) => [
      landmark.id,
      {
        resolved: landmark.kind === 'start',
        attempts: 0,
      },
    ]),
  )

  const run: LevelRun = {
    levelId,
    charge: STARTING_CHARGE + (state.upgrades.includes('echoLens') ? 1 : 0),
    relicsFound: 0,
    flow: STARTING_FLOW,
    peakFlow: STARTING_FLOW,
    currentLandmarkIndex: 0,
    landmarkStates,
    tasks,
    journal: [createJournalEntry(level, level.title, level.storyBeat)],
  }

  return {
    ...state,
    currentLevelId: levelId,
    run,
  }
}

export function getRunLevel(state: AdventureState): AdventureLevel | null {
  return state.run ? levelLookup[state.run.levelId] : null
}

export function getRunLandmark(state: AdventureState): LevelLandmark | null {
  const level = getRunLevel(state)
  return level && state.run ? level.landmarks[state.run.currentLandmarkIndex] : null
}

export function getRunTask(state: AdventureState): Task | null {
  const run = state.run
  const landmark = getRunLandmark(state)
  if (!run || !landmark) {
    return null
  }

  return run.tasks.find((task) => task.landmarkId === landmark.id)?.task ?? null
}

function appendJournal(state: AdventureState, entries: JournalEntry[]): AdventureState {
  return {
    ...state,
    journal: [...state.journal, ...entries],
  }
}

function updateRun(state: AdventureState, updater: (run: LevelRun) => LevelRun): AdventureState {
  if (!state.run) {
    return state
  }
  return {
    ...state,
    run: updater(state.run),
  }
}

export function getLandmarkApproaches(landmark: LevelLandmark): {
  careful: LandmarkApproach
  bold: LandmarkApproach
} | null {
  return defaultApproachesForLandmark(landmark)
}

export function resolveLandmark(
  state: AdventureState,
  approachId: LandmarkApproachId = 'careful',
): AdventureState {
  const level = getRunLevel(state)
  const landmark = getRunLandmark(state)
  if (!state.run || !level || !landmark) {
    return state
  }

  const alreadyResolved = state.run.landmarkStates[landmark.id]?.resolved
  if (alreadyResolved || landmark.kind === 'shrine' || landmark.choice) {
    return state
  }

  const approaches = getLandmarkApproaches(landmark)
  const approach = approaches?.[approachId]
  const nextState = updateRun(state, (run) => ({
    ...run,
    charge: Math.max(1, run.charge + (approach?.chargeDelta ?? landmark.chargeDelta ?? 0)),
    relicsFound: run.relicsFound + (approach?.relicDelta ?? landmark.relicDelta ?? 0),
    ...updateFlow(run, approach?.flowDelta ?? 1),
    landmarkStates: {
      ...run.landmarkStates,
      [landmark.id]: {
        ...run.landmarkStates[landmark.id],
        resolved: true,
      },
    },
  }))

  return appendJournal(nextState, [
    createJournalEntry(level, landmark.title, approach?.journalText ?? landmark.journalText),
  ])
}

export function chooseRoute(state: AdventureState, choice: RouteChoice): AdventureState {
  const level = getRunLevel(state)
  const landmark = getRunLandmark(state)
  if (!state.run || !level || !landmark || !landmark.choice) {
    return state
  }

  const nextState = updateRun(state, (run) => ({
    ...run,
    charge: Math.max(1, run.charge + choice.chargeDelta),
    relicsFound: run.relicsFound + choice.relicDelta,
    ...updateFlow(run, choice.id === 'risky' ? 2 : 1),
    landmarkStates: {
      ...run.landmarkStates,
      [landmark.id]: {
        ...run.landmarkStates[landmark.id],
        resolved: true,
        choiceId: choice.id,
      },
    },
  }))

  return appendJournal(nextState, [
    createJournalEntry(level, landmark.title, choice.journalText),
  ])
}

export function answerShrine(state: AdventureState, answerIndex: number): AdventureState {
  const level = getRunLevel(state)
  const landmark = getRunLandmark(state)
  const task = getRunTask(state)
  if (!state.run || !level || !landmark || !task) {
    return state
  }

  const correct = task.correctIndex === answerIndex
  const nextState = updateRun(state, (run) => ({
    ...run,
    charge: Math.max(1, run.charge + (correct ? 0 : -1)),
    relicsFound: run.relicsFound + (correct ? 1 : 0),
    ...updateFlow(run, correct ? 2 : -2),
    landmarkStates: {
      ...run.landmarkStates,
      [landmark.id]: {
        resolved: true,
        taskAnswered: true,
        correct,
        attempts: run.landmarkStates[landmark.id].attempts + 1,
      },
    },
  }))

  const journalText = correct
    ? `${landmark.title} yields when Mira reads the route correctly. ${task.rewardLabel}`
    : `${landmark.title} fights back and drains charge, but Mira still learns how the route truly works.`

  return appendJournal(nextState, [createJournalEntry(level, landmark.title, journalText)])
}

export function advanceRun(state: AdventureState): AdventureState {
  if (!state.run) {
    return state
  }
  const level = levelLookup[state.run.levelId]
  const current = level.landmarks[state.run.currentLandmarkIndex]
  if (!state.run.landmarkStates[current.id]?.resolved) {
    return state
  }

  if (state.run.currentLandmarkIndex >= level.landmarks.length - 1) {
    return state
  }

  return updateRun(state, (run) => ({
    ...run,
    currentLandmarkIndex: run.currentLandmarkIndex + 1,
  }))
}

export function completeLevel(
  state: AdventureState,
  completion: LevelCompletion,
  preserveRun = false,
): AdventureState {
  const level = levelLookup[completion.levelId]
  const completedLevels = [
    ...state.completedLevels.filter((item) => item.levelId !== completion.levelId),
    completion,
  ].sort((left, right) => levelLookup[left.levelId].index - levelLookup[right.levelId].index)

  const upgrades = level.rewardUpgrade
    ? Array.from(new Set([...state.upgrades, level.rewardUpgrade]))
    : state.upgrades

  return {
    ...state,
    currentLevelId: null,
    unlockedLevelIndex: Math.min(adventureLevels.length, Math.max(state.unlockedLevelIndex, level.index + 1)),
    relics: state.relics + completion.relicsFound,
    sparks: state.sparks + completion.sparksEarned,
    upgrades,
    completedLevels,
    journal: [
      ...state.journal,
      createJournalEntry(level, level.title, level.reward),
    ],
    run: preserveRun ? state.run : null,
    endingUnlocked: level.index === adventureLevels.length,
  }
}

export function finishCurrentLevel(state: AdventureState): AdventureState {
  const level = getRunLevel(state)
  if (!state.run || !level) {
    return state
  }

  const shrineResults = level.landmarks
    .filter((landmark) => landmark.kind === 'shrine')
    .map((landmark) => state.run!.landmarkStates[landmark.id])
  const correctShrines = shrineResults.filter((result) => result?.correct).length
  const stars = 1 + (state.run.relicsFound >= 3 ? 1 : 0) + (correctShrines === shrineResults.length ? 1 : 0)

  return completeLevel(state, {
    levelId: level.id,
    chargeLeft: state.run.charge,
    relicsFound: state.run.relicsFound,
    sparksEarned: 2 + stars + Math.max(0, Math.floor(state.run.peakFlow / 3)),
    stars,
    flowPeak: state.run.peakFlow,
    rank: rankForFlowPeak(state.run.peakFlow),
    completedAt: nowIso(),
  })
}

export function getUpgradeLabel(upgrade: AdventureUpgrade): string {
  return {
    windThread: 'Wind Thread',
    echoLens: 'Echo Lens',
    bridgeSeed: 'Bridge Seed',
    spineFlame: 'Spine Flame',
  }[upgrade]
}

export function getFlowStatus(flow: number): string {
  if (flow >= 7) {
    return 'Skyfire'
  }
  if (flow >= 5) {
    return 'Bright'
  }
  if (flow >= 3) {
    return 'Settled'
  }
  if (flow >= 1) {
    return 'Faint'
  }
  return 'Broken'
}

export function getLevelCompletion(state: AdventureState, levelId: string): LevelCompletion | null {
  return state.completedLevels.find((completion) => completion.levelId === levelId) ?? null
}
