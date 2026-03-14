# Evolution Event: move package into in folder

## Timestamp
2026-03-14T09:22:16+00:00

## Trigger
Requested correction to place the contractor package under `in/` instead of using a separate product-requirements folder.

## Change
Moved the contractor package into `in/`, including `README.md`, `detailed-product-description.md`, `deployment-and-acceptance.md`, `01-handoff/`, `02-product-docs/`, and `04-input-corpus/`. Reverted the temporary `03-product-requirements/` approach and updated the task records to reflect the final layout.

## Decision Link
- ADR:
- Task decision: [TASK-001-move-package-into-in-folder.md](../../docs/decisions/TASK-001-move-package-into-in-folder.md)

## Validation Evidence
- `find /workspace/in -maxdepth 2 -type f | sort`
- `rg -n "detailed-product-description\\.md|deployment-and-acceptance\\.md" /workspace/in`

## Outcome
Improved

## Follow-up
- Place future contractor package inputs under `in/` unless the packaging convention changes again.
