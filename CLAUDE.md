# TIGER (IntervalTiger) — instructions for Claude

Barak's personal karate interval-timer PWA, served by GitHub Pages from `main`.

- Claude may edit, commit and push straight to `main` without asking — Barak approved this.
- Files: `index.html` (the whole app, single file) and `service-worker.js`.
- **Every change bumps the version**: `CACHE_NAME = 'tiger-cache-vNNN'` in `service-worker.js`, otherwise the installed app on his phone won't update. Tag the changed lines with a `// vNNN:` comment.
- Audio: all sounds go through `masterMakeup` (gain from `volGain()`) → limiter → soft ceiling. Built-in beeps also pass `synthBus`. Sounds must stay as loud as possible (he trains with music on the phone).
- Runs on his Android phone as an installed app. UI is in Hebrew.
- Commit message: `vNNN: <short description>`.
