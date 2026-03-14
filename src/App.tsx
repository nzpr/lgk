import { type CSSProperties, useEffect, useState } from 'react'
import './App.css'
import { adventureLevels } from './game/data'
import {
  advanceRun,
  answerShrine,
  chooseRoute,
  createAdventureDemoState,
  createAdventureState,
  finishCurrentLevel,
  getCurrentLevel,
  getFlowStatus,
  getLandmarkApproaches,
  getLevelCompletion,
  getRunLandmark,
  getRunTask,
  getUnlockedLevels,
  getUpgradeLabel,
  resolveLandmark,
  startLevel,
} from './game/engine'
import { loadAdventureState, resetAdventureState, saveAdventureState } from './game/storage'
import type { AdventureState, LandmarkApproachId } from './game/types'

type Screen = 'landing' | 'atlas' | 'level' | 'ending'

function buildInitialSession(): { state: AdventureState; screen: Screen } {
  const params = new URLSearchParams(window.location.search)
  if (params.get('demo') === '1') {
    return {
      state: createAdventureDemoState(),
      screen: 'atlas',
    }
  }

  const saved = loadAdventureState()
  if (!saved) {
    return {
      state: createAdventureState(),
      screen: 'landing',
    }
  }

  if (saved.run) {
    return { state: saved, screen: 'level' }
  }

  if (saved.endingUnlocked) {
    return { state: saved, screen: 'ending' }
  }

  return { state: saved, screen: 'atlas' }
}

