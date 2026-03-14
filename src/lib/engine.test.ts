import { describe, expect, it } from 'vitest'
import {
  applyCompletedSession,
  buildSessionRecord,
  createInitialState,
  getCurrentChapter,
  getParentSummary,
  selectDailyTasks,
  selectDiagnosticTasks,
  taskBank,
} from './engine'

describe('content selection', () => {
  it('provides diagnostic coverage across all five skills', () => {
    const skills = new Set(selectDiagnosticTasks().map((task) => task.skill))
    expect(skills.size).toBe(5)
  })

  it('builds a six-task daily session with no duplicate tasks', () => {
    const state = createInitialState()
    const tasks = selectDailyTasks(state)
    expect(tasks).toHaveLength(6)
    expect(new Set(tasks.map((task) => task.id)).size).toBe(6)
  })

  it('prioritizes weaker skills and avoids recently seen tasks', () => {
    const candidate = taskBank.find((task) => task.reviewState === 'approved')
    if (!candidate) {
      throw new Error('Expected an approved task in the task bank')
    }

    const state = createInitialState()
    state.learner.classification = 24
    state.learner.patterns = 78
    state.sessions = [
      buildSessionRecord(
        'daily',
        'Recent expedition',
        candidate.region,
        1,
        [
          {
            taskId: candidate.id,
            skill: candidate.skill,
            correct: true,
            attempts: 1,
            hintLevel: 0,
            completedAt: new Date().toISOString(),
          },
        ],
        new Date().toISOString(),
        new Date().toISOString(),
      ),
    ]

    const tasks = selectDailyTasks(state)

    expect(tasks[0]?.skill).toBe('classification')
    expect(tasks.some((task) => task.id === candidate.id)).toBe(false)
  })
})

describe('session application', () => {
  it('marks the diagnostic as complete and improves the world state', () => {
    const state = createInitialState()
    const before = getCurrentChapter(state)
    const session = buildSessionRecord(
      'diagnostic',
      'Diagnostic objective',
      before.region,
      before.chapterNumber,
      [
        {
          taskId: 'classification-repair-tools-odd',
          skill: 'classification',
          correct: true,
          attempts: 1,
          hintLevel: 0,
          completedAt: new Date().toISOString(),
        },
      ],
      new Date().toISOString(),
      new Date().toISOString(),
    )
    const next = applyCompletedSession(state, session)

    expect(next.diagnosticComplete).toBe(true)
    expect(next.world.lanternCharge).toBeGreaterThan(0)
  })

  it('unlocks chapter rewards after three daily sessions', () => {
    let state = createInitialState()
    state.diagnosticComplete = true

    for (let index = 0; index < 3; index += 1) {
      const session = buildSessionRecord(
        'daily',
        `Daily session ${index + 1}`,
        'Aurora Reach',
        1,
        [
          {
            taskId: 'classification-repair-tools-odd',
            skill: 'classification',
            correct: true,
            attempts: 1,
            hintLevel: 0,
            completedAt: new Date().toISOString(),
          },
        ],
        new Date().toISOString(),
        new Date().toISOString(),
      )
      state = applyCompletedSession(state, session)
    }

    expect(state.world.chapterIndex).toBe(1)
    expect(state.world.artifacts.length).toBe(1)
    expect(state.world.companions.length).toBe(1)
  })
})

describe('parent summary', () => {
  it('gives grounded feedback once expedition data exists', () => {
    const state = createInitialState()
    state.child = {
      name: 'Mika',
      age: 9,
      goal: 'Calm daily practice',
    }
    state.sessions = [
      buildSessionRecord(
        'daily',
        'A steady route',
        'Aurora Reach',
        1,
        [
          {
            taskId: 'classification-repair-tools-odd',
            skill: 'classification',
            correct: true,
            attempts: 1,
            hintLevel: 0,
            completedAt: new Date().toISOString(),
          },
          {
            taskId: 'patterns-banner-stitch',
            skill: 'patterns',
            correct: false,
            attempts: 2,
            hintLevel: 2,
            completedAt: new Date().toISOString(),
          },
        ],
        new Date().toISOString(),
        new Date().toISOString(),
      ),
    ]

    const summary = getParentSummary(state)

    expect(summary.weeklyDigest).toContain('Mika')
    expect(summary.strongestNote).toContain('Recent evidence:')
    expect(summary.struggleNote).toContain('Current friction:')
  })
})
