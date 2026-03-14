import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const distIndex = resolve('/workspace', 'dist/index.html')

if (!existsSync(distIndex)) {
  throw new Error('dist/index.html is missing. Run npm run build first.')
}

const html = readFileSync(distIndex, 'utf8')

for (const needle of ['Sky of Many Lanterns', 'manifest.webmanifest', './assets/']) {
  if (!html.includes(needle)) {
    throw new Error(`Smoke check failed: dist/index.html is missing "${needle}"`)
  }
}

console.log('Smoke check passed for dist/index.html')
