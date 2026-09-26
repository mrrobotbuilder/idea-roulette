import { json, redis, validId } from "./_lib.ts";

// GET /api/top -> { top: [{ id, votes }] }, the 20 most-voted ideas.
export async function GET() {
  const flat = await redis.zrange<(string | number)[]>("rank", 0, 19, { rev: true, withScores: true });
  const top: { id: string; votes: number }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const id = String(flat[i]);
    if (validId(id)) top.push({ id, votes: Number(flat[i + 1]) });
  }
  return json({ top });
}
