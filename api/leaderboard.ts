import { monthOf, streaks } from "../src/streak.ts";
import { json, redis, toHash } from "./_lib.ts";

export type Leader = { nick: string; builds: number; streak: number; longest: number };

// GET /api/leaderboard?period=month|all -> the top 25 builders, hidden nicknames left out.
export async function GET(req: Request) {
  const period = new URL(req.url).searchParams.get("period") ?? "month";
  if (period !== "month" && period !== "all") return json({ error: "period must be month or all." }, 400);
  const now = Date.now();
  const month = monthOf(now);
  // Read past the top 25 so a few hidden nicknames cannot leave the board short.
  const flat = await redis.zrange<(string | number)[]>(period === "all" ? "lb:all" : `lb:${month}`, 0, 59, { rev: true, withScores: true });
  const rows: { lower: string; builds: number }[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) if (Number(flat[i + 1]) > 0) rows.push({ lower: String(flat[i]), builds: Number(flat[i + 1]) });
  if (rows.length === 0) return json({ period, month, leaders: [] });

  const p = redis.pipeline();
  for (const r of rows) p.hgetall(`nick:${r.lower}`), p.hgetall(`weeks:${r.lower}`);
  const res = (await p.exec()) as unknown[];
  const leaders: Leader[] = [];
  rows.forEach((r, i) => {
    const owner = toHash(res[2 * i]);
    if (!owner?.nick || owner.hidden === "1") return;
    const weeks = toHash(res[2 * i + 1]) ?? {};
    const s = streaks(Object.keys(weeks).filter((w) => Number(weeks[w]) > 0), now);
    leaders.push({ nick: owner.nick, builds: r.builds, streak: s.current, longest: s.longest });
  });
  return json({ period, month, leaders: leaders.slice(0, 25) });
}
