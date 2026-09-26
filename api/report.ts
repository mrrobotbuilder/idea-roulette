import { BUILD_ID, ipOf, json, readJson, redis, reportLimit, sha256, validVoter } from "./_lib.ts";

// Reporter ids live in the reporter's own browser, so one person could forge three. A build
// hides only once 3 different ids AND 3 different IPs (stored hashed) have reported it.
// A build the owner has reviewed (approved=1) cannot be hidden by reports again.
// 3 hidden builds hide the nickname too. Returns -1 missing, 0 ignored, 1 counted, 2 now hidden.
const report = redis.createScript<number>(`
if redis.call("EXISTS", KEYS[1]) == 0 then return -1 end
if redis.call("HGET", KEYS[1], "approved") == "1" then return 0 end
redis.call("SADD", KEYS[2], ARGV[1])
redis.call("SADD", KEYS[3], ARGV[2])
if redis.call("HGET", KEYS[1], "hidden") == "1" then return 1 end
if redis.call("SCARD", KEYS[2]) >= 3 and redis.call("SCARD", KEYS[3]) >= 3 then
  redis.call("HSET", KEYS[1], "hidden", "1")
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

  const nick = await redis.hget<string>(`build:${buildId}`, "nick");
  if (!nick) return json({ error: "Unknown build." }, 404);
  const r = await report.exec(
    [`build:${buildId}`, `reports:${buildId}`, `reportips:${buildId}`, `nick:${nick.toLowerCase()}`],
    [reporterId, await sha256(`report-ip:${ip}`)],
  );
  if (r === -1) return json({ error: "Unknown build." }, 404);
  return json({ hidden: r === 2 });
}
