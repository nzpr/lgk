# PRD: Logic Learning MVP

## Status
Draft v1

## Date
2026-03-10

## Owner
Founder / Product

## Related ADR
- [ADR-0001](/workspace/docs/adr/0001-logic-learning-platform-strategy.md)

## Product Summary
Build a lean mobile-first logic learning product for children ages 8-10.
The MVP should solve one job extremely well: help a child practice logical thinking through short, adaptive, high-quality daily sessions.
The product should feel warm, personal, and absorbing rather than cold, robotic, or test-like.

## Problem
Parents want one trustworthy tool that actually improves a child's reasoning.
Current alternatives are fragmented:
- worksheets are low-engagement,
- puzzle apps rarely show learning progress,
- AI tutors are not grounded, not child-safe enough, and not optimized for logic skill building.

## Target Users
### Buyer
Parent of a child aged 8-10.

### Primary User
Child aged 8-10 with basic reading ability and access to a phone or tablet.

### Secondary User
Parent checking setup, progress, and habit consistency.

## JTBD
### Parent
"Help my child build reasoning skills through short, useful daily sessions without me having to supervise every minute."

### Child
"Practice thinking through interesting logic challenges without the app feeling like school."

## Goals
### Product Goals
- Deliver one excellent daily logic practice loop.
- Personalize difficulty and next tasks.
- Keep AI outputs constrained and safe.
- Make the child want to come back tomorrow.

### Learning Goals
- Improve logical thinking through a tight set of core subskills:
  - classification,
  - patterns,
  - if/then reasoning,
  - contradiction detection,
  - simple deduction.

## Non-Goals
- Full open-ended AI tutor chat.
- Broad multi-age curriculum.
- Multiple game surfaces at launch.
- Training a proprietary foundation model.
- Billing in the first build cycle.

## MVP Scope
### Included
- Parent onboarding and account creation.
- Child profile creation.
- Baseline diagnostic.
- One core daily session loop.
- Adaptive task selection.
- Hint ladder and explanation engine.
- Minimal parent progress summary.
- Content pipeline for seed corpus.
- RAG-backed explanation and constrained generation.

### Excluded
- Voice mode.
- Social features.
- Classroom features.
- Native iOS/Android codebases.
- User-generated content.
- Extra game modes beyond the core loop.

## Core Value Proposition
For parents:
- useful screen time,
- visible improvement,
- short independent sessions.

For children:
- clear challenges,
- fast feedback,
- a sense of progress.

## Core Experience Principles
- Session-first, not content-library-first.
- Child UX must feel like a game, not a textbook.
- Parent trust must be earned through transparency and progress evidence.
- AI must stay grounded, brief, and inspectable.
- The experience must feel warm, cozy, and human-centered.
- Personalization must feel specific and caring, not generic.
- Reward loops should build attachment and anticipation, not overstimulation.

## Experience Direction
### Emotional Target
- warm
- personal
- calm
- encouraging
- immersive

### Emotional Anti-Targets
- clinical
- robotic
- generic chatbot
- school-admin-like
- noisy hyper-gamification

### Implications
- Child-facing copy should sound like a patient guide.
- Parent-facing UX should feel trustworthy and calm.
- Explanation quality is not enough; emotional quality matters too.
- Visual design and motion should support comfort, focus, and anticipation.

## Core Loop
### Daily Session
5-7 tasks selected from the learner model.
This is the core product.
Everything else is secondary.

## Narrative Layer
- The child should feel they are returning to a familiar place that helps them think better.
- Narrative framing should stay light and support the core task instead of competing with it.

## User Stories
### Parent
- As a parent, I want to create a child profile in under 3 minutes.
- As a parent, I want a clear sense that my child is actually improving at reasoning.
- As a parent, I want the child experience to be safe and free of open chat.

### Child
- As a child, I want to start playing quickly after onboarding.
- As a child, I want tasks to feel solvable but not boring.
- As a child, I want hints when I get stuck.
- As a child, I want explanations that use simple language.
- As a child, I want the app to feel like it remembers me and understands how I learn.

