# Detailed Goal For Contractor CEO

## Assignment
Reimplement this project from scratch as a production-ready first version of a mobile-first logic-learning product for children, using the existing repo as the specification source rather than as the codebase to extend.

The expected finish line is a live deployable product plus a handoff package, not only documents or prototypes.

## Product Goal
Build a product that helps children ages 8-10 practice logical thinking through short daily sessions that feel warm, game-like, safe, and measurably useful to parents.

The buyer is the parent.
The primary user is the child.
The child experience must not behave like open chat, a worksheet dump, or a generic AI tutor.

## Working Product Definition
The rebuilt product should preserve these core truths:
- `Target user`: child age `8-10`, especially the `9-11` band used by the current game direction
- `Core learning skills`: classification, patterns, if/then reasoning, contradiction detection, simple deduction
- `Core loop`: 5-7 task daily expedition with hints, explanations, progress updates, and a return reason for tomorrow
- `Parent value`: visible skill progress, clear strengths/struggles, low-supervision daily use
- `AI posture`: grounded and constrained, not open-ended child chat
- `Presentation`: `Sky of Many Lanterns` adventure framing with calm, warm, non-manipulative tone

## Reimplementation Scope
The contractor should deliver a clean rebuild that includes:
- parent account and child-profile setup flow
- baseline diagnostic flow
- daily session engine with adaptive task selection
- task play UI with retry, hint ladder, and final explanation
- minimal parent dashboard with concrete skill reporting
- content store and review-state model
- grounded explanation pipeline with source trace references
- analytics/event instrumentation
- mobile-first web delivery as the first shipping surface
- installable/offline-capable shell if the chosen architecture supports the same behavior

## Required Inputs
The contractor must work from all of the following, not just the corpus:
- source corpus manifest and provenance records
- PRD, user flows, game direction, game systems, and execution docs
- the detailed product description in this package
- the defined task, explanation, and traceability expectations in the attached materials

## Non-Goals
The contractor should not expand scope into:
- native iOS and Android codebases as the initial build target
- open-ended AI tutor chat for children
- billing-first work
- broad multi-age curriculum
- large new game surfaces unrelated to the daily expedition loop
- model training as the first implementation move

## Success Criteria
The reimplementation is successful only if it can satisfy all of these at once:
- the parent can create a child profile and reach the first session quickly
- the child can complete a short diagnostic and short daily expedition loop end to end
- the system can serve canonical tasks with source trace metadata
- hints and explanations are grounded, structured, age-appropriate, and brief
- the parent can see strongest skill, struggle area, and next focus recommendation
- the tone remains warm and respectful rather than robotic or manipulative
- the architecture leaves room for later retrieval-backed and AI-assisted extensions without requiring immediate model training

## Recommended Contractor Framing
Treat this as a product-and-content-system rebuild, not just an app rebuild.

The contractor needs to solve four linked problems:
- product UX for parent and child
- content modeling and review workflow
- learning progression and adaptation
- grounded explanation generation with source traceability

If they optimize only for frontend polish or only for AI plumbing, they will miss the actual product.

## Delivery Expectation
The contractor CEO should staff for:
- product/UX
- frontend engineering
- backend or content-platform engineering
- AI/retrieval integration
- QA
- child-safety/privacy review

This project is small enough for an MVP team, but not small enough to be responsibly delegated as "just build something from the books."

## Handoff Principle
The fastest correct path is:
1. freeze the current repo as the specification baseline
2. approve the input set and rights assumptions
3. produce the contractor technical plan against that baseline
4. build the new implementation in clean slices with validation against the documented behavior
