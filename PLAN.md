# Idea Roulette v2: build plan

Ten features in five stages. Each stage ends with something visible working on the live site.
Run guide with copy-paste prompts: [HOW-TO-RUN.md](HOW-TO-RUN.md).

## Decisions (made 2026-09-26, do not re-litigate)

- **Identity: nickname, no login.** First submit under a nickname *claims* it: the server stores a hash of a random secret, the browser keeps the secret in localStorage and shows it once as a recovery code (paste it on another device to post as yourself). Nobody else can post under a claimed nickname.
- **Moderation: auto-publish + report.** Builds go live at once. Rate-limited, https links only. 3 reports from different reporters hide a build (and a nickname) until the owner looks. Owner unhides via a secret `ADMIN_TOKEN` endpoint.
- **Storage: Upstash Redis via the Vercel Marketplace**, free tier. No schema. Accessed only from Vercel Functions in `/api` (never from the browser).
- The site stays a Vite + TypeScript static site. Backend = `api/*.ts` Vercel Functions in the same project, Node runtime.
- Voting, spinning and browsing never need a nickname. Only submitting a build does.

## Stage 1: client-only fortune features

No backend. Ships four features.

1. **Stack filter.** Extend the idea format to `Title :: pitch :: tags`. Tags: `ai` (needs an LLM/API), `db` (needs accounts or stored data), `pay` (takes payments), `hw` (camera/mic/GPS/sensors). An idea with no tags is "no backend". Tag all 400 ideas by judgment. UI: a second chip row: *No backend · Uses AI · Takes payments · Uses device hardware*, combined with the category chips. If a filter combination leaves zero ideas, say so and refuse to spin (never spin into nothing). `scripts/check.ts` validates every tag is known and every category still has 5+ ideas in each filter.
2. **Jackpot mode.** A separate pool of 25 *legendary* ideas (bigger, cleverer, more ambitious) in `ideas.ts`. Each spin has a 1 in 40 chance (`crypto.getRandomValues`) to hit the jackpot: the rim bulbs go gold and chase, a JACKPOT banner, golden slip, triple confetti, a distinct jingle. Shareable as `#jackpot-<i>`. Stack filter does not apply to jackpots. Jackpot count kept in localStorage and shown in history with a 👑.
3. **Daily fortune.** One idea per UTC day, the same for everyone: `hash(YYYY-MM-DD)` picks category, idea and twist, deterministically (write it as a pure function in `src/daily.ts`, checked in `check.ts`: same date gives the same pick, 365 consecutive days give at least 300 distinct ideas). A "🗓️ Today's fortune" button above the wheel with a countdown to the next one. Link `#daily` always opens today's.
4. **Challenge a friend.** On the slip: "⚔️ Challenge a friend". Asks for your name (optional) and a deadline (24h / 48h / 1 week). Builds a link `#challenge-<ideaId>-<twist>-<deadlineHours>-<base64url name>`. The friend sees a sealed envelope screen: "*Name* challenges you to build this within 48 hours. Accept?" Opening it starts their countdown (stored in localStorage by challenge link) and reveals the cookie. Decline shows a chicken 🐔. All validation of the hash is strict (bad link → plain wheel, no crash).

**Verify:** `npm run check` and `npm run build` pass. In `$B`: each filter combination, a forced jackpot (add `?jackpot=1` dev knob, only when `import.meta.env.DEV`), `#daily` twice gives the same idea, a challenge link from a fresh page shows the envelope, accepting reveals it. Phone width 390 has no horizontal scroll. Push, then verify on the live alias.

## Stage 2: themes + downloadable fortune card

1. **Themes.** Four themes via CSS custom properties on `<html data-theme>`: *Monte Carlo* (current green felt, default), *Neon Vegas* (black, hot pink/cyan glow), *Lunar New Year* (red and gold, lanterns), *Retro Arcade* (dark purple, pixel font "Press Start 2P", scanlines). Each theme defines felt, gold, accent, fonts, and wheel slice palette (8 colors). Picker in the header, remembered in localStorage. Respect `prefers-reduced-motion` in every theme.
2. **Fortune card PNG.** "🖼️ Save card" on the slip draws the fortune with the Canvas 2D API (no html2canvas): 1200x630, themed, cookie art, category, title, pitch, twist, lucky numbers, site URL. Wait for `document.fonts.ready` before drawing, or the card uses fallback fonts. Wrap long text by measuring. On phones use `navigator.share({ files })` when `navigator.canShare` accepts the file, else download via an `<a download>`. Jackpot cards are gold.

**Verify:** screenshot every theme at 1280 and 390. Generate a card in each theme in `$B`, save the PNG, check its size with `ffprobe` (1200x630) and look at one downscaled. Longest title and longest pitch in the bank wrap without clipping.

## Stage 3: backend foundation + upvotes

Needs the owner's prep (see HOW-TO-RUN, Stage 3).

