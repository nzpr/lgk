import { describe, expect, it } from 'vitest'
import { adventureLevels } from './data'
import {
  answerShrine,
  chooseRoute,
  createAdventureState,
  finishCurrentLevel,
  getRunLandmark,
  getRunTask,
  resolveLandmark,
  startLevel,
  advanceRun,
} from './engine'

describe('adventure campaign data', () => {
  it('defines a 20-level campaign with five landmarks each', () => {
    expect(adventureLevels).toHaveLength(20)
    for (const level of adventureLevels) {
      expect(level.landmarks).toHaveLength(5)
    }
  })
})

describe('adventure progression', () => {
  it('starts a level with a live run and shrine tasks', () => {
    const state = startLevel(createAdventureState(), 'fallen-ferry')

    expect(state.run).not.toBeNull()
    expect(state.run?.tasks).toHaveLength(1)
    expect(getRunLandmark(state)?.title).toBe('Shoreline Bell')
  })

  it('resolves discoveries, shrines, and completes a level', () => {
    let state = startLevel(createAdventureState(), 'fallen-ferry')

    state = resolveLandmark(state, 'careful')
    state = advanceRun(state)
    state = resolveLandmark(state, 'bold')
    state = advanceRun(state)

    const shrineTask = getRunTask(state)
    if (!shrineTask) {
      throw new Error('Expected a shrine task on the third landmark')
    }

    state = answerShrine(state, shrineTask.correctIndex)
    state = advanceRun(state)

    const choice = getRunLandmark(state)?.choice
    if (!choice) {
      throw new Error('Expected a route choice on the fourth landmark')
    }

    state = chooseRoute(state, choice.safe)
    state = advanceRun(state)
    state = resolveLandmark(state, 'careful')
    state = finishCurrentLevel(state)

    expect(state.completedLevels).toHaveLength(1)
    expect(state.unlockedLevelIndex).toBe(2)
    expect(state.run).toBeNull()
    expect(state.completedLevels[0].rank).toMatch(/A|S|SS|B/)
  })

  it('rewards bold traversal with higher route flow', () => {
    const base = advanceRun(startLevel(createAdventureState(), 'fallen-ferry'))
    const careful = resolveLandmark(base, 'careful')
    const bold = resolveLandmark(base, 'bold')

    expect(careful.run?.flow).toBeLessThan(bold.run?.flow ?? 0)
    expect(bold.run?.relicsFound).toBeGreaterThanOrEqual(careful.run?.relicsFound ?? 0)
  })
})
