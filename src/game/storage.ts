import type { AdventureState } from './types'

const STORAGE_KEY = 'sky-of-many-lanterns-echo-trail'

function normalizeAdventureState(state: AdventureState): AdventureState {
  return {
    ...state,
    completedLevels: state.completedLevels.map((completion) => ({
      ...completion,
      flowPeak: completion.flowPeak ?? 1,
      rank: completion.rank ?? 'B',
    })),
    run: state.run
      ? {
          ...state.run,
          flow: state.run.flow ?? 1,
          peakFlow: state.run.peakFlow ?? state.run.flow ?? 1,
        }
      : null,
  }
}

export function loadAdventureState(): AdventureState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeAdventureState(JSON.parse(raw) as AdventureState) : null
  } catch {
    return null
  }
}

export function saveAdventureState(state: AdventureState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetAdventureState(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
