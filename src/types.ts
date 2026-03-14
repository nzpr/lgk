export type Skill =
  | 'classification'
  | 'patterns'
  | 'ifThen'
  | 'contradiction'
  | 'deduction'

export type SessionType = 'diagnostic' | 'daily'

export interface TaskExplanation {
  summary: string
  steps: [string, string]
  whyNow: string
}

export interface SourceTrace {
  sourceIds: number[]
  note: string
}

export interface Task {
  id: string
  title: string
  skill: Skill
  subskill: string
  difficulty: number
  ageBand: '9-11'
  region: string
  chapter: number
  missionType: string
  prompt: string
  choices: [string, string, string, string]
  correctIndex: number
  hintSteps: [string, string]
  explanation: TaskExplanation
  sourceTrace: SourceTrace
  reviewState: 'approved'
  rewardLabel: string
}

export interface ParentAccount {
  name: string
  email: string
  acceptedPrivacyAt: string
}

export interface ChildProfile {
  name: string
  age: number
  goal: string
}

export interface TaskHistory {
  timesSeen: number
  correctCount: number
  hintCount: number
  lastSeen: string | null
}

export interface TaskOutcome {
  taskId: string
  skill: Skill
  correct: boolean
  attempts: number
  hintLevel: number
  completedAt: string
}

export interface SessionRecord {
  id: string
  type: SessionType
  objective: string
  region: string
  chapter: number
  startedAt: string
  completedAt: string
  outcomes: TaskOutcome[]
  score: number
}

export interface AnalyticsEvent {
  id: string
  type: string
  timestamp: string
  detail: Record<string, string | number | boolean>
}

export interface FlaggedOutput {
  id: string
  taskId: string
  taskTitle: string
  reason: string
  createdAt: string
}

export interface WorldState {
  lanternCharge: number
  guildTokens: number
  routesRestored: number
  chapterProgress: number
  chapterIndex: number
  artifacts: string[]
  campUpgrades: string[]
  companions: string[]
  streakDays: number
  lastSessionDate: string | null
}

export interface HouseholdState {
  version: number
  parent: ParentAccount | null
  child: ChildProfile | null
  learner: Record<Skill, number>
  diagnosticComplete: boolean
  sessions: SessionRecord[]
  history: Record<string, TaskHistory>
  analytics: AnalyticsEvent[]
  flaggedOutputs: FlaggedOutput[]
  world: WorldState
}

export interface ChapterDefinition {
  id: string
  region: string
  regionIndex: number
  chapterNumber: number
  title: string
  briefing: string
  landmark: string
  reward: string
  companion: string
  campUpgrade: string
  focusSkill: Skill
}

export interface ParentSummary {
  recentSessions: number
  strongestSkill: Skill
  struggleSkill: Skill
  nextFocus: Skill
  weeklyDigest: string
  strongestNote: string
  struggleNote: string
  nextAction: string
}

export interface SourceBook {
  index: number
  title: string
  source_page: string
  yandex_public_link: string
  local_file: string
  bytes: number
  original_name: string
}
