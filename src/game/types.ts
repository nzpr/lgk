import type { Skill, Task } from '../types'

export type AdventureUpgrade =
  | 'windThread'
  | 'echoLens'
  | 'bridgeSeed'
  | 'spineFlame'

export type LandmarkKind = 'start' | 'vista' | 'hazard' | 'cache' | 'shrine' | 'beacon'
export type LandmarkApproachId = 'careful' | 'bold'

export interface RouteChoice {
  id: string
  label: string
  summary: string
  outcome: string
  chargeDelta: number
  relicDelta: number
  journalText: string
}

export interface LandmarkApproach {
  id: LandmarkApproachId
  label: string
  summary: string
  chargeDelta: number
  relicDelta: number
  flowDelta: number
  journalText: string
}

export interface LevelLandmark {
  id: string
  title: string
  kind: LandmarkKind
  description: string
  sceneDetail: string
  chargeDelta?: number
  relicDelta?: number
  journalText: string
  challengeSkill?: Skill
  approaches?: {
    careful: LandmarkApproach
    bold: LandmarkApproach
  }
  choice?: {
    prompt: string
    safe: RouteChoice
    risky: RouteChoice
  }
}

export interface LevelPalette {
  skyTop: string
  skyBottom: string
  far: string
  mid: string
  ground: string
  accent: string
}

export interface AdventureLevel {
  id: string
  index: number
  region: string
  title: string
  tagline: string
  goal: string
  storyBeat: string
  reward: string
  palette: LevelPalette
  challengeSkills: [Skill, Skill]
  landmarks: [LevelLandmark, LevelLandmark, LevelLandmark, LevelLandmark, LevelLandmark]
  rewardUpgrade?: AdventureUpgrade
}

export interface JournalEntry {
  id: string
  levelId: string
  title: string
  text: string
}

export interface LevelTaskBinding {
  landmarkId: string
  task: Task
}

export interface LevelRun {
  levelId: string
  charge: number
  relicsFound: number
  flow: number
  peakFlow: number
  currentLandmarkIndex: number
  landmarkStates: Record<
    string,
    {
      resolved: boolean
      choiceId?: string
      taskAnswered?: boolean
      correct?: boolean
      attempts: number
    }
  >
  tasks: LevelTaskBinding[]
  journal: JournalEntry[]
}

export interface LevelCompletion {
  levelId: string
  chargeLeft: number
  relicsFound: number
  sparksEarned: number
  stars: number
  flowPeak: number
  rank: 'B' | 'A' | 'S' | 'SS'
  completedAt: string
}

export interface AdventureState {
  version: number
  playerName: string
  currentLevelId: string | null
  unlockedLevelIndex: number
  relics: number
  sparks: number
  upgrades: AdventureUpgrade[]
  completedLevels: LevelCompletion[]
  journal: JournalEntry[]
  run: LevelRun | null
  endingUnlocked: boolean
}
