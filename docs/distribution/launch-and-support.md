# Launch And Support: Sky Of Many Lanterns

## Purpose
Distribute the game in a way that minimizes player friction, makes the parent value clear fast, and gives a tiny team a sane operating loop after launch.

## Live Entry Points
- Production site: `https://nzpr.github.io/lgk/`
- Instant-play demo: `https://nzpr.github.io/lgk/?demo=1`
- GitHub repo: `https://github.com/nzpr/lgk`
- Player guide: [how-to-play.md](./how-to-play.md)

## First Distribution Pass
- Share the demo URL anywhere the goal is immediate play with no explanation.
- Share the production URL anywhere the goal is parent evaluation and real setup.
- Link the repo only for technical reviewers, partners, or contributors.

## What To Put In Front Of People
- One-line hook: `A calm logic adventure for ages 8-10 with grounded help and visible parent progress.`
- Short pitch: `Sky of Many Lanterns turns short daily reasoning practice into a warm expedition game. Children solve calm logic missions, and parents get concrete progress instead of vague gamified fluff.`
- Primary CTA: `Play the demo instantly`
- Secondary CTA: `Set up a household`

## Distribution Plan
### Parent-facing channels
- Product Hunt style launch posts
- parenting communities that allow educational-tool recommendations
- direct outreach to homeschooling and after-school coordinators
- short demo clips on X, LinkedIn, and indie-dev feeds aimed at adult buyers

### Child-facing promise
- no signup wall before first feel
- no worksheet framing
- no open chat
- short sessions and immediate world feedback

## Screenshot And Clip List
- Landing hero with lantern cluster and instant-play button
- Camp scene with journal card and route map
- Live task view with grounded hints
- Parent dashboard with strongest skill and current struggle
- QA / ops view showing source traceability and flagged output queue

## Release How-To
1. Merge only after `Validate Product` passes.
2. Confirm the GitHub Pages deploy run on `main` succeeds.
3. Check the production URL and the `?demo=1` URL on mobile.
4. Push an annotated tag such as `v1.0.1` for a packaged release artifact.
5. Publish the short pitch, screenshots, and demo link together.

## Support Loop
- Intake bug reports through GitHub issues.
- Treat anything blocking onboarding, demo launch, or daily session completion as same-day priority.
- Treat hint/explanation quality regressions as high priority because trust is part of the product.
- Re-check the production URL after every deploy.

## Tiny-Team Operating Split
- Product owner: launch copy, channel selection, feedback triage
- Game designer: moment-to-moment friction review, progression tuning
- Story writer: copy passes for landing, onboarding, and mission tone
- Senior full-stack developer: deploys, bug fixes, analytics, release tags
- Player advocate / gamer critic: dogfooding, clip capture, friction notes
