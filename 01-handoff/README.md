# Contractor CEO Reimplementation Handoff

## Purpose
This folder is the clean handoff package for rebuilding the current project from scratch with an external contractor.

The product is not just "a corpus of books."
The real project is a child-safe logic-learning product with:
- a defined buyer and user model,
- a specific age band,
- a fixed product loop,
- a content system,
- a grounded explanation system,
- and a game/world wrapper.

## Straight Answer: What Is The Input?
The minimum input set for a real reimplementation is:
- source corpus files, manifests, and provenance records
- approved skill taxonomy: classification, patterns, if/then, contradiction, deduction
- product requirements and user flows in `../02-product-docs`
- age-10 narrative and game system direction for `Sky of Many Lanterns`
- content schemas, review workflow, hint/explanation expectations, and source-trace rules described in this package
- child-safety, privacy, and web-first platform constraints described in the attached product materials

Books alone are insufficient.
Without the product constraints and structured content contracts, a contractor would rebuild the wrong thing.

## What Is In This Folder?
- [Detailed Goal](./detailed-goal.md): the contractor-facing statement of work and success definition
- [Input Specification](./input-specification.md): the concrete inputs and dependencies needed for a rebuild
- [Knowledge Inventory](./knowledge-inventory.md): the map of the product materials included in this package

## Current Product Baseline
The product baseline in this package includes:
- a defined parent and child user model
- a fixed learning scope
- a fixed daily session loop
- a defined game/world wrapper
- parent-facing progress expectations
- corpus and provenance notes

The contractor should treat this package as:
- product truth for scope and behavior
- the basis for a new implementation plan
- not a prompt to improvise a different product from the books
