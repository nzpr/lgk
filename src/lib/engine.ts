import taskBankJson from '../generated/taskBank.json'
import { chapterPlan, skillLabels } from '../data/world'
import type {
  AnalyticsEvent,
  ChapterDefinition,
  FlaggedOutput,
  HouseholdState,
  ParentSummary,
  SessionRecord,
  SessionType,
  Skill,
  SourceBook,
  Task,
  TaskHistory,
  TaskOutcome,
  WorldState,
} from '../types'

export const SKILLS: Skill[] = [
  'classification',
  'patterns',
  'ifThen',
  'contradiction',
  'deduction',
]

export const taskBank = taskBankJson as Task[]
export const taskLookup = Object.fromEntries(taskBank.map((task) => [task.id, task]))

export function createInitialWorld(): WorldState {
  return {
    lanternCharge: 0,
    guildTokens: 0,
    routesRestored: 0,
    chapterProgress: 0,
    chapterIndex: 0,
    artifacts: [],
    campUpgrades: ['Guild firelight'],
    companions: [],
    streakDays: 0,
    lastSessionDate: null,
  }
}

export function createInitialState(): HouseholdState {
  return {
    version: 1,
    parent: null,
    child: null,
    learner: {
      classification: 40,
      patterns: 40,
      ifThen: 40,
      contradiction: 40,
      deduction: 40,
    },
    diagnosticComplete: false,
    sessions: [],
    history: {},
    analytics: [],
    flaggedOutputs: [],
    world: createInitialWorld(),
  }
}

export function getCurrentChapter(state: HouseholdState): ChapterDefinition {
  return chapterPlan[Math.min(state.world.chapterIndex, chapterPlan.length - 1)]
}

export function getCompletedDailySessions(state: HouseholdState): number {
  return state.sessions.filter((session) => session.type === 'daily').length
}

export function getSkillLabel(skill: Skill): string {
  return skillLabels[skill]
}

export function getRecentTaskIds(state: HouseholdState): string[] {
  return state.sessions
    .slice(-4)
    .flatMap((session) => session.outcomes)
    .map((outcome) => outcome.taskId)
}

export function selectDiagnosticTasks(): Task[] {
  return SKILLS.flatMap((skill) =>
    taskBank
      .filter((task) => task.skill === skill && task.difficulty <= 2)
      .slice(0, 2),
  )
}

function sortSkillsByNeed(state: HouseholdState): Skill[] {
  return [...SKILLS].sort((left, right) => state.learner[left] - state.learner[right])
}

export function selectDailyTasks(state: HouseholdState): Task[] {
  const chapter = getCurrentChapter(state)
  const recent = new Set(getRecentTaskIds(state))
  const orderedSkills = sortSkillsByNeed(state)
  const selected: Task[] = []

  for (let cursor = 0; selected.length < 6 && cursor < 30; cursor += 1) {
    const skill = orderedSkills[cursor % orderedSkills.length]
    const skillPool = taskBank.filter(
      (task) =>
        task.skill === skill &&
        task.reviewState === 'approved' &&
        !recent.has(task.id) &&
        !selected.some((picked) => picked.id === task.id),
    )

    const chapterFirst =
      skillPool.find((task) => task.region === chapter.region && task.difficulty >= 2) ??
      skillPool.find((task) => task.difficulty >= 2) ??
      skillPool[0]

    if (chapterFirst) {
      selected.push(chapterFirst)
    }
  }

  if (selected.length < 6) {
    const fallback = taskBank.filter(
      (task) => !selected.some((picked) => picked.id === task.id),
    )
    selected.push(...fallback.slice(0, 6 - selected.length))
  }

  return selected.slice(0, 6)
}

export function buildSessionRecord(
  type: SessionType,
  objective: string,
  region: string,
  chapter: number,
  outcomes: TaskOutcome[],
  startedAt: string,
  completedAt: string,
): SessionRecord {
  const score = Math.round(
    outcomes.reduce((sum, outcome) => {
      const quality = outcome.correct ? 16 : 7
      const supportPenalty = outcome.hintLevel * 2 + Math.max(0, outcome.attempts - 1)
      return sum + Math.max(4, quality - supportPenalty)
    }, 0) / outcomes.length,
  )

  return {
    id: `session-${startedAt}`,
    type,
    objective,
    region,
    chapter,
    startedAt,
    completedAt,
    outcomes,
    score,
  }
}

function updateHistory(
  history: Record<string, TaskHistory>,
  outcome: TaskOutcome,
): Record<string, TaskHistory> {
  const previous = history[outcome.taskId] ?? {
    timesSeen: 0,
    correctCount: 0,
    hintCount: 0,
    lastSeen: null,
  }

  return {
    ...history,
    [outcome.taskId]: {
      timesSeen: previous.timesSeen + 1,
      correctCount: previous.correctCount + (outcome.correct ? 1 : 0),
      hintCount: previous.hintCount + (outcome.hintLevel > 0 ? 1 : 0),
      lastSeen: outcome.completedAt,
    },
  }
}

function updateLearner(
  learner: Record<Skill, number>,
  outcome: TaskOutcome,
): Record<Skill, number> {
  const current = learner[outcome.skill]
  const delta = outcome.correct
    ? 6 - outcome.hintLevel - Math.max(0, outcome.attempts - 1)
    : -2 - outcome.hintLevel
  const next = Math.min(96, Math.max(18, current + delta))

  return {
    ...learner,
    [outcome.skill]: next,
  }
}

