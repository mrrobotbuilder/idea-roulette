import { timingSafeEqual } from "node:crypto";
import { BUILD_ID, NICK, json, readJson, redis, sha256 } from "../_lib.ts";

// Unhiding a build marks it reviewed (approved=1) so the same reports cannot hide it again,
// and gives its nickname back one of its hidden-build strikes.
const unhideBuild = redis.createScript<number>(`
if redis.call("EXISTS", KEYS[1]) == 0 then return -1 end
local was = redis.call("HGET", KEYS[1], "hidden")
redis.call("HSET", KEYS[1], "hidden", "0", "approved", "1")
if was == "1" and tonumber(redis.call("HGET", KEYS[2], "hiddenBuilds") or "0") > 0 then redis.call("HINCRBY", KEYS[2], "hiddenBuilds", -1) end
return 1
`);

// POST /api/admin/unhide {buildId} or {nick}, with Authorization: Bearer <ADMIN_TOKEN>
export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return json({ error: "Admin is not configured." }, 503);
  // Compare digests so the check takes the same time whatever the guess.
  const given = Buffer.from(await sha256(req.headers.get("authorization") ?? ""), "hex");
  const want = Buffer.from(await sha256(`Bearer ${token}`), "hex");
  if (!timingSafeEqual(given, want)) return json({ error: "Not allowed." }, 401);

  const body = await readJson(req);
  if (typeof body === "string") return json({ error: body }, 400);
  const { buildId, nick } = body;
  if (typeof buildId === "string" && BUILD_ID.test(buildId)) {
    const owner = await redis.hget<string>(`build:${buildId}`, "nick");
    if (!owner) return json({ error: "Unknown build." }, 404);
    await unhideBuild.exec([`build:${buildId}`, `nick:${owner.toLowerCase()}`], []);
    return json({ unhidden: { buildId } });
  }
  if (typeof nick === "string" && NICK.test(nick)) {
    const key = `nick:${nick.toLowerCase()}`;
    if (!(await redis.exists(key))) return json({ error: "Unknown nickname." }, 404);
    await redis.hset(key, { hidden: "0", hiddenBuilds: "0" });
    return json({ unhidden: { nick } });
  }
  return json({ error: "Send {buildId} or {nick}." }, 400);
}
