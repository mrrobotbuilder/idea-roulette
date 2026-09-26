import { ipOf, json, readJson, redis, validId, validVoter, voteLimit } from "./_lib.ts";

// Sets (not toggles) the vote, so a retried request cannot flip it back. The rank is
// written from the set's real size in the same atomic script, so it can never drift.
const setVote = redis.createScript<[number, number]>(`
if ARGV[3] == "1" then redis.call("SADD", KEYS[1], ARGV[1]) else redis.call("SREM", KEYS[1], ARGV[1]) end
local n = redis.call("SCARD", KEYS[1])
if n == 0 then redis.call("ZREM", KEYS[2], ARGV[2]) else redis.call("ZADD", KEYS[2], n, ARGV[2]) end
return {redis.call("SISMEMBER", KEYS[1], ARGV[1]), n}
`);

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return json({ error: "Send a JSON body." }, 400);
  const { ideaId, voterId, up } = body;
  if (!validId(ideaId)) return json({ error: "Unknown idea." }, 400);
  if (!validVoter(voterId)) return json({ error: "Bad voter id." }, 400);
  if (typeof up !== "boolean") return json({ error: "up must be true or false." }, 400);

  const { success, reset } = await voteLimit.limit(ipOf(req));
  if (!success) return json({ error: "Too many votes. Try again in a few minutes.", retryAt: reset }, 429);

  const [mine, count] = await setVote.exec([`votes:${ideaId}`, "rank"], [voterId, ideaId, up ? "1" : "0"]);
  return json({ ideaId, count, voted: mine === 1 });
}
