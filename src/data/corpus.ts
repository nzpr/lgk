import manifest from '../../in/04-input-corpus/manifest.json'
import type { SourceBook } from '../types'

export const corpusManifest = manifest as SourceBook[]

export const sourceLookup = Object.fromEntries(
  corpusManifest.map((item) => [item.index, item]),
)
