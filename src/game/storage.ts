import type { AdventureState } from './types'

const STORAGE_KEY = 'sky-of-many-lanterns-echo-trail'

export function loadAdventureState(): AdventureState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdventureState) : null
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