function App() {
  const [boot] = useState(buildInitialSession)
  const [state, setState] = useState<AdventureState>(boot.state)
  const [screen, setScreen] = useState<Screen>(boot.screen)

  useEffect(() => {
    if (screen === 'landing') {
      return
    }

    saveAdventureState(state)
  }, [screen, state])

  useEffect(() => {
    if (!window.location.search.includes('demo=1')) {
      return
    }

    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const currentLevel = getCurrentLevel(state.currentLevelId)
  const currentLandmark = getRunLandmark(state)
  const currentTask = getRunTask(state)
  const currentApproaches = currentLandmark ? getLandmarkApproaches(currentLandmark) : null
  const currentLandmarkState =
    currentLandmark && state.run ? state.run.landmarkStates[currentLandmark.id] : null
  const unlockedLevels = getUnlockedLevels(state)
  const recentJournal = state.journal.slice(-6).reverse()
  const completedCount = state.completedLevels.length
  const discoveredRelics = state.relics
  const upgradedTools = state.upgrades.map(getUpgradeLabel)

  function startStory() {
    setState(createAdventureState('Mira'))
    setScreen('atlas')
  }

  function startDemo() {
    setState(createAdventureDemoState())
    setScreen('atlas')
  }

  function openLevel(levelId: string) {
    setState((previous) => startLevel(previous, levelId))
    setScreen('level')
  }

  function resumeRun() {
    if (!state.run) {
      return
    }
    setScreen('level')
  }

  function goToAtlas() {
    setScreen(state.endingUnlocked ? 'ending' : 'atlas')
  }

  function inspectLandmark(approachId: LandmarkApproachId) {
    setState((previous) => resolveLandmark(previous, approachId))
  }

  function makeChoice(choiceType: 'safe' | 'risky') {
    if (!currentLandmark?.choice) {
      return
    }

    setState((previous) => chooseRoute(previous, currentLandmark.choice![choiceType]))
  }

  function solveShrine(answerIndex: number) {
    setState((previous) => answerShrine(previous, answerIndex))
  }

  function moveForward() {
    setState((previous) => advanceRun(previous))
  }

  function finishLevelNow() {
    setState((previous) => {
      const next = finishCurrentLevel(previous)
      setScreen(next.endingUnlocked ? 'ending' : 'atlas')
      return next
    })
  }

  function resetProgress() {
    resetAdventureState()
    setState(createAdventureState())
    setScreen('landing')
  }

  function renderLanding() {
    return (
      <main className="screen landing-screen">
        <section className="landing-hero panel">
          <div className="landing-copy">
            <span className="eyebrow">Pseudo-2D adventure campaign</span>
            <h1>Sky of Many Lanterns: Echo Trail</h1>
            <p>
              Walk the broken sky roads as Mira, relight twenty lost routes, and discover a
              drifting world one hand-built stage at a time. This is now a world-discovery
              adventure with shrine puzzles inside it, not a worksheet shell.
            </p>
            <div className="hero-actions">
              <button className="primary-button" data-testid="start-story" onClick={startStory}>
                Begin the journey
              </button>
              <button className="ghost-button" data-testid="start-demo" onClick={startDemo}>
                Play a mid-campaign demo
              </button>
            </div>
            <div className="trust-band">
              <span>20 authored levels</span>
              <span>4 districts</span>
              <span>2 shrine puzzles per route</span>
              <span>World journal and relic hunt</span>
            </div>
          </div>
          <div className="landing-aside">
            <div className="story-card">
              <h2>Plot</h2>
              <p>
                A torn beacon line drops Mira and her storm moth guide Nilo into a sky world that
                is forgetting its own map. The Quiet is not a beast but an absence spreading
                through dead routes. Relight the Lantern Spine before the last districts vanish
                into silence.
              </p>
            </div>
            <div className="hero-diorama" aria-hidden="true">
              <div className="hero-diorama__sun" />
              <div className="hero-diorama__cloud hero-diorama__cloud--a" />
              <div className="hero-diorama__cloud hero-diorama__cloud--b" />
              <div className="hero-diorama__island hero-diorama__island--far" />
              <div className="hero-diorama__island hero-diorama__island--mid" />
              <div className="hero-diorama__island hero-diorama__island--front" />
              <div className="hero-diorama__spire" />
              <div className="hero-diorama__lantern hero-diorama__lantern--a" />
              <div className="hero-diorama__lantern hero-diorama__lantern--b" />
              <div className="hero-diorama__lantern hero-diorama__lantern--c" />
            </div>
            <div className="level-preview-grid">
              {adventureLevels.slice(0, 10).map((level) => (
                <article key={level.id} className="level-preview-card">
                  <strong>{level.index}. {level.title}</strong>
                  <span>{level.region}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  function renderAtlas() {
    return (
      <main className="screen atlas-screen">
        <section className="atlas-top panel">
          <div>
            <span className="eyebrow">Camp atlas</span>
            <h1>Echo Trail Camp</h1>
            <p className="muted">
              {state.run
                ? 'Mira is already on a route. Resume the current expedition or choose another unlocked district.'
                : 'Choose the next route, read the latest field notes, and keep the world waking level by level.'}
            </p>
          </div>
          <div className="camp-stats">
            <div className="stat-card">
              <span>Routes restored</span>
              <strong>{completedCount} / 20</strong>
            </div>
            <div className="stat-card">
              <span>Relics recovered</span>
              <strong>{discoveredRelics}</strong>
            </div>
            <div className="stat-card">
              <span>Upgrades</span>
              <strong>{upgradedTools.length}</strong>
            </div>
          </div>
          <div className="atlas-actions">
            {state.run && (
              <button className="primary-button" data-testid="resume-run" onClick={resumeRun}>
                Resume current route
              </button>
            )}
            {state.endingUnlocked && (
              <button className="ghost-button" onClick={() => setScreen('ending')}>
                View the ending
              </button>
            )}
            <button className="ghost-button" onClick={resetProgress}>
              Reset campaign
            </button>
          </div>
        </section>

        <section className="atlas-grid">
          {adventureLevels.map((level) => {
            const unlocked = level.index <= state.unlockedLevelIndex
            const completion = getLevelCompletion(state, level.id)
            const active = state.currentLevelId === level.id && Boolean(state.run)
            return (
              <article
                key={level.id}
                className={[
                  'atlas-level-card',
                  unlocked ? 'unlocked' : 'locked',
                  completion ? 'completed' : '',
                  active ? 'active' : '',
                ].join(' ')}
                style={
                  {
                    '--level-sky-top': level.palette.skyTop,
                    '--level-sky-bottom': level.palette.skyBottom,
                    '--level-accent': level.palette.accent,
                  } as CSSProperties
                }
              >
                <div className="atlas-level-card__diorama" aria-hidden="true">
                  <div className="atlas-level-card__sun" />
                  <div className="atlas-level-card__ridge atlas-level-card__ridge--far" />
                  <div className="atlas-level-card__ridge atlas-level-card__ridge--mid" />
                  <div className="atlas-level-card__ridge atlas-level-card__ridge--front" />
                </div>
                <div className="atlas-level-card__top">
                  <span className="atlas-level-card__index">Route {level.index}</span>
                  <span className="atlas-level-card__region">{level.region}</span>
                </div>
                <h2>{level.title}</h2>
                <p>{level.tagline}</p>
                <div className="atlas-level-card__meta">
                  <span>{level.challengeSkills.join(' + ')}</span>
                  <span>{level.rewardUpgrade ? `Upgrade: ${getUpgradeLabel(level.rewardUpgrade)}` : level.reward}</span>
                </div>
                {completion && (
                  <div className="atlas-level-card__footer">
                    <strong>{'★'.repeat(completion.stars)}</strong>
                    <span>{completion.relicsFound} relics</span>
                    <span>{completion.rank} rank</span>
                  </div>
                )}
                <button
                  className={completion ? 'ghost-button' : 'primary-button'}
                  disabled={!unlocked}
                  data-testid={`level-card-${level.id}`}
                  onClick={() => openLevel(level.id)}
                >
                  {active ? 'Resume route' : completion ? 'Replay route' : unlocked ? 'Enter route' : 'Locked'}
                </button>
              </article>
            )
          })}
        </section>

        <section className="journal-panel panel">
          <div className="journal-panel__header">
            <div>
              <span className="eyebrow">Field journal</span>
              <h2>Recent discoveries</h2>
            </div>
            <div className="upgrade-list">
              {upgradedTools.length > 0 ? upgradedTools.map((upgrade) => <span key={upgrade}>{upgrade}</span>) : <span>No tools recovered yet</span>}
            </div>
          </div>
          <div className="journal-grid">
            {recentJournal.map((entry) => (
              <article key={entry.id} className="journal-card">
                <strong>{entry.title}</strong>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  function renderLevel() {
    if (!state.run || !currentLevel || !currentLandmark || !currentLandmarkState) {
      return null
    }

    const atFinalLandmark = state.run.currentLandmarkIndex === currentLevel.landmarks.length - 1
    const routeChoice = currentLandmark.choice
    const shrineTask = currentLandmark.kind === 'shrine' ? currentTask : null
    const shrineAnswered = Boolean(currentLandmarkState.taskAnswered)
    const readyToAdvance = currentLandmarkState.resolved && !atFinalLandmark
    const readyToFinish = currentLandmark.kind === 'beacon' && currentLandmarkState.resolved
    const levelProgress = ((state.run.currentLandmarkIndex + 1) / currentLevel.landmarks.length) * 100
    const showChoiceHints = state.upgrades.includes('echoLens') || currentLevel.index <= 5
    const flowStatus = getFlowStatus(state.run.flow)

    return (
      <main className="screen level-screen">
        <section className="level-topbar panel">
          <div>
            <span className="eyebrow">{currentLevel.region}</span>
            <h1>{currentLevel.index}. {currentLevel.title}</h1>
            <p>{currentLevel.goal}</p>
          </div>
          <div className="level-topbar__stats">
            <div className="stat-card">
              <span>Lantern charge</span>
              <strong>{state.run.charge}</strong>
            </div>
            <div className="stat-card">
              <span>Route flow</span>
              <strong>{state.run.flow}</strong>
              <small>{flowStatus}</small>
            </div>
            <div className="stat-card">
              <span>Relics in route</span>
              <strong>{state.run.relicsFound}</strong>
            </div>
            <div className="stat-card">
              <span>Progress</span>
              <strong>{Math.round(levelProgress)}%</strong>
            </div>
            <button className="ghost-button" onClick={goToAtlas}>
              Back to atlas
            </button>
          </div>
        </section>

        <section
          className="route-scene panel"
          style={
            {
              '--scene-sky-top': currentLevel.palette.skyTop,
              '--scene-sky-bottom': currentLevel.palette.skyBottom,
              '--scene-far': currentLevel.palette.far,
              '--scene-mid': currentLevel.palette.mid,
              '--scene-ground': currentLevel.palette.ground,
              '--scene-accent': currentLevel.palette.accent,
              '--traveler-position': `${12 + state.run.currentLandmarkIndex * 19}%`,
            } as CSSProperties
          }
        >
          <div className="scene-background">
            <div className="scene-sun" />
            <div className="scene-haze scene-haze--top" />
            <div className="scene-layer far" />
            <div className="scene-layer mid" />
            <div className="scene-layer ground" />
            <div className="scene-boardwalk" />
            <div className="scene-boardwalk scene-boardwalk--rails" />
            <div className="route-line" />
            <div className="scene-floater scene-floater--a" />
            <div className="scene-floater scene-floater--b" />
            <div className="scene-floater scene-floater--c" />
            {currentLevel.landmarks.map((landmark, index) => {
              const landmarkState = state.run!.landmarkStates[landmark.id]
              const depth = Math.abs(index - state.run!.currentLandmarkIndex)
              return (
                <button
                  key={landmark.id}
                  className={[
                    'scene-landmark',
                    landmark.kind,
                    index === state.run!.currentLandmarkIndex ? 'current' : '',
                    landmarkState.resolved ? 'resolved' : '',
                  ].join(' ')}
                  style={
                    {
                      left: `${12 + index * 19}%`,
                      '--landmark-depth': depth,
                      '--landmark-scale': Math.max(0.76, 1 - depth * 0.08),
                      '--landmark-lift': `${Math.max(0, 14 - depth * 4)}px`,
                    } as CSSProperties
                  }
                >
                  <span>{landmark.title}</span>
                </button>
              )
            })}
            <div className="traveler">
              <div className="traveler__light" />
              <div className="traveler__body" />
            </div>
          </div>
          <div className="scene-copy">
            <div>
              <span className="eyebrow">{currentLandmark.kind}</span>
              <h2>{currentLandmark.title}</h2>
              <p>{currentLandmark.description}</p>
              <p className="muted">{currentLandmark.sceneDetail}</p>
            </div>

            <div className="encounter-strip">
              <span>Route flow: {flowStatus}</span>
              <span>Peak {state.run.peakFlow}</span>
              <span>
                {currentLandmark.kind === 'shrine'
                  ? 'Shrine encounter'
                  : currentLandmark.choice
                    ? 'Branch encounter'
                    : 'Traversal encounter'}
              </span>
            </div>

            {routeChoice && !currentLandmarkState.resolved && (
              <div className="choice-cluster">
                <p className="prompt-text">{routeChoice.prompt}</p>
                <button className="ghost-button" data-testid="choice-safe" onClick={() => makeChoice('safe')}>
                  <strong>{routeChoice.safe.label}</strong>
                  {showChoiceHints && <span>{routeChoice.safe.summary}</span>}
                </button>
                <button className="primary-button" data-testid="choice-risky" onClick={() => makeChoice('risky')}>
                  <strong>{routeChoice.risky.label}</strong>
                  {showChoiceHints && <span>{routeChoice.risky.summary}</span>}
                </button>
              </div>
            )}

            {currentApproaches && !currentLandmarkState.resolved && (
              <div className="choice-cluster">
                <p className="prompt-text">
                  Choose how Mira handles this landmark. The careful line preserves the run. The
                  bold line spends more for stronger flow and relic pressure.
                </p>
                <button
                  className="ghost-button"
                  data-testid="approach-careful"
                  onClick={() => inspectLandmark('careful')}
                >
                  <strong>{currentApproaches.careful.label}</strong>
                  <span>{currentApproaches.careful.summary}</span>
                </button>
                <button
                  className="primary-button"
                  data-testid="approach-bold"
                  onClick={() => inspectLandmark('bold')}
                >
                  <strong>{currentApproaches.bold.label}</strong>
                  <span>{currentApproaches.bold.summary}</span>
                </button>
              </div>
            )}

            {shrineTask && !shrineAnswered && (
              <div className="shrine-panel" data-testid="shrine-panel">
                <span className="eyebrow">Shrine challenge</span>
                <h3>{shrineTask.title}</h3>
                <p>{shrineTask.prompt}</p>
                <div className="answer-grid">
                  {shrineTask.choices.map((choice, index) => (
                    <button
                      key={choice}
                      className="answer-card"
                      data-testid={`answer-${index}`}
                      onClick={() => solveShrine(index)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shrineTask && shrineAnswered && (
              <div className="result-panel">
                <strong>{currentLandmarkState.correct ? 'Shrine opened' : 'Shrine forced open'}</strong>
                <p>{currentLandmarkState.correct ? shrineTask.explanation.summary : shrineTask.explanation.whyNow}</p>
              </div>
            )}

            {readyToAdvance && (
              <button className="primary-button" data-testid="advance-route" onClick={moveForward}>
                Continue along the route
              </button>
            )}

            {readyToFinish && (
              <button className="primary-button" data-testid="complete-route" onClick={finishLevelNow}>
                Finish this route
              </button>
            )}
          </div>
        </section>

        <section className="run-journal panel">
          <div>
            <span className="eyebrow">Current route notes</span>
            <h2>What Mira has learned here</h2>
          </div>
          <div className="journal-grid">
            {state.run.journal.map((entry) => (
              <article key={entry.id} className="journal-card">
                <strong>{entry.title}</strong>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  function renderEnding() {
    return (
      <main className="screen ending-screen">
        <section className="ending-panel panel">
          <span className="eyebrow">World restored</span>
          <h1>The Lantern Spine Burns Again</h1>
          <p>
            Mira chooses to reopen the sky roads instead of locking them down. The districts answer
            one after another, the quiet machinery becomes a living route once more, and Nilo’s
            memory returns in full. The world is not fixed because it is controlled. It is fixed
            because it can be crossed again.
          </p>
          <div className="camp-stats">
            <div className="stat-card">
              <span>Routes restored</span>
              <strong>{state.completedLevels.length}</strong>
            </div>
            <div className="stat-card">
              <span>Relics recovered</span>
              <strong>{state.relics}</strong>
            </div>
            <div className="stat-card">
              <span>Upgrades found</span>
              <strong>{state.upgrades.length}</strong>
            </div>
            <div className="stat-card">
              <span>Best route rank</span>
              <strong>{state.completedLevels.at(-1)?.rank ?? 'A'}</strong>
            </div>
          </div>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setScreen('atlas')}>
              Return to atlas
            </button>
            <button className="ghost-button" onClick={resetProgress}>
              Start fresh
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <div className="game-shell">
      {screen === 'landing' && renderLanding()}
      {screen === 'atlas' && renderAtlas()}
      {screen === 'level' && renderLevel()}
      {screen === 'ending' && renderEnding()}
      <footer className="game-footer">
        <span>Echo Trail</span>
        <span>{unlockedLevels.length} routes visible</span>
        <span>{completedCount} completed</span>
      </footer>
    </div>
  )
}

export default App
