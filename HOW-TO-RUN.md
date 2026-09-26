# How to run the v2 build

Plan: [PLAN.md](PLAN.md). One stage per session. Start each session in `C:\Users\User\Projects\idearoulette`, paste the prompt, and wait for the stop condition.

## One-time setup (already done)

The repo is at github.com/mrrobotbuilder/idea-roulette, and Vercel project `idea-roulette` (team Oriad) deploys every push to `main`. Live: https://idea-roulette-zeta.vercel.app

---

## Session 1: Stage 1 (stack filter, jackpot, daily fortune, challenge a friend)

You prepare: nothing.

Prompt:

```
Read PLAN.md and do Stage 1 only: stack filter (tag all 400 ideas), jackpot mode, daily fortune, and challenge a friend. Follow its Verify section, then commit, push, and verify on the live alias. Stop after Stage 1.
```

Stop condition: the summary says Stage 1 is live, and you can see "🗓️ Today's fortune" and the stack filter chips on the live site.

---

## Session 2: Stage 2 (themes + fortune card PNG)

You prepare: nothing.

Prompt:

```
Read PLAN.md and do Stage 2 only: the four themes and the downloadable fortune card. Follow its Verify section, then commit, push, and verify on the live alias. Stop after Stage 2.
```

Stop condition: a theme picker on the live site, and "🖼️ Save card" downloads a 1200x630 PNG.

---

## Session 3: Stage 3 (backend + upvotes)

You prepare first, in PowerShell, one line at a time:

1. Run: `npm i -g vercel`
2. Run: `vercel login` (a browser opens; sign in to the account that owns team Oriad)
3. Run: `cd C:\Users\User\Projects\idearoulette`
4. Run: `vercel link --yes --project idea-roulette --scope oriad`

If the session later says Upstash needs you to accept terms in the browser, click through and tell it "done".

Prompt:

```
Read PLAN.md and do Stage 3 only: provision Upstash Redis through the Vercel Marketplace, add the /api functions, and ship upvotes. The Vercel CLI is installed and this folder is linked. Follow its Verify section, including checking the env vars exist in Production. Stop after Stage 3.
```

Stop condition: ▲ vote counts show on fortunes on the live site, and a "🔥 Most wanted" list exists.

---

## Session 4: Stage 4 (gallery, nicknames, reports)

You prepare first, in PowerShell:

1. Run: `vercel env add ADMIN_TOKEN production` and at the prompt type a long random password you will keep (it is your key for unhiding reported builds). Nothing is echoed into a command line.
2. Run: `vercel env add ADMIN_TOKEN preview` and type the same value.

Prompt:

```
Read PLAN.md and do Stage 4 only: the "I built it!" gallery with nickname claiming, recovery codes, and reports. ADMIN_TOKEN is set in Production and Preview. Follow its Verify section, including the hostile-input and impersonation checks. Stop after Stage 4.
```

Stop condition: you can submit a build link on the live site under a nickname, see it in the gallery, and see your recovery code once.

---

## Session 5: Stage 5 (leaderboard, streaks, launch check)

You prepare: nothing.

Prompt:

```
Read PLAN.md and do Stage 5 only: the builder leaderboard, weekly streaks, builder pages, and the launch check. Follow its Verify section, then update README.md and FEATURES.md. Stop after Stage 5.
```

Stop condition: a leaderboard with your nickname and a 🔥 streak on the live site, and the launch check reported clean.
