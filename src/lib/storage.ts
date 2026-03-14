import type { HouseholdState } from '../types'

const STORAGE_KEY = 'sky-of-many-lanterns-state'

export function loadState(): HouseholdState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HouseholdState) : null
  } catch {
    return null
  }
}

export function saveState(state: HouseholdState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
