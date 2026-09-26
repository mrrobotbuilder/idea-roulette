# 🥠 Idea Roulette

Out of ideas? Spin the casino wheel, crack the fortune cookie, and build what the paper says.
450+ ideas across 8 categories (filterable by what they need: no backend, AI, payments, device hardware), 25 legendary jackpots, 40 twists, a daily fortune everyone shares, and challenge links for friends. Free forever. Built for vibe coders.

## Run it

```
npm install
npm run dev
```

- `npm run check`: verifies the wheel always lands on the picked slice and validates the idea bank (format, tags, no duplicates, 50+ per category, 5+ per category in every stack filter), the daily pick and link parsing.
- `npm run build`: type-checks and builds to `dist/`.

## Add ideas

Open `src/ideas.ts` and append a line `Title :: pitch` (or `Title :: pitch :: ai db pay hw`, any of the four tags) to the END of a category block, since ids are indexes and shared links depend on them. Run `npm run check`.

## Roadmap

See [FEATURES.md](FEATURES.md).

Static site: Vite + TypeScript, no backend, no tracking.
