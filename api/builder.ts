import { monthOf, streaks } from "../src/streak.ts";
import { NICK, json, readBuilds, redis, toHash, weeksOf } from "./_lib.ts";

// GET /api/builder?nick=<nick> -> {nick, total, month, streak, longest, builds}
export async function GET(req: Request) {
  const nick = new URL(req.url).searchParams.get("nick") ?? "";
  if (!NICK.test(nick)) return json({ error: "Nicknames are 3 to 20 letters, digits, _ or -." }, 400);
  const lower = nick.toLowerCase();
  const owner = toHash(await redis.hgetall(`nick:${lower}`));
  if (!owner?.nick) return json({ error: "No builder goes by that name yet." }, 404);
  if (owner.hidden === "1") return json({ error: "This builder is under review after reports." }, 404);

  const now = Date.now();
  const [ids, total, month, weeks] = await Promise.all([
    redis.lrange(`builds:nick:${lower}`, 0, 59),
    redis.zscore("lb:all", lower),
    redis.zscore(`lb:${monthOf(now)}`, lower),
    weeksOf(lower),
  ]);
  const builds = await readBuilds(ids);
  const s = streaks(weeks, now);
  return json({
    nick: owner.nick,
    total: Math.max(0, Number(total ?? 0)),
    month: Math.max(0, Number(month ?? 0)),
    streak: s.current,
    longest: s.longest,
    builds: builds.slice(0, 30),
  });
}
