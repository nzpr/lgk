import { describe, expect, it } from 'vitest'
import {
  applyCompletedSession,
  buildSessionRecord,
  createInitialState,
  getCurrentChapter,
  selectDailyTasks,
  selectDiagnosticTasks,
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
})
