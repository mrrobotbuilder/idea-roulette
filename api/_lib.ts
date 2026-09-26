// Shared by every /api function. Files starting with "_" are not deployed as endpoints.
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// The Marketplace names these KV_REST_API_*; fail loudly rather than run without storage.
const env = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
};
export const redis = new Redis({ url: env("KV_REST_API_URL"), token: env("KV_REST_API_TOKEN") });

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Vercel puts the client first in x-forwarded-for.
export const ipOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

export const voteLimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "10 m"), prefix: "rl:vote" });

export { isIdeaId as validId } from "../src/ideas.ts";

// Voter ids are random UUIDs made by the browser; anything else is rejected.
export const validVoter = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9-]{8,64}$/.test(v);

// Reads a small JSON body; a missing, huge or malformed body is the caller's error.
export const readJson = async (req: Request): Promise<Record<string, unknown> | null> => {
  const text = await req.text();
  if (text.length > 2000) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
};
