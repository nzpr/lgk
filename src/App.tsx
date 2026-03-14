import { startTransition, useEffect, useState } from 'react'
import './App.css'
import { sourceLookup } from './data/corpus'
import { chapterPlan, regionColors, skillDescriptions, skillLabels } from './data/world'
import {
  addAnalyticsEvent,
  addFlaggedOutput,
  applyCompletedSession,
  buildSessionRecord,
  buildSourceLines,
  createInitialState,
  getBadgeSkills,
  getCurrentChapter,
  getParentSummary,
  selectDailyTasks,
  selectDiagnosticTasks,
  taskBank,
} from './lib/engine'
import { loadState, resetState, saveState } from './lib/storage'
import type {
  ChildProfile,
  HouseholdState,
  ParentAccount,
  SessionType,
  Task,
  TaskOutcome,
} from './types'

type AppView = 'landing' | 'onboarding' | 'diagnostic-briefing' | 'camp' | 'parent' | 'qa'

interface RunTaskState {
  task: Task
  attempts: number
  hintLevel: 0 | 1 | 2 | 3
  selectedIndex: number | null
  status: 'idle' | 'incorrect' | 'correct' | 'explained'
}

interface ActiveRun {
  type: SessionType
  objective: string
  region: string
  chapter: number
  startedAt: string
  tasks: RunTaskState[]
  currentIndex: number
  completed: TaskOutcome[]
}

function buildRun(type: SessionType, state: HouseholdState): ActiveRun {
  const chapter = getCurrentChapter(state)
  const tasks = (type === 'diagnostic' ? selectDiagnosticTasks() : selectDailyTasks(state)).map(
    (task) => ({
      task,
      attempts: 0,
      hintLevel: 0 as const,
      selectedIndex: null,
      status: 'idle' as const,
    }),
  )

  return {
    type,
    objective:
      type === 'diagnostic'
        ? 'Read the lantern network and discover where your Pathfinder starts strongest.'
        : chapter.briefing,
    region: chapter.region,
    chapter: chapter.chapterNumber,
    startedAt: new Date().toISOString(),
    tasks,
    currentIndex: 0,
    completed: [],
  }
}

function determineInitialView(state: HouseholdState): AppView {
  if (!state.parent || !state.child) {
    return 'landing'
  }
  if (!state.diagnosticComplete) {
    return 'diagnostic-briefing'
  }
  return 'camp'
}

