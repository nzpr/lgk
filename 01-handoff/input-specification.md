# Input Specification

## 1. Source Corpus
Primary research corpus:
- 18 logic books included in `../04-input-corpus/logika`
- supporting manifests in this package:
  - `../04-input-corpus/manifest.json`
  - `../04-input-corpus/manifest.tsv`

These files are useful input for content extraction, concept mapping, and provenance.
They are not by themselves a complete product specification.

## 2. Structured Product Knowledge Already Produced
The package already defines:
- the target users
- the learning scope
- the game framing
- the session loop
- the parent value layer
- the content and traceability expectations

This means the contractor is not starting from raw books.
They are starting from books plus a fixed product direction.

## 3. Product Inputs
These files define the intended product:
- [Detailed Product Description](../detailed-product-description.md)
- [PRD](../02-product-docs/prd-logic-learning-mvp.md)
- [User Flows](../02-product-docs/user-flows-logic-learning.md)
- [Game Direction](../02-product-docs/game-direction-age-10.md)
- [Game Systems](../02-product-docs/game-systems-age-10.md)

## 4. Output The Contractor Must Preserve
Even with a fresh implementation, these outputs should still exist conceptually:
- child-safe parent-managed account model
- diagnostic and daily-session flows
- adaptive skill progression
- canonical reviewed task objects
- grounded hints and explanations
- source traceability from task/explanation back to approved sources
- parent-facing progress summaries
- analytics and QA hooks
- warm age-appropriate game framing

## 5. Remaining Client Inputs
The contractor will still need explicit client decisions on:
- what data privacy model and jurisdictional compliance scope apply at launch
- whether the first build is strictly web-first or must also ship in native wrappers
- whether current narrative/theme direction is fixed or still exploratory

## 6. Recommended Input Hierarchy
If there is any conflict, use this order:
1. user/client direction given after this handoff
2. detailed product description
3. PRD and user flows
4. product docs and corpus manifests

## 7. Minimum Honest Statement To A Contractor
The correct brief is:
"Rebuild a mobile-first, child-safe, logic-learning product using the attached corpus, product description, and product docs."

The incorrect brief is:
"Build something from these books."
