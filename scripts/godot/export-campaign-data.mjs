import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..', '..')
const sourcePath = path.join(rootDir, 'src', 'game', 'data.ts')
const outputDir = path.join(rootDir, 'godot', 'echo_trail', 'data')
const outputPath = path.join(outputDir, 'campaign.json')

const challengeTemplates = {
  classification: [
    {
      prompt:
        'Which route marker belongs with the restored supply set at {landmarkTitle}?',
      answers: ['Lantern crate', 'Broken echo shell', 'Wild static feather'],
      correct: 0,
      hint: 'Sorted route sets keep the crafted travel marker and reject the wild intrusion.',
    },
    {
      prompt: 'Which item should Mira file into the safe travel drawer for {routeTitle}?',
      answers: ['Beacon seal', 'Noise shard', 'Storm splinter'],
      correct: 0,
      hint: 'Only one answer sounds like something a routekeeper would deliberately preserve.',
    },
    {
      prompt: 'Which symbol belongs on the working route chart for {region}?',
      answers: ['Traveler sigil', 'Silence bruise', 'Static thorn'],
      correct: 0,
      hint: 'The correct answer marks movement, not damage or corruption.',
    },
  ],
  patterns: [
    {
      prompt: 'What signal completes the pulse pattern at {landmarkTitle}: lantern, bell, lantern, bell, ... ?',
      answers: ['Lantern', 'Bell', 'Break the cycle'],
      correct: 0,
      hint: 'The route is asking for a simple repeat, not a trick ending.',
    },
    {
      prompt: 'Which step keeps the route rhythm steady at {routeTitle}: low, high, low, high, ... ?',
      answers: ['Low', 'High', 'Any step works'],
      correct: 0,
      hint: 'Keep alternating. Do not introduce noise.',
    },
    {
      prompt: 'The lights at {landmarkTitle} flash once, twice, once, twice. What comes next?',
      answers: ['Once', 'Twice', 'All lights at once'],
      correct: 0,
      hint: 'The pattern loops instead of escalating.',
    },
  ],
  ifThen: [
    {
      prompt: 'If the wind gate opens only when the lantern is lit, and the lantern is lit, what follows at {landmarkTitle}?',
      answers: ['The gate opens', 'The gate closes', 'Nothing can be known'],
      correct: 0,
      hint: 'Apply the condition directly. Do not add extra assumptions.',
    },
    {
      prompt: 'If a route stays safe only when both seals are active, and both seals are active, what is true now?',
      answers: ['The route is safe', 'The route is broken', 'The shrine must reset'],
      correct: 0,
      hint: 'Both required conditions are satisfied.',
    },
    {
      prompt: 'If the beacon wakes whenever the final latch yields, and the latch yields at {landmarkTitle}, what happens next?',
      answers: ['The beacon wakes', 'The route fades', 'Nothing changes'],
      correct: 0,
      hint: 'The statement gives you the outcome explicitly.',
    },
  ],
  deduction: [
    {
      prompt: 'Which conclusion is strongest at {landmarkTitle} if every live route in view points toward the same tower?',
      answers: [
        'That tower is the true destination',
        'The tower is a trap',
        'No conclusion can be drawn',
      ],
      correct: 0,
      hint: 'Choose the answer supported by all the visible evidence, not the most dramatic one.',
    },
    {
      prompt: 'The map shard, bell tone, and wind line all agree about one path in {routeTitle}. What should Mira infer?',
      answers: ['That path is real', 'All paths are equally false', 'The clues cancel out'],
      correct: 0,
      hint: 'When independent clues agree, trust the overlap.',
    },
    {
      prompt: 'Which reading best fits the evidence at {landmarkTitle}: one sign, one echo, or a full route alignment?',
      answers: ['A full route alignment', 'Only a stray sign', 'Only an echo'],
      correct: 0,
      hint: 'Multiple matching clues beat isolated fragments.',
    },
  ],
  contradiction: [
    {
      prompt: 'Which statement contradicts the others at {landmarkTitle}?',
      answers: [
        'The route is lit and dark at the same time',
        'The route is lit',
        'The route is stable',
      ],
      correct: 0,
      hint: 'Look for the claim that cannot stand beside the rest without breaking logic.',
    },
    {
      prompt: 'Which claim cannot be true if the beacon at {routeTitle} is already burning?',
      answers: ['The beacon has never been lit', 'The beacon is bright', 'Travelers can see it'],
      correct: 0,
      hint: 'One answer directly denies the shared premise.',
    },
    {
      prompt: 'Which report clashes with the confirmed route signs in {region}?',
      answers: ['The bridge is both restored and missing', 'The lantern is visible', 'The line hums steadily'],
      correct: 0,
      hint: 'A contradiction says mutually exclusive things are true together.',
    },
  ],
}