function updateWorld(
  world: WorldState,
  session: SessionRecord,
  dailySessionsCompleted: number,
): WorldState {
  if (session.type === 'diagnostic') {
    return {
      ...world,
      lanternCharge: world.lanternCharge + 6,
    }
  }

  const previousChapterIndex = world.chapterIndex
  const nextChapterIndex = Math.min(
    chapterPlan.length - 1,
    Math.floor(dailySessionsCompleted / 3),
  )
  const chapterChanged = nextChapterIndex > previousChapterIndex
  const chapterReward = chapterPlan[nextChapterIndex]
  const sessionDate = session.completedAt.slice(0, 10)
  const streak =
    world.lastSessionDate === sessionDate
      ? world.streakDays
      : world.lastSessionDate
        ? world.streakDays + 1
        : 1

  return {
    lanternCharge: world.lanternCharge + session.score * 2,
    guildTokens: world.guildTokens + (chapterChanged ? 3 : 1),
    routesRestored: world.routesRestored + 1,
    chapterProgress: dailySessionsCompleted % 3,
    chapterIndex: nextChapterIndex,
    artifacts: chapterChanged
      ? [...world.artifacts, chapterReward.reward]
      : world.artifacts,
    campUpgrades: chapterChanged
      ? [...new Set([...world.campUpgrades, chapterReward.campUpgrade])]
      : world.campUpgrades,
    companions: chapterChanged
      ? [...new Set([...world.companions, chapterReward.companion])]
      : world.companions,
    streakDays: streak,
    lastSessionDate: sessionDate,
  }
}

export function applyCompletedSession(
  state: HouseholdState,
  session: SessionRecord,
): HouseholdState {
  let nextHistory = state.history
  let nextLearner = state.learner

  for (const outcome of session.outcomes) {
    nextHistory = updateHistory(nextHistory, outcome)
    nextLearner = updateLearner(nextLearner, outcome)
  }

  const nextSessions = [...state.sessions, session]
  const dailySessionsCompleted = nextSessions.filter((item) => item.type === 'daily').length

  return {
    ...state,
    diagnosticComplete: state.diagnosticComplete || session.type === 'diagnostic',
    learner: nextLearner,
    history: nextHistory,
    sessions: nextSessions,
    world: updateWorld(state.world, session, dailySessionsCompleted),
  }
}

export function addAnalyticsEvent(
  state: HouseholdState,
  type: string,
  detail: Record<string, string | number | boolean>,
): HouseholdState {
  const nextEvent: AnalyticsEvent = {
    id: `${type}-${Date.now()}-${state.analytics.length}`,
    type,
    timestamp: new Date().toISOString(),
    detail,
  }

  return {
    ...state,
    analytics: [...state.analytics.slice(-149), nextEvent],
  }
}

export function addFlaggedOutput(
  state: HouseholdState,
  taskId: string,
  taskTitle: string,
  reason: string,
): HouseholdState {
  const nextItem: FlaggedOutput = {
    id: `flag-${Date.now()}`,
    taskId,
    taskTitle,
    reason,
    createdAt: new Date().toISOString(),
  }

  return {
    ...state,
    flaggedOutputs: [nextItem, ...state.flaggedOutputs],
  }
}

export function getParentSummary(state: HouseholdState): ParentSummary {
  const ordered = [...SKILLS].sort((left, right) => state.learner[right] - state.learner[left])
  const weakest = [...ordered].reverse()
  const chapter = getCurrentChapter(state)
  const recentSessions = state.sessions.filter((session) => session.type === 'daily').slice(-7)
  const recentOutcomes = recentSessions.slice(-2).flatMap((session) => session.outcomes.slice(0, 2))
  const strongestExample =
    recentOutcomes.find((outcome) => outcome.skill === ordered[0] && outcome.correct) ??
    recentOutcomes[0]
  const struggleExample =
    recentOutcomes.find((outcome) => outcome.skill === weakest[0] && !outcome.correct) ??
    recentOutcomes.at(-1)

  return {
    recentSessions: recentSessions.length,
    strongestSkill: ordered[0],
    struggleSkill: weakest[0],
    nextFocus: weakest[1] ?? chapter.focusSkill,
    weeklyDigest: `${state.child?.name ?? 'Your child'} pushed ${chapter.region} forward, looked strongest in ${getSkillLabel(ordered[0]).toLowerCase()}, and still needs a little more support with ${getSkillLabel(weakest[0]).toLowerCase()}.`,
    strongestNote: strongestExample
      ? `Recent evidence: ${taskLookup[strongestExample.taskId]?.title ?? 'A recent mission'} was handled with growing confidence.`
      : 'Recent evidence will appear after the first expedition.',
    struggleNote: struggleExample
      ? `Current friction: ${taskLookup[struggleExample.taskId]?.title ?? 'A recent mission'} still needed support.`
      : 'Current friction will appear after the first expedition.',
    nextAction: `Next week, keep sessions short and let ${state.child?.name ?? 'your child'} spend extra time on ${getSkillLabel(weakest[1] ?? chapter.focusSkill).toLowerCase()}.`,
  }
}

export function buildSourceLines(task: Task, sourceLookup: Record<number, SourceBook>) {
  return task.sourceTrace.sourceIds
    .map((sourceId) => sourceLookup[sourceId])
    .filter(Boolean)
    .map((source) => ({
      id: source.index,
      title: source.title,
      sourcePage: source.source_page,
    }))
}

export function getBadgeSkills(state: HouseholdState): Skill[] {
  return SKILLS.filter((skill) => state.learner[skill] >= 66)
}
