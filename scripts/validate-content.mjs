import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const manifestPath = resolve('/workspace', 'in/04-input-corpus/manifest.json')
const taskBankPath = resolve('/workspace', 'src/generated/taskBank.json')

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const taskBank = JSON.parse(readFileSync(taskBankPath, 'utf8'))

const sourceIds = new Set(manifest.map((item) => item.index))
const taskIds = new Set()
const skills = new Map()

for (const task of taskBank) {
  if (taskIds.has(task.id)) {
    throw new Error(`Duplicate task id: ${task.id}`)
  }

  taskIds.add(task.id)
  skills.set(task.skill, (skills.get(task.skill) ?? 0) + 1)

  if (task.reviewState !== 'approved') {
    throw new Error(`Task ${task.id} is not approved`)
  }

  if (task.choices.length !== 4) {
    throw new Error(`Task ${task.id} does not have 4 choices`)
  }

  if (task.correctIndex < 0 || task.correctIndex > 3) {
    throw new Error(`Task ${task.id} has invalid correctIndex`)
  }

  if (task.sourceTrace.sourceIds.length === 0) {
    throw new Error(`Task ${task.id} is missing source ids`)
  }

  for (const sourceId of task.sourceTrace.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      throw new Error(`Task ${task.id} references unknown source id ${sourceId}`)
    }
  }
}

if (taskBank.length < 100) {
  throw new Error(`Expected at least 100 reviewed tasks, found ${taskBank.length}`)
}

for (const skill of ['classification', 'patterns', 'ifThen', 'contradiction', 'deduction']) {
  if ((skills.get(skill) ?? 0) < 20) {
    throw new Error(`Expected at least 20 tasks for ${skill}`)
  }
}

console.log(
  `Validated ${taskBank.length} reviewed tasks across ${skills.size} skills with source traceability.`,
)
