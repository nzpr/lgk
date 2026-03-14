# Decision: move package into in folder

## Task
TASK-001

## Date
2026-03-14

## Context
The contractor package content was spread across the repository root (`README.md`, `detailed-product-description.md`, `deployment-and-acceptance.md`) and the numbered content folders (`01-handoff`, `02-product-docs`, `04-input-corpus`). The corrected requirement was to put that package material under a single `in/` folder.

## Options Considered
- Keep the handoff package split across the repository root and the numbered content folders.
- Move the full contractor package into a single `in/` directory and keep repository infrastructure at the root.

## Decision
Create `in/` and move the contractor package files into it: `README.md`, `detailed-product-description.md`, `deployment-and-acceptance.md`, `01-handoff/`, `02-product-docs/`, and `04-input-corpus/`. Keep repository management files such as `AGENTS.md`, `docs/`, `evolution/`, `scripts/`, and `skill/` at the repository root.

## Reasoning
`in/` creates one obvious entry point for the actual product-input package while leaving audit and agent-support infrastructure untouched at the repository root. This matches the user's correction more directly than introducing a new numbered section and keeps the existing relative links inside the package simple.

## Consequences
Consumers should now start from `in/` when looking for the contractor package. Any references that assumed the package lived at repository root need to point to the new `in/` location, but links inside the package remain straightforward because the package files moved together.

## Scope
Task-specific

## Links
- Related ADR:
- Related evolution event: [20260314-092216-move-package-into-in-folder.md](../../evolution/events/20260314-092216-move-package-into-in-folder.md)
- Evidence (files/tests): `in/README.md`, `in/01-handoff/input-specification.md`, `in/01-handoff/knowledge-inventory.md`, `find /workspace/in -maxdepth 2 -type f | sort`
