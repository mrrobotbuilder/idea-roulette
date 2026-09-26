# 🥠 Idea Roulette

Out of ideas? Spin the casino wheel, crack the fortune cookie, and build what the paper says.
450+ ideas across 8 categories (filterable by what they need: no backend, AI, payments, device hardware), 25 legendary jackpots, 40 twists, a daily fortune everyone shares, challenge links for friends, four themes and a downloadable fortune card.

Then ship it: upvote the ideas you want built, post what you built under a nickname (no login), and climb the builder leaderboard with a weekly 🔥 streak. Free forever. Built for vibe coders.

Live: https://idea-roulette-zeta.vercel.app

## Run it

```
npm install
npm run dev
```

`npm run dev` serves the static site only. For the backend (votes, builds, leaderboard) use `vercel dev`, which needs a `.env` holding the `KV_REST_API_*` vars (and a throwaway local `ADMIN_TOKEN`). It talks to the one live Redis store, so undo every test write.

- `npm run check`: verifies the wheel always lands on the picked slice and validates the idea bank (format, tags, no duplicates, 50+ per category, 5+ per category in every stack filter), the daily pick, link parsing and the streak math (ISO weeks, year boundaries, week 53).
- `npm run build`: type-checks and builds to `dist/`.
- `node --env-file=.env --use-system-ca scripts/verify-builds.ts <base url> [--local]`: end-to-end check of builds, nicknames, reports, the leaderboard and streaks against a running server. It cleans up after itself.

## Add ideas

Open `src/ideas.ts` and append a line `Title :: pitch` (or `Title :: pitch :: ai db pay hw`, any of the four tags) to the END of a category block, since ids are indexes and shared links, votes and builds depend on them. Run `npm run check`.

## How it is built

Vite + TypeScript static site, with Vercel Functions in `api/` and Upstash Redis (Vercel Marketplace) behind them. The browser never talks to Redis. No accounts, no tracking. Plan and decisions: [PLAN.md](PLAN.md).

## Roadmap

See [FEATURES.md](FEATURES.md).