function App() {
  const [state, setState] = useState<HouseholdState>(() => loadState() ?? createInitialState())
  const [view, setView] = useState<AppView>(() =>
    determineInitialView(loadState() ?? createInitialState()),
  )
  const [run, setRun] = useState<ActiveRun | null>(null)
  const [sessionResult, setSessionResult] = useState<{
    score: number
    title: string
    landmark: string
  } | null>(null)
  const [parentForm, setParentForm] = useState<ParentAccount>({
    name: '',
    email: '',
    acceptedPrivacyAt: '',
  })
  const [childForm, setChildForm] = useState<ChildProfile>({
    name: '',
    age: 10,
    goal: 'Calm daily practice',
  })
  const [flagReason, setFlagReason] = useState('')
  const [archiveSkill, setArchiveSkill] = useState<'all' | keyof typeof skillLabels>('all')

  useEffect(() => {
    saveState(state)
  }, [state])

  const chapter = getCurrentChapter(state)
  const nextChapter =
    chapterPlan[Math.min(state.world.chapterIndex + 1, chapterPlan.length - 1)]
  const parentSummary = getParentSummary(state)
  const badges = getBadgeSkills(state)
  const currentTask = run?.tasks[run.currentIndex] ?? null
  const sourceLines = currentTask ? buildSourceLines(currentTask.task, sourceLookup) : []
  const completionRatio = run ? (run.currentIndex + 1) / run.tasks.length : 0
  const archiveTasks = taskBank.filter((task) =>
    archiveSkill === 'all' ? true : task.skill === archiveSkill,
  )

  function updateHousehold(next: HouseholdState) {
    setState(next)
  }

  function startRun(type: SessionType) {
    startTransition(() => {
      const nextRun = buildRun(type, state)
      setRun(nextRun)
      setSessionResult(null)
      setFlagReason('')
      setView('camp')
      updateHousehold(
        addAnalyticsEvent(state, 'session_started', {
          type,
          chapter: nextRun.chapter,
          region: nextRun.region,
        }),
      )
    })
  }

  function submitOnboarding() {
    const nextState = addAnalyticsEvent(
      {
        ...state,
        parent: {
          ...parentForm,
          acceptedPrivacyAt: new Date().toISOString(),
        },
        child: childForm,
      },
      'onboarding_completed',
      { childAge: childForm.age, goal: childForm.goal },
    )

    updateHousehold(nextState)
    setView('diagnostic-briefing')
  }

  function answerCurrentTask(index: number) {
    if (!run || !currentTask) {
      return
    }

    if (currentTask.status === 'correct' || currentTask.status === 'explained') {
      return
    }

    const isCorrect = currentTask.task.correctIndex === index
    const nextTask: RunTaskState = {
      ...currentTask,
      attempts: currentTask.attempts + 1,
      selectedIndex: index,
      status: isCorrect ? 'correct' : 'incorrect',
    }

    const nextTasks = run.tasks.map((taskState, position) =>
      position === run.currentIndex ? nextTask : taskState,
    )

    setRun({
      ...run,
      tasks: nextTasks,
    })
  }

  function showHint(level: 1 | 2) {
    if (!run || !currentTask) {
      return
    }

    const nextTasks = run.tasks.map((taskState, position) =>
      position === run.currentIndex
        ? {
            ...taskState,
            hintLevel: Math.max(taskState.hintLevel, level) as 0 | 1 | 2 | 3,
          }
        : taskState,
    )

    setRun({
      ...run,
      tasks: nextTasks,
    })
  }

  function showExplanation() {
    if (!run || !currentTask) {
      return
    }

    const nextTasks = run.tasks.map((taskState, position) =>
      position === run.currentIndex
        ? {
            ...taskState,
            hintLevel: 3 as const,
            status: (taskState.status === 'correct' ? 'correct' : 'explained') as
              | 'correct'
              | 'explained',
          }
        : taskState,
    )

    setRun({
      ...run,
      tasks: nextTasks,
    })
  }

  function resetAttempt() {
    if (!run || !currentTask) {
      return
    }

    const nextTasks = run.tasks.map((taskState, position) =>
      position === run.currentIndex
        ? { ...taskState, selectedIndex: null, status: 'idle' as const }
        : taskState,
    )

    setRun({
      ...run,
      tasks: nextTasks,
    })
  }

  function continueRun() {
    if (!run || !currentTask) {
      return
    }

    const completedAt = new Date().toISOString()
    const outcome: TaskOutcome = {
      taskId: currentTask.task.id,
      skill: currentTask.task.skill,
      correct: currentTask.status === 'correct',
      attempts: Math.max(1, currentTask.attempts),
      hintLevel: currentTask.hintLevel,
      completedAt,
    }

    const nextCompleted = [...run.completed, outcome]
    const shouldShortenMission =
      run.type === 'daily' &&
      nextCompleted.length >= 4 &&
      nextCompleted.slice(-2).every((item) => !item.correct || item.hintLevel === 3)

    if (run.currentIndex === run.tasks.length - 1 || shouldShortenMission) {
      const session = buildSessionRecord(
        run.type,
        run.objective,
        run.region,
        run.chapter,
        nextCompleted,
        run.startedAt,
        completedAt,
      )
      const chapterAfter = getCurrentChapter(state)
      const landmark =
        run.type === 'diagnostic'
          ? `${state.child?.name ?? 'Your Pathfinder'} now has a starting route through the lantern network.`
          : chapterAfter.landmark

      const withSession = applyCompletedSession(state, session)
      const withAnalytics = addAnalyticsEvent(withSession, 'session_completed', {
        type: run.type,
        score: session.score,
        tasks: session.outcomes.length,
      })

      updateHousehold(withAnalytics)
      setRun(null)
      setSessionResult({
        score: session.score,
        title:
          run.type === 'diagnostic'
            ? 'Diagnostic complete'
            : `${chapterAfter.region}: ${chapterAfter.title}`,
        landmark: shouldShortenMission
          ? `${landmark} Tala shortened the last stretch so the mission could still end in confidence.`
          : landmark,
      })
      setView('camp')
      return
    }

    setRun({
      ...run,
      currentIndex: run.currentIndex + 1,
      completed: nextCompleted,
    })
  }

  function reportCurrentOutput() {
    if (!currentTask || !flagReason.trim()) {
      return
    }

    const withFlag = addFlaggedOutput(
      state,
      currentTask.task.id,
      currentTask.task.title,
      flagReason.trim(),
    )
    updateHousehold(addAnalyticsEvent(withFlag, 'output_flagged', { taskId: currentTask.task.id }))
    setFlagReason('')
  }

  function resetExperience() {
    resetState()
    const blank = createInitialState()
    setState(blank)
    setRun(null)
    setSessionResult(null)
    setView('landing')
  }

  return (
    <div className="app-shell">
      <div className="sky-backdrop" />
      <main className="app-frame">
        {!state.parent || !state.child ? (
          <>
            {view === 'landing' && (
              <section className="hero-panel">
                <div className="hero-copy">
                  <span className="eyebrow">For parents and Pathfinders ages 8-10</span>
                  <h1>Warm daily logic practice inside a sky adventure that feels worth coming back to.</h1>
                  <p>
                    Short expeditions. Grounded hints. Visible progress. No open child chat, no noisy
                    reward spam, and no worksheet energy.
                  </p>
                  <div className="hero-actions">
                    <button
                      className="primary-button"
                      data-testid="start-household-setup"
                      onClick={() => setView('onboarding')}
                    >
                      Start the household setup
                    </button>
                    <div className="trust-band">
                      <span>10-minute sessions</span>
                      <span>5 logic strands</span>
                      <span>Parent-managed</span>
                    </div>
                  </div>
                </div>
                <div className="hero-map">
                  <div className="map-card">
                    <h2>Sky of Many Lanterns</h2>
                    <p>
                      Restore routes, decode beacons, and help villages reconnect by solving calm,
                      clever logic missions.
                    </p>
                    <div className="map-glow" />
                  </div>
                </div>
              </section>
            )}

            {view === 'onboarding' && (
              <section className="panel onboarding-panel">
                <header className="panel-header">
                  <span className="eyebrow">Parent onboarding</span>
                  <h2>Create a household in under three minutes.</h2>
                  <p>We only ask for what the child experience needs right now.</p>
                </header>

                <div className="form-grid">
                  <label>
                    <span>Parent name</span>
                    <input
                      data-testid="parent-name-input"
                      value={parentForm.name}
                      onChange={(event) =>
                        setParentForm({ ...parentForm, name: event.target.value })
                      }
                      placeholder="Nadia"
                    />
                  </label>
                  <label>
                    <span>Parent email</span>
                    <input
                      type="email"
                      data-testid="parent-email-input"
                      value={parentForm.email}
                      onChange={(event) =>
                        setParentForm({ ...parentForm, email: event.target.value })
                      }
                      placeholder="nadia@example.com"
                    />
                  </label>
                  <label>
                    <span>Child name or nickname</span>
                    <input
                      data-testid="child-name-input"
                      value={childForm.name}
                      onChange={(event) =>
                        setChildForm({ ...childForm, name: event.target.value })
                      }
                      placeholder="Mika"
                    />
                  </label>
                  <label>
                    <span>Child age</span>
                    <input
                      type="number"
                      data-testid="child-age-input"
                      min={8}
                      max={10}
                      value={childForm.age}
                      onChange={(event) =>
                        setChildForm({ ...childForm, age: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label className="form-span">
                    <span>Family goal</span>
                    <select
                      data-testid="family-goal-select"
                      value={childForm.goal}
                      onChange={(event) =>
                        setChildForm({ ...childForm, goal: event.target.value })
                      }
                    >
                      <option>Calm daily practice</option>
                      <option>Confidence with tricky reasoning</option>
                      <option>Short high-focus screen time</option>
                    </select>
                  </label>
                </div>

                <div className="privacy-note">
                  <strong>Privacy and safety:</strong> parent-managed setup, no open child chat, and
                  every hint or explanation is tied to reviewed content with source traces.
                </div>

                <div className="panel-actions">
                  <button className="ghost-button" onClick={() => setView('landing')}>
                    Back
                  </button>
                  <button
                    className="primary-button"
                    data-testid="create-household"
                    onClick={submitOnboarding}
                    disabled={!parentForm.name || !parentForm.email || !childForm.name}
                  >
                    Create the household
                  </button>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">Lantern Guild household</span>
                <h1>{state.child.name}&apos;s sky routes</h1>
              </div>
              <nav className="topnav">
                <button
                  className={view === 'camp' ? 'nav-pill active' : 'nav-pill'}
                  onClick={() => setView('camp')}
                >
                  Pathfinder
                </button>
                <button
                  className={view === 'parent' ? 'nav-pill active' : 'nav-pill'}
                  data-testid="nav-parent"
                  onClick={() => setView('parent')}
                >
                  Parent
                </button>
                <button
                  className={view === 'qa' ? 'nav-pill active' : 'nav-pill'}
                  data-testid="nav-qa"
                  onClick={() => setView('qa')}
                >
                  QA / Ops
                </button>
              </nav>
            </header>

            {!state.diagnosticComplete && !run && view === 'diagnostic-briefing' && (
              <section className="panel mission-panel">
                <div>
                  <span className="eyebrow">First session</span>
                  <h2>The lantern network needs a calm first reading.</h2>
                  <p>
                    This opening diagnostic feels like a mission, not a test. {state.child.name} will
                    solve 10 short tasks across all five logic strands so the next expedition starts at
                    the right level.
                  </p>
                </div>
                <ul className="check-list">
                  <li>Warm guided copy, no pressure framing</li>
                  <li>Easy early win and visible progress bar</li>
                  <li>Parent summary immediately after completion</li>
                </ul>
                <button
                  className="primary-button"
                  data-testid="start-diagnostic"
                  onClick={() => startRun('diagnostic')}
                >
                  Start the diagnostic
                </button>
              </section>
            )}

            {run && currentTask && (
              <section className="session-layout">
                <aside className="session-rail panel">
                  <span className="eyebrow">
                    {run.type === 'diagnostic' ? 'Diagnostic route' : chapter.region}
                  </span>
                  <h2>{run.type === 'diagnostic' ? 'Find the starting path.' : chapter.title}</h2>
                  <p>{run.objective}</p>
                  <div className="progress-meter">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.round(completionRatio * 100)}%` }}
                    />
                  </div>
                  <p className="muted">
                    Task {run.currentIndex + 1} of {run.tasks.length}
                  </p>
                  <div className="mission-chip">{skillLabels[currentTask.task.skill]}</div>
                  <div className="trace-box">
                    <strong>Grounded help</strong>
                    <p>{currentTask.task.sourceTrace.note}</p>
                  </div>
                </aside>

                <section className="task-panel panel">
                  <header className="task-header">
                    <div>
                      <span className="eyebrow">{currentTask.task.title}</span>
                      <h2>{currentTask.task.prompt}</h2>
                    </div>
                    <span className="difficulty-badge">Difficulty {currentTask.task.difficulty}</span>
                  </header>

                  <div className="choice-grid">
                    {currentTask.task.choices.map((choice, index) => {
                      const selected = currentTask.selectedIndex === index
                      const correct = currentTask.status === 'correct' && currentTask.task.correctIndex === index
                      return (
                        <button
                          key={choice}
                          data-testid={`choice-${index}`}
                          className={[
                            'choice-card',
                            selected ? 'selected' : '',
                            correct ? 'correct' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => answerCurrentTask(index)}
                        >
                          {choice}
                        </button>
                      )
                    })}
                  </div>

                  {currentTask.status === 'incorrect' && (
                    <div className="feedback-box warning">
                      <strong>Not quite yet.</strong>
                      <p>That clue chain still leaves something out. Try a calmer pass or ask Tala for support.</p>
                    </div>
                  )}

                  {currentTask.hintLevel >= 1 && (
                    <div className="feedback-box">
                      <strong>Hint 1</strong>
                      <p>{currentTask.task.hintSteps[0]}</p>
                    </div>
                  )}

                  {currentTask.hintLevel >= 2 && (
                    <div className="feedback-box">
                      <strong>Hint 2</strong>
                      <p>{currentTask.task.hintSteps[1]}</p>
                    </div>
                  )}

                  {currentTask.hintLevel === 3 && (
                    <div className="feedback-box explanation">
                      <strong>Final explanation</strong>
                      <p>{currentTask.task.explanation.summary}</p>
                      <ul>
                        <li>{currentTask.task.explanation.steps[0]}</li>
                        <li>{currentTask.task.explanation.steps[1]}</li>
                      </ul>
                      <p className="muted">{currentTask.task.explanation.whyNow}</p>
                      <div className="source-list">
                        {sourceLines.map((source) => (
                          <a key={source.id} href={source.sourcePage} target="_blank" rel="noreferrer">
                            Source {source.id}: {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="session-actions">
                    {currentTask.status === 'incorrect' && (
                      <>
                        <button className="ghost-button" onClick={resetAttempt}>
                          Try another answer
                        </button>
                        <button className="ghost-button" onClick={() => showHint(1)}>
                          Hint 1
                        </button>
                        <button className="ghost-button" onClick={() => showHint(2)}>
                          Hint 2
                        </button>
                        <button
                          className="ghost-button"
                          data-testid="show-final-explanation"
                          onClick={showExplanation}
                        >
                          Final explanation
                        </button>
                      </>
                    )}
                    {currentTask.status === 'correct' && (
                      <button
                        className="primary-button"
                        data-testid="continue-expedition"
                        onClick={continueRun}
                      >
                        Continue the expedition
                      </button>
                    )}
                    {currentTask.hintLevel === 3 && (
                      <button
                        className="primary-button"
                        data-testid="continue-with-support"
                        onClick={continueRun}
                      >
                        Continue with support
                      </button>
                    )}
                  </div>

                  <div className="flag-box">
                    <input
                      data-testid="flag-reason-input"
                      value={flagReason}
                      onChange={(event) => setFlagReason(event.target.value)}
                      placeholder="Flag this output for review"
                    />
                    <button
                      className="ghost-button"
                      data-testid="flag-output"
                      onClick={reportCurrentOutput}
                    >
                      Flag
                    </button>
                  </div>
                </section>
              </section>
            )}

            {!run && view === 'camp' && (
              <>
                <section className="camp-hero panel">
                  <div>
                    <span className="eyebrow">Pathfinder base</span>
                    <h2>{chapter.region}: {chapter.title}</h2>
                    <p>{chapter.briefing}</p>
                    <div className="hero-actions">
                      <button
                        className="primary-button"
                        data-testid="start-expedition"
                        onClick={() => startRun(state.diagnosticComplete ? 'daily' : 'diagnostic')}
                      >
                        {state.diagnosticComplete ? 'Start today’s expedition' : 'Start the diagnostic'}
                      </button>
                      <div className="session-stats">
                        <span>{state.world.routesRestored} routes restored</span>
                        <span>{state.world.lanternCharge} lantern charge</span>
                        <span>{state.world.streakDays} session streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="map-constellation">
                    {chapterPlan.map((item, index) => {
                      const active = index === state.world.chapterIndex
                      const cleared = index < state.world.chapterIndex
                      return (
                        <div
                          key={item.id}
                          className={[
                            'map-node',
                            active ? 'active' : '',
                            cleared ? 'cleared' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{ background: regionColors[item.regionIndex - 1] }}
                        >
                          <strong>R{item.regionIndex}</strong>
                          <span>{item.chapterNumber}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {sessionResult && (
                  <section className="panel celebration-panel" data-testid="session-result">
                    <span className="eyebrow">Session result</span>
                    <h2>{sessionResult.title}</h2>
                    <p>{sessionResult.landmark}</p>
                    <div className="celebration-score">Session score {sessionResult.score}</div>
                  </section>
                )}

                <section className="dashboard-grid">
                  <article className="panel stat-panel">
                    <span className="eyebrow">Current mission focus</span>
                    <h3>{skillLabels[chapter.focusSkill]}</h3>
                    <p>{skillDescriptions[chapter.focusSkill]}</p>
                  </article>
                  <article className="panel stat-panel">
                    <span className="eyebrow">Guild base upgrades</span>
                    <ul className="compact-list">
                      {state.world.campUpgrades.map((upgrade) => (
                        <li key={upgrade}>{upgrade}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="panel stat-panel">
                    <span className="eyebrow">Companions</span>
                    <ul className="compact-list">
                      {state.world.companions.length === 0 && <li>First companion unlocks after chapter one.</li>}
                      {state.world.companions.map((companion) => (
                        <li key={companion}>{companion}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="panel stat-panel">
                    <span className="eyebrow">Tomorrow preview</span>
                    <h3>{nextChapter.title}</h3>
                    <p>{nextChapter.briefing}</p>
                  </article>
                </section>

                <section className="panel skill-panel">
                  <header className="panel-header">
                    <span className="eyebrow">Reasoning strands</span>
                    <h2>Mastery that feels specific, not generic.</h2>
                  </header>
                  <div className="skill-grid">
                    {Object.entries(state.learner).map(([skill, score]) => (
                      <article key={skill} className="skill-card">
                        <div className="skill-card-head">
                          <h3>{skillLabels[skill as keyof typeof skillLabels]}</h3>
                          <span>{score}</span>
                        </div>
                        <div className="progress-meter small">
                          <div className="progress-fill" style={{ width: `${score}%` }} />
                        </div>
                        <p>{skillDescriptions[skill as keyof typeof skillDescriptions]}</p>
                      </article>
                    ))}
                  </div>
                  <div className="badge-row">
                    {badges.length === 0 && <span className="badge-chip">First mastery badge unlocks soon.</span>}
                    {badges.map((badge) => (
                      <span key={badge} className="badge-chip">
                        {skillLabels[badge]} badge
                      </span>
                    ))}
                  </div>
                </section>
              </>
            )}

            {!run && view === 'parent' && (
              <section className="parent-layout">
                <section className="panel">
                  <span className="eyebrow">Weekly guild report</span>
                  <h2>Concrete progress for {state.parent.name}</h2>
                  <p>{parentSummary.weeklyDigest}</p>
                  <div className="feedback-box">
                    <strong>{parentSummary.strongestNote}</strong>
                    <p>{parentSummary.struggleNote}</p>
                    <p className="muted">{parentSummary.nextAction}</p>
                  </div>
                  <div className="parent-highlights">
                    <div>
                      <strong>{parentSummary.recentSessions}</strong>
                      <span>recent sessions</span>
                    </div>
                    <div>
                      <strong>{skillLabels[parentSummary.strongestSkill]}</strong>
                      <span>strongest skill</span>
                    </div>
                    <div>
                      <strong>{skillLabels[parentSummary.struggleSkill]}</strong>
                      <span>current struggle</span>
                    </div>
                    <div>
                      <strong>{skillLabels[parentSummary.nextFocus]}</strong>
                      <span>recommended next focus</span>
                    </div>
                  </div>
                </section>

                <section className="panel">
                  <span className="eyebrow">Session history</span>
                  <h2>Recent expedition evidence</h2>
                  <div className="history-list">
                    {state.sessions
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((session) => (
                        <article key={session.id} className="history-item">
                          <div>
                            <strong>{session.objective}</strong>
                            <p>
                              {session.type === 'diagnostic' ? 'Diagnostic' : 'Daily session'} · {session.score}
                              /16 average
                            </p>
                          </div>
                          <span>{new Date(session.completedAt).toLocaleDateString()}</span>
                        </article>
                      ))}
                  </div>
                </section>
              </section>
            )}

            {!run && view === 'qa' && (
              <section className="qa-layout">
                <section className="panel">
                  <span className="eyebrow">Analytics hooks</span>
                  <h2>Recent production-style events</h2>
                  <div className="log-list">
                    {state.analytics.length === 0 && <p>No events yet. Start onboarding or a session to populate logs.</p>}
                    {state.analytics
                      .slice()
                      .reverse()
                      .slice(0, 12)
                      .map((event) => (
                        <article key={event.id} className="log-item">
                          <strong>{event.type}</strong>
                          <code>{JSON.stringify(event.detail)}</code>
                        </article>
                      ))}
                  </div>
                </section>
                <section className="panel">
                  <span className="eyebrow">Content explorer</span>
                  <h2>Reviewed runtime task bank</h2>
                  <div className="session-actions">
                    <button
                      className={archiveSkill === 'all' ? 'nav-pill active' : 'nav-pill'}
                      onClick={() => setArchiveSkill('all')}
                    >
                      All
                    </button>
                    {Object.entries(skillLabels).map(([skill, label]) => (
                      <button
                        key={skill}
                        className={archiveSkill === skill ? 'nav-pill active' : 'nav-pill'}
                        onClick={() => setArchiveSkill(skill as keyof typeof skillLabels)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="history-list">
                    {archiveTasks.slice(0, 8).map((task) => (
                      <article key={task.id} className="history-item">
                        <div>
                          <strong>{task.title}</strong>
                          <p>
                            {skillLabels[task.skill]} · difficulty {task.difficulty} · {task.reviewState}
                          </p>
                        </div>
                        <span>Sources {task.sourceTrace.sourceIds.join(', ')}</span>
                      </article>
                    ))}
                  </div>
                </section>
                <section className="panel">
                  <span className="eyebrow">Flagged output queue</span>
                  <h2>Bad-output handling</h2>
                  <div className="log-list">
                    {state.flaggedOutputs.length === 0 && <p>No outputs flagged yet.</p>}
                    {state.flaggedOutputs.map((flag) => (
                      <article key={flag.id} className="log-item">
                        <strong>{flag.taskTitle}</strong>
                        <p>{flag.reason}</p>
                      </article>
                    ))}
                  </div>
                  <button
                    className="ghost-button"
                    data-testid="reset-household-state"
                    onClick={resetExperience}
                  >
                    Reset local household state
                  </button>
                </section>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