function fillTemplate(text, level, landmark) {
  return text
    .replaceAll('{routeTitle}', level.title)
    .replaceAll('{landmarkTitle}', landmark.title)
    .replaceAll('{region}', level.region)
}

function buildShrineChallenge(level, landmark, shrineIndex) {
  const skill = landmark.challengeSkill ?? level.challengeSkills[shrineIndex % level.challengeSkills.length]
  const templates = challengeTemplates[skill]
  const template = templates[(level.index + shrineIndex - 1) % templates.length]

  return {
    prompt: fillTemplate(template.prompt, level, landmark),
    answers: template.answers.map((answer) => fillTemplate(answer, level, landmark)),
    correct: template.correct,
    hint: fillTemplate(template.hint, level, landmark),
  }
}

function mapChoice(choice) {
  return {
    prompt: choice.prompt,
    safe: {
      id: choice.safe.id,
      label: choice.safe.label,
      summary: choice.safe.summary,
      outcome: choice.safe.outcome,
      charge_delta: choice.safe.chargeDelta,
      relic_delta: choice.safe.relicDelta,
      journal_text: choice.safe.journalText,
    },
    risky: {
      id: choice.risky.id,
      label: choice.risky.label,
      summary: choice.risky.summary,
      outcome: choice.risky.outcome,
      charge_delta: choice.risky.chargeDelta,
      relic_delta: choice.risky.relicDelta,
      journal_text: choice.risky.journalText,
    },
  }
}

function mapLandmark(level, landmark, index) {
  const shrineIndex = level.landmarks
    .slice(0, index + 1)
    .filter((entry) => entry.kind === 'shrine').length - 1
  const challenge = landmark.kind === 'shrine' ? buildShrineChallenge(level, landmark, shrineIndex) : null

  return {
    id: landmark.id,
    title: landmark.title,
    kind: landmark.kind,
    description: landmark.description,
    scene_detail: landmark.sceneDetail,
    journal_text: landmark.journalText,
    challenge_skill: landmark.challengeSkill ?? null,
    charge_delta: landmark.chargeDelta ?? 0,
    relic_delta: landmark.relicDelta ?? 0,
    choice: landmark.choice ? mapChoice(landmark.choice) : null,
    prompt: challenge?.prompt ?? null,
    answers: challenge?.answers ?? [],
    correct: challenge?.correct ?? 0,
    hint: challenge?.hint ?? null,
  }
}

function mapLevel(level) {
  return {
    id: level.id,
    index: level.index,
    region: level.region,
    title: level.title,
    tagline: level.tagline,
    goal: level.goal,
    story_beat: level.storyBeat,
    reward: level.reward,
    reward_upgrade: level.rewardUpgrade ?? null,
    challenge_skills: level.challengeSkills,
    palette: {
      sky_top: level.palette.skyTop,
      sky_bottom: level.palette.skyBottom,
      far: level.palette.far,
      mid: level.palette.mid,
      ground: level.palette.ground,
      accent: level.palette.accent,
    },
    landmarks: level.landmarks.map((landmark, index) => mapLandmark(level, landmark, index)),
  }
}

async function loadAdventureLevels() {
  const source = await readFile(sourcePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  })

  const encoded = Buffer.from(transpiled.outputText, 'utf8').toString('base64')
  const moduleUrl = `data:text/javascript;base64,${encoded}`
  const module = await import(moduleUrl)
  return module.adventureLevels
}

async function main() {
  const adventureLevels = await loadAdventureLevels()
  const campaign = {
    version: 1,
    title: 'Sky of Many Lanterns: Echo Trail',
    level_count: adventureLevels.length,
    levels: adventureLevels.map(mapLevel),
  }

  await mkdir(outputDir, { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(campaign, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${campaign.level_count} levels to ${path.relative(rootDir, outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