1. Provision Upstash Redis through the Marketplace on project `idea-roulette` (team Oriad), confirm `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (shipped as `KV_REST_API_URL` / `KV_REST_API_TOKEN`) exist for **Production and Preview** (`filter_project_envs`), `vercel env pull`.
2. `api/` functions with `@upstash/redis` + `@upstash/ratelimit`. One shared `api/_lib.ts`: Redis client, JSON response helper, input validation, rate limiter, idea-id validation against the real idea bank (import `src/ideas.ts` so ids cannot drift).
3. **Upvotes.** Each browser has a random voter id (localStorage). `POST /api/vote {ideaId, voterId}` toggles. Keys: `votes:<ideaId>` set of voter ids, `rank` zset ideaId → count. `GET /api/votes?ids=...` returns counts and whether you voted. Rate limit 60 votes / 10 min per IP. Slip shows ▲ count. A "🔥 Most wanted" tab lists the top 20 ideas.
4. Errors are explicit: the UI says "Votes are offline right now" when the API fails. Never shows 0 votes when it actually means "unknown".

**Verify:** local with `vercel dev`; vote, unvote, vote from a second profile; hammer the rate limit and see 429 handled. Deploy and repeat on production. Check envs exist in Production before calling it done.

## Stage 4: "I built it!" gallery, nicknames, reports

1. `POST /api/builds {ideaId, twist, url, title, nick, secret?}`. Validation: `url` must parse, be `https:`, max 300 chars, not localhost/IP; `title` 3 to 80 chars; `nick` `^[A-Za-z0-9_-]{3,20}$`. Nickname claim: `nick:<lower>` hash {nick, secretHash (SHA-256), createdAt}; unknown nick → create and return a new secret once; known nick → secret must match. Rate limit 5 builds / day per nick and 10 / day per IP. Duplicate URL for the same idea → rejected.
2. Keys: `build:<id>` hash, `builds:idea:<ideaId>` list, `builds:recent` list, `reports:<buildId>` set of reporter ids.
3. `POST /api/report {buildId, reporterId}`. 3 distinct reporters → `hidden=1` (and nickname gets `hidden=1` if 3 of its builds are hidden). `POST /api/admin/unhide` with `Authorization: Bearer ADMIN_TOKEN`.
4. UI: "🚀 I built it!" on the slip opens a form. Gallery section on each fortune (builds for this idea) and a "Recent builds" wall. Links open with `rel="noopener nofollow ugc"`. Recovery code screen after first claim, with copy button and a "paste recovery code" option.
5. Never render user text with `innerHTML`. `textContent` only.

**As built (2026-09-26):** a build hides at 3 distinct reporter ids AND 3 distinct IPs (stored hashed in `reportips:<buildId>`), because reporter ids are forgeable. Unhiding a build marks it `approved=1`, so reports cannot hide it again. Unhide takes `{buildId}` or `{nick}`. Recovery code = `Nick.secret`. Extra key: `urls:<ideaId>` set for the duplicate check. The Redis client runs with `automaticDeserialization: false`, so `HGETALL` returns a flat array: read hashes through `toHash()` in `api/_lib.ts`. Check: `node --env-file=.env --use-system-ca scripts/verify-builds.ts http://localhost:5207 --local` (vercel dev needs a `.env` holding the KV vars plus a throwaway ADMIN_TOKEN, because a `.env` replaces its pulled vars).

**Verify:** every validation rule rejected with a clear message (script with bad inputs against `vercel dev`); claim a nick, try to post as it from another profile without the secret → refused; recovery code on the other profile → allowed; 3 reports hide it; admin unhide works. Hostile input: a 1 MB title and a script tag are rejected, not rendered.

## Stage 5: leaderboard + streaks + launch check

1. Every accepted build also does `ZINCRBY lb:all 1 nick` and `lb:<YYYY-MM>`; hidden builds decrement. `GET /api/leaderboard?period=month|all` top 25 (hidden nicks excluded).
2. **Streaks**: a week counts if the builder submitted at least one build in that ISO week. `weeks:<nick>` set of `YYYY-Www`. Current streak = consecutive weeks ending this week or last week (so it does not break until a full week is missed). Longest streak stored. Shown on the leaderboard and on the builder's own badge (🔥 3 weeks).
3. Builder page `#builder-<nick>`: their builds, streak, total.
4. Launch check: `get_project` ssoProtection is `preview`, envs present in Production, fetch the alias logged-out from a sandbox on someone else's network, full flow on the live site at 390 and 1280, update README + FEATURES.md (move shipped items).

**As built (2026-09-26):** leaderboard members are lower-case nicks (display case comes from `nick:<lower>`). `weeks:<nick>` is a HASH of ISO week -> visible build count, not a set, so a build hidden by reports takes its week back (a week counts while its count is > 0). Longest streak is derived from that hash on read, not stored separately, so it can never disagree with it. Extra key: `builds:nick:<lower>` list for the builder page. All writes live in the same Lua scripts as before (post, hide, unhide), so counts move atomically with the build. Streak math is `src/streak.ts` (UTC ISO weeks). `GET /api/builder?nick=` backs `#builder-<nick>`; a post answers with the current `streak`. `scripts/verify-builds.ts` covers the leaderboard, builder page and week counts through post, hide, unhide and nick hide.

**Verify:** streak math is a pure function with a check (weeks spanning a year boundary, week 53, gap of one week breaks it, current week not yet built keeps it). Live flow end to end.
