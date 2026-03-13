# Detailed Product Description

## Product Summary
This product is a mobile-first logic-learning experience for children ages 8-10, sold to parents.

It should feel like:
- a warm adventure game for the child
- a trustworthy learning tool for the parent

It should not feel like:
- a worksheet app
- an open chatbot
- a generic AI tutor
- a noisy hyper-gamified reward machine

## Required End State
The required end state is:
- a production-ready product
- a deployed environment that stakeholders can inspect
- and a handoff package that explains the product, inputs, and operating expectations

## Customer And User Model
The buyer is the parent.
The primary user is the child.
The parent wants useful, low-supervision daily practice with visible progress.
The child wants short challenges that feel like meaningful game missions, not schoolwork.

## Core Job To Be Done
Help a child practice logical thinking through short, adaptive, high-quality daily sessions that feel safe, absorbing, and clearly useful.

## Learning Scope
The MVP focuses on five subskills:
- classification
- patterns
- if/then reasoning
- contradiction detection
- simple deduction

The product is intentionally narrow.
It is not a broad curriculum platform for every school subject.

## Core Product Loop
The core loop is a daily expedition session:
1. The child returns to the game world.
2. The system serves 5-7 logic tasks.
3. Difficulty and skill mix adapt to learner performance.
4. If the child struggles, the system offers retries, hints, and a grounded explanation.
5. Session completion produces a visible world change and progress update.
6. The child leaves with a reason to come back tomorrow.

Everything else is secondary to this loop.

## Product Surfaces
The intended MVP includes:
- parent onboarding
- child profile creation
- baseline diagnostic
- daily expedition loop
- hint ladder and explanation system
- minimal parent progress dashboard
- analytics and QA hooks

## Narrative And Experience Direction
The current approved direction is `Sky of Many Lanterns`.

The child is a young Pathfinder restoring a network of lantern routes between floating islands.
Logical thinking is framed as useful expedition work:
- decoding routes
- repairing signal towers
- reopening bridges
- resolving conflicting notes
- recovering lost knowledge

The emotional target is:
- warm
- personal
- calm
- encouraging
- immersive

The experience should avoid:
- clinical tone
- robotic phrasing
- manipulative streak pressure
- fake emotional dependency
- frightening stakes

## Why This Product Exists
The parent problem is that existing options are fragmented:
- worksheets are low-engagement
- puzzle apps rarely show learning progress
- generic AI tutors are not grounded or child-safe enough

The product proposition is:
- useful screen time
- clear reasoning practice
- short independent daily use
- visible progress for the parent

## AI And Content Position
The product should use AI carefully and narrowly.

The current strategy is:
- use curated structured content first
- use retrieval or grounded generation for hints and explanations
- do not start with open-ended child chat
- do not start by training a model on the corpus

AI output must be:
- constrained
- grounded
- brief
- age-appropriate
- inspectable

## Input Material
The input is not only the source corpus.
The real input set includes:
- the 18-book logic corpus and provenance manifests
- the product requirements and user flows
- the age-10 narrative/game direction
- the skill taxonomy
- the content schemas and review workflow
- the safety and tone constraints

Without those constraints, a contractor could build the wrong product even if they had all the books.

## Content System
The product needs a canonical task bank with:
- skill tags
- difficulty
- age band
- hints
- explanation assets
- review state
- source trace metadata

Launch content should be reviewed and approved before production use.

## Parent Value Layer
The parent should see:
- recent session completion
- strongest skill
- current struggle area
- suggested next focus area

Parent-facing copy should be concrete and useful, not vague or gamified.

## Safety And Trust Requirements
The product must preserve:
- parent-managed account model
- minimal child-facing freeform generation
- child-safe tone
- source traceability for grounded outputs
- bad-output review and takedown path

## Platform Direction
The current strategy is web-first.
The first implementation target is a mobile-first web product.
Native wrappers can come later if justified.

## Contractor Scope
A contractor should treat this as a combined:
- product design problem
- content-platform problem
- learning-system problem
- child-safe AI UX problem

It is not just a frontend reskin and not just a data-ingestion job.

## What Success Looks Like
The product is successful when:
- a parent can set up quickly
- a child can complete a short diagnostic and daily session
- tasks feel game-like and solvable
- hints and explanations stay grounded and warm
- the parent sees clear evidence of reasoning progress
- the system can scale content safely through structured review
