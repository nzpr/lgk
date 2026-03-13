# User Flows: Logic Learning MVP

## Scope
These flows cover the MVP described in [PRD](/workspace/docs/product/prd-logic-learning-mvp.md).

## Actors
- Parent
- Child
- System
- AI Service

## Flow 1: Parent Signup to First Session
### Goal
Get a parent and child into the first real learning session as fast as possible.

### Steps
1. Parent lands on marketing page.
2. Parent sees promise:
   - 10 minutes a day,
   - logic skills,
   - measurable progress.
3. Parent taps `Start`.
4. Parent creates account.
5. Parent sees trust and privacy explanation.
6. Parent enters child first name or nickname, age, and optional goals.
7. System creates child profile.
8. Parent is prompted to start diagnostic now.
9. Parent confirms.
10. Child session begins.

### Failure Paths
- Parent drops before account creation.
- Parent hesitates on privacy.
- Parent does not start diagnostic.

### Product Requirements
- Fast signup.
- Clear privacy language.
- Minimal fields.
- Resume flow if interrupted.

## Flow 2: Child First Session / Diagnostic
### Goal
Estimate starting level and prove immediate value.

### Steps
1. Child enters welcome screen.
2. System explains the session as a game, not a test.
3. System greets the child in a warm, calm, personal tone.
4. Child answers 8-12 diagnostic tasks.
5. System varies task types to estimate multiple subskills.
6. Child receives encouragement and lightweight rewards.
7. System computes initial learner profile.
8. Parent receives summary:
   - strong areas,
   - needs work,
   - recommended first path.

### Failure Paths
- Child exits midway.
- Child gets frustrated from too many misses.
- Diagnostic is too long.

### Product Requirements
- Dynamic difficulty.
- Early easy win.
- Session length cap.
- Mid-session progress indicator.
- The first session must feel welcoming and low-pressure.
- The child should leave feeling noticed, not measured.

## Flow 3: Daily Session
### Goal
Drive repeat use through short, adaptive daily sessions.

### Steps
1. Child opens app.
2. System surfaces the daily session with continuity from the previous session.
3. Child starts session.
4. System selects 5-7 tasks based on learner state.
5. Child solves task.
6. If wrong, system offers:
   - try again,
   - hint 1,
   - hint 2,
   - final explanation.
7. System updates mastery estimate after each task.
8. Session ends with:
   - short progress feedback,
   - feeling of completion,
   - clear return path for tomorrow.

### Failure Paths
- Too many repeated task types.
- Explanation too long.
- Child churns after a hard streak.

### Product Requirements
- Variety guardrails.
- Adaptive remediation.
- Fast response time.
- Return moments should reinforce warmth, continuity, and attachment.

## Flow 4: Child Gets Stuck
### Goal
Recover a child without shame or random guessing.

### Steps
1. Child answers incorrectly.
2. System offers retry with lightweight encouragement.
3. Child requests hint.
4. AI Service returns constrained hint based on approved content.
5. Child tries again.
6. If still wrong, system gives deeper hint.
7. If still wrong, system shows final explanation with visual breakdown.
8. System marks skill as needing reinforcement.
9. Future sessions include adjacent easier tasks.

### Product Requirements
- Hints must be incremental.
- Explanation must use age-appropriate language.
- No blame framing.
- No generic motivational filler.
- Help must feel patient and personal, not templated.

## Flow 5: Parent Progress Review
### Goal
Translate child activity into parent-perceived value.

### Steps
1. Weekly digest is generated.
2. Parent opens dashboard.
3. System shows:
   - recent sessions completed,
   - strongest skill,
   - current struggle area,
   - recommended focus area.
4. Parent reads one concrete example:
   - "improved at pattern extension,"
   - "still struggles with if/then reasoning."
5. Parent sees recommendation for next week.

### Product Requirements
- Parent language must be concrete.
- Dashboard must show progress by skill, not abstract XP alone.
- Summaries should be brief and actionable.
- Parent should feel the product understands their specific child.

## Flow 6: Content Authoring and Approval
### Goal
Move source material into production safely.

### Steps
1. Source text is parsed and normalized.
2. Content editor creates task object or explanation object.
3. Metadata is attached:
   - skill,
   - age band,
   - difficulty,
   - source trace.
4. AI may generate variants in a constrained schema.
5. Human reviewer approves or rejects.
6. Approved object enters canonical store.
7. Object becomes retrievable by runtime systems.

### Product Requirements
- Human review gate for launch content.
- Source traceability.
- Reject path for bad generations.
- Review must include emotional-quality checks, not only correctness.

## Flow 7: Bad Output Handling
### Goal
Keep quality and safety high after launch.

### Steps
1. Parent or internal QA flags a bad task or explanation.
2. System logs source content, retrieval context, prompt version, and output.
3. Team reviews incident.
4. Item is:
   - disabled,
   - fixed,
   - retrained,
   - or blocked by rule.
5. Regression test is added.

### Product Requirements
- Full audit log.
- Content takedown path.
- Eval suite grows from production incidents.

## Summary of Critical Loops
### Activation Loop
Landing page -> parent signup -> child diagnostic -> first success moment

### Retention Loop
Daily session -> useful struggle -> clear explanation -> visible progress -> next session

### Parent Value Loop
Child activity -> concrete progress evidence -> parent trust

### Quality Loop
Production output -> flagging -> review -> eval update -> safer system
