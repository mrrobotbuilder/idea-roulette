import { json, redis, validId, validVoter } from "./_lib.ts";

// GET /api/votes?ids=money-1,dev-4&voter=<id> -> { counts: {id: n}, mine: [ids you voted] }
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const ids = (q.get("ids") ?? "").split(",").filter(Boolean);
  if (ids.length === 0 || ids.length > 50 || !ids.every(validId)) return json({ error: "Pass 1 to 50 valid idea ids." }, 400);
  const voter = q.get("voter");
  if (voter !== null && !validVoter(voter)) return json({ error: "Bad voter id." }, 400);

  const p = redis.pipeline();
  for (const id of ids) {
    p.scard(`votes:${id}`);
    if (voter) p.sismember(`votes:${id}`, voter);
  }
  const r = (await p.exec()) as number[];
  const step = voter ? 2 : 1;
  const counts: Record<string, number> = {};
  const mine: string[] = [];
  ids.forEach((id, i) => {
    counts[id] = r[i * step];
    if (voter && r[i * step + 1] === 1) mine.push(id);
  });
  return json({ counts, mine });
}
