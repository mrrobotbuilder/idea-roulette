# 🥠 Idea Roulette

Out of ideas? Spin the casino wheel, crack the fortune cookie, and build what the paper says.
400 ideas across 8 categories, 40 twists, free forever. Built for vibe coders.

## Run it

```
npm install
npm run dev
```

- `npm run check`: verifies the wheel always lands on the picked slice and validates the idea bank (format, no duplicates, 50+ per category).
- `npm run build`: type-checks and builds to `dist/`.

## Add ideas

Open `src/ideas.ts` and add a line `Title :: pitch` to any category block. Run `npm run check`.

## Roadmap

See [FEATURES.md](FEATURES.md).

Static site: Vite + TypeScript, no backend, no tracking.