## Functional Requirements
### FR-1 Account System
- Parent account with email sign-up.
- Parent-managed child profiles.

### FR-2 Assessment
- 10-15 minute baseline diagnostic.
- Skill scoring across core logic dimensions.
- Starting difficulty assignment.

### FR-3 Content Delivery
- Serve tasks from a canonical content store.
- Attach metadata:
  - skill,
  - subskill,
  - age band,
  - difficulty,
  - prerequisite,
  - explanation assets.

### FR-4 Adaptive Engine
- Select next task using learner skill estimates, recency, and variety constraints.
- Prevent repeated failure loops.
- Trigger remediation sets when performance drops.

### FR-5 Hints and Explanations
- Multi-step hint ladder.
- Final explanation grounded in approved content.
- Constrained output schema for AI generation.
- Hint and explanation tone must remain warm, personal, and age-appropriate.

### FR-6 Parent Dashboard
- Recent sessions completed.
- Strongest skill.
- Current struggle area.
- Suggested next focus area.
- Progress summaries should feel specific to the child, not mass-produced.

### FR-7 Analytics
- Funnel events.
- Session outcomes.
- Hint usage.
- Skill progression.

## AI Requirements
### AI-1 Retrieval
- Use retrieval over approved corpus and structured knowledge objects.
- Do not answer from model memory when a grounded explanation is required.

### AI-2 Structured Generation
- Generate only into fixed schemas for:
  - hints,
  - explanation variants,
  - task variants,
  - parent summaries.

### AI-3 Safety
- No open freeform child chat in MVP.
- No sensitive profiling.
- No manipulative or emotionally dependent language.
- No unsafe content leakage from source corpus.
- No fake intimacy that pressures the child to return.

### AI-4 Evals
- Accuracy eval.
- Age appropriateness eval.
- Hallucination eval.
- Hint usefulness eval.
- Tone and safety eval.

## Content Requirements
- Parse and normalize the 18-book seed corpus.
- Extract concepts, examples, exercises, and explanations.
- Build a canonical task bank of at least 100 reviewed tasks for MVP.
- Maintain source traceability from every task back to source material or internal authoring.

## Non-Functional Requirements
### Performance
- First child playable screen in under 2 seconds on standard mobile web.
- Hint or explanation response under 3 seconds median.

### Reliability
- 99.5% availability target for MVP.
- Fallback non-AI explanation path for critical flows.

### Privacy and Compliance
- Parent-managed accounts by default.
- Minimal PII collection.
- Data deletion workflow.
- Child-directed safety review before launch.

### Moderation and Auditability
- Log generated outputs used in production.
- Keep source references for retrieved explanations.
- Allow human review of bad outputs and task issues.

## Success Metrics
### Activation
- Visitor to parent signup.
- Signup to child profile completion.
- Child profile to first session completion.

### Engagement
- Day-1, Day-7, Day-30 family retention.
- Average sessions per child per week.
- Session completion rate.

### Learning
- Diagnostic to week-4 skill delta.
- Reduced hint dependence over time on mastered skills.
- Parent-reported perceived improvement.

## Launch Criteria
- 100 reviewed tasks in production.
- One complete daily session loop functional.
- Explanation accuracy eval passes threshold.
- No critical child safety or privacy blockers.

## Risks
- Weak content normalization from source books.
- Overuse of AI where deterministic content would be better.
- Retention failure if gameplay is too school-like.
- Parent value unclear if dashboard is too vague.

## Open Questions
- Final age band for launch: 8-10 or 7-10?
- Whether to ship web-only or PWA at launch.
- Whether spatial reasoning should be in MVP or phase 2.
- Final pricing after parent interviews.

## Immediate Next Deliverables
- Content ontology and skill taxonomy.
- Data model.
- UX wireframes.
- Retrieval and eval spec.
- Seed task authoring workflow.
