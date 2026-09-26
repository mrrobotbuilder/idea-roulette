import { isoWeek, monthOf } from "../src/streak.ts";
import { BUILD_ID, ipOf, json, readJson, redis, reportLimit, sha256, validVoter } from "./_lib.ts";

// Reporter ids live in the reporter's own browser, so one person could forge three. A build
// hides only once 3 different ids AND 3 different IPs (stored hashed) have reported it.
// A build the owner has reviewed (approved=1) cannot be hidden by reports again.
// 3 hidden builds hide the nickname too. Hiding takes the build off the leaderboards and out of its week. Returns -1 missing, 0 ignored, 1 counted, 2 now hidden.
const report = redis.createScript<number>(`
if redis.call("EXISTS", KEYS[1]) == 0 then return -1 end
if redis.call("HGET", KEYS[1], "approved") == "1" then return 0 end
redis.call("SADD", KEYS[2], ARGV[1])
redis.call("SADD", KEYS[3], ARGV[2])
if redis.call("HGET", KEYS[1], "hidden") == "1" then return 1 end
if redis.call("SCARD", KEYS[2]) >= 3 and redis.call("SCARD", KEYS[3]) >= 3 then
  redis.call("HSET", KEYS[1], "hidden", "1")
  redis.call("ZINCRBY", KEYS[5], -1, ARGV[3])
  redis.call("ZINCRBY", KEYS[6], -1, ARGV[3])
  redis.call("HINCRBY", KEYS[7], ARGV[4], -1)
  if redis.call("HINCRBY", KEYS[4], "hiddenBuilds", 1) >= 3 then redis.call("HSET", KEYS[4], "hidden", "1") end
  return 2
end
return 1
`);

// POST /api/report {buildId, reporterId} -> {hidden}
export async function POST(req: Request) {
  const body = await readJson(req);
  if (typeof body === "string") return json({ error: body }, 400);
  const { buildId, reporterId } = body;
  if (typeof buildId !== "string" || !BUILD_ID.test(buildId)) return json({ error: "Unknown build." }, 400);
  if (!validVoter(reporterId)) return json({ error: "Bad reporter id." }, 400);

  const ip = ipOf(req);
  const { success } = await reportLimit.limit(ip);
  if (!success) return json({ error: "Too many reports from here today." }, 429);

  const [nick, createdAt] = ((await redis.hmget(`build:${buildId}`, "nick", "createdAt")) as unknown as (string | null)[] | null) ?? [];
  if (!nick || !createdAt) return json({ error: "Unknown build." }, 404);
  const lower = nick.toLowerCase();
  const at = Number(createdAt);
  const r = await report.exec(
    [`build:${buildId}`, `reports:${buildId}`, `reportips:${buildId}`, `nick:${lower}`, "lb:all", `lb:${monthOf(at)}`, `weeks:${lower}`],
    [reporterId, await sha256(`report-ip:${ip}`), lower, isoWeek(at)],
  );
  if (r === -1) return json({ error: "Unknown build." }, 404);
  return json({ hidden: r === 2 });
}
