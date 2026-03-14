# Sky Of Many Lanterns: Echo Trail

Browser-playable Godot adventure game built to teach kids logic through play.

The product goal is not generic edutainment. It uses game structure, route pressure, shrine choices, and world discovery to make logic practice feel like an adventure instead of a worksheet.

The design and content direction also draw on the strong logic books in the project input corpus, so the game is grounded in real logic material rather than shallow puzzle flavor.

## Live Game
- Live game: `https://nzpr.github.io/lgk/`
- Demo state: `https://nzpr.github.io/lgk/?demo=1`

## Read First
- [How To Play](./docs/distribution/how-to-play.md)
- [Distribution Docs](./docs/distribution/README.md)
- [Launch And Support](./docs/distribution/launch-and-support.md)

## Local Run
```bash
npm install
npm run godot:check
npm run godot:export:web
npm run godot:verify:web
```

## What This Repo Ships
- Godot browser game project: [`godot/echo_trail`](./godot/echo_trail)
- Godot toolchain/export scripts: [`scripts/godot`](./scripts/godot)
- Product inputs and logic-book corpus: [`in`](./in)
- Distribution and player docs: [`docs/distribution`](./docs/distribution)
