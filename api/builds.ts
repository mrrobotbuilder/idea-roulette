import { randomBytes } from "node:crypto";
import { TWISTS } from "../src/ideas.ts";
import { BUILD_ID, NICK, SECRET, buildIpLimit, buildNickLimit, checkTitle, checkUrl, ipOf, json, readJson, redis, sha256, toHash, validId } from "./_lib.ts";

export type Build = { id: string; ideaId: string; twist: number | null; url: string; title: string; nick: string; createdAt: number };

// Claim-or-verify the nickname, refuse a duplicate link, and write the build, all in one step.
// Returns 1 if this call claimed the nickname, 0 if it already was ours, or a negative refusal.
const postBuild = redis.createScript<number>(`
local h = redis.call("HGET", KEYS[1], "secretHash")
if h and h ~= ARGV[1] then return -1 end
if redis.call("HGET", KEYS[1], "hidden") == "1" then return -2 end
if redis.call("SISMEMBER", KEYS[2], ARGV[4]) == 1 then return -3 end
local created = 0
if not h then
  redis.call("HSET", KEYS[1], "nick", ARGV[2], "secretHash", ARGV[1], "createdAt", ARGV[3], "hidden", "0", "hiddenBuilds", "0")
  created = 1
end
local nick = redis.call("HGET", KEYS[1], "nick")
redis.call("SADD", KEYS[2], ARGV[4])
redis.call("HSET", KEYS[3], "id", ARGV[5], "ideaId", ARGV[6], "twist", ARGV[7], "url", ARGV[4], "title", ARGV[8], "nick", nick, "createdAt", ARGV[3], "hidden", "0")
redis.call("LPUSH", KEYS[4], ARGV[5])
redis.call("LPUSH", KEYS[5], ARGV[5])
redis.call("LTRIM", KEYS[5], 0, 199)
return created
`);

const TAKEN = "That nickname is taken. If it is yours, paste your recovery code.";
const DUP = "That link is already in the gallery for this idea.";
const REVIEW = "This nickname is under review after reports. Try again later.";

// POST /api/builds {ideaId, twist, url, title, nick, secret?} -> 201 {build, secret?}
export async function POST(req: Request) {
  const body = await readJson(req);
  if (typeof body === "string") return json({ error: body }, 400);
  const { ideaId, url, title, nick, secret } = body;
  const twist = body.twist ?? null;
  if (!validId(ideaId)) return json({ error: "Unknown idea." }, 400);
  if (twist !== null && !(Number.isInteger(twist) && (twist as number) >= 0 && (twist as number) < TWISTS.length))
    return json({ error: "Unknown twist." }, 400);
  const bad = checkUrl(url) || checkTitle(title);
  if (bad) return json({ error: bad }, 400);
  if (typeof nick !== "string" || !NICK.test(nick)) return json({ error: "Nicknames are 3 to 20 letters, digits, _ or -." }, 400);
  if (secret != null && (typeof secret !== "string" || !SECRET.test(secret))) return json({ error: "That recovery code is not valid." }, 400);

  // Refuse impostors before touching the rate limits, so nobody can burn a nickname's daily quota.
  const lower = nick.toLowerCase();
  const owner = toHash(await redis.hgetall(`nick:${lower}`));
  const mine = typeof secret === "string" ? secret : randomBytes(32).toString("base64url");
  const hash = await sha256(mine);
  if (owner?.secretHash) {
    if (owner.hidden === "1") return json({ error: REVIEW }, 403);
    if (hash !== owner.secretHash) return json({ error: TAKEN }, 403);
  }
  const href = new URL((url as string).trim()).href;
  if (await redis.sismember(`urls:${ideaId}`, href)) return json({ error: DUP }, 409);

  const ip = await buildIpLimit.limit(ipOf(req));
  if (!ip.success) return json({ error: "Too many builds from here today. Try again tomorrow.", retryAt: ip.reset }, 429);
  const nk = await buildNickLimit.limit(lower);
  if (!nk.success) return json({ error: "That nickname has posted 5 builds today. Try again tomorrow.", retryAt: nk.reset }, 429);

  const id = randomBytes(6).toString("hex");
  const now = Date.now();
  const r = await postBuild.exec(
    [`nick:${lower}`, `urls:${ideaId}`, `build:${id}`, `builds:idea:${ideaId}`, "builds:recent"],
    [hash, nick, String(now), href, id, ideaId as string, twist === null ? "" : String(twist), (title as string).trim()],
  );
  if (r === -1) return json({ error: TAKEN }, 403);
  if (r === -2) return json({ error: REVIEW }, 403);
  if (r === -3) return json({ error: DUP }, 409);
  const [stored] = await readBuilds([id]);
  // The secret goes back only when the server made it: it is shown once and never stored in the clear.
  return json({ build: stored, secret: r === 1 && typeof secret !== "string" ? mine : undefined }, 201);
}

// GET /api/builds?idea=<ideaId> -> this idea's builds; GET /api/builds -> the recent wall.
export async function GET(req: Request) {
  const idea = new URL(req.url).searchParams.get("idea");
  if (idea !== null && !validId(idea)) return json({ error: "Unknown idea." }, 400);
  const ids = await redis.lrange(idea ? `builds:idea:${idea}` : "builds:recent", 0, 59);
  const builds = await readBuilds(ids);
  return json({ builds: builds.slice(0, idea ? 20 : 30) });
}

// Loads builds by id, dropping hidden builds and builds whose nickname is hidden.
const readBuilds = async (ids: string[]): Promise<Build[]> => {
  const valid = ids.filter((id) => BUILD_ID.test(id));
  if (valid.length === 0) return [];
  const p = redis.pipeline();
  for (const id of valid) p.hgetall(`build:${id}`);
  const rows = ((await p.exec()) as unknown[]).map(toHash);
  const live = rows.filter((b): b is Record<string, string> => !!b && typeof b.nick === "string" && b.hidden !== "1");
  const nicks = [...new Set(live.map((b) => b.nick.toLowerCase()))];
  const hiddenNicks = new Set<string>();
  if (nicks.length) {
    const q = redis.pipeline();
    for (const n of nicks) q.hget(`nick:${n}`, "hidden");
    ((await q.exec()) as (string | null)[]).forEach((h, i) => h === "1" && hiddenNicks.add(nicks[i]));
  }
  return live
    .filter((b) => !hiddenNicks.has(b.nick.toLowerCase()))
    .map((b) => ({
      id: b.id,
      ideaId: b.ideaId,
      twist: b.twist === "" ? null : Number(b.twist),
      url: b.url,
      title: b.title,
      nick: b.nick,
      createdAt: Number(b.createdAt),
    }));
};
