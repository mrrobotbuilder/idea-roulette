// Shared by every /api function. Files starting with "_" are not deployed as endpoints.
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// The Marketplace names these KV_REST_API_*; fail loudly rather than run without storage.
const env = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
};
// automaticDeserialization off: strings stay strings, so a title typed as "123" or "{}" is never parsed into something else.
export const redis = new Redis({ url: env("KV_REST_API_URL"), token: env("KV_REST_API_TOKEN"), automaticDeserialization: false });

// With automaticDeserialization off, HGETALL arrives as a flat [field, value, ...] array
// (whatever its typings say). Null for a missing key.
export const toHash = (flat: unknown): Record<string, string> | null => {
  if (!Array.isArray(flat) || flat.length === 0) return null;
  const o: Record<string, string> = {};
  for (let i = 0; i + 1 < flat.length; i += 2) o[String(flat[i])] = String(flat[i + 1]);
  return o;
};

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

// Reads a small JSON body. Returns the object, or a message saying what was wrong with it.
export const readJson = async (req: Request): Promise<Record<string, unknown> | string> => {
  const TOO_BIG = "That request is too big.";
  if (Number(req.headers.get("content-length")) > 4000) return TOO_BIG;
  const text = await req.text();
  if (text.length > 4000) return TOO_BIG;
  try {
    const v = JSON.parse(text);
    if (v && typeof v === "object" && !Array.isArray(v)) return v;
  } catch {
    /* fall through to the message */
  }
  return "Send a JSON object.";
};

export const sha256 = async (s: string) =>
  Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))).toString("hex");

// ---------- builds ----------
const perDay = (n: number, prefix: string) => new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(n, "1 d"), prefix });
export const buildIpLimit = perDay(10, "rl:build:ip");
export const buildNickLimit = perDay(5, "rl:build:nick");
export const reportLimit = perDay(30, "rl:report");

export const NICK = /^[A-Za-z0-9_-]{3,20}$/;
export const SECRET = /^[A-Za-z0-9_-]{43}$/; // 32 random bytes, base64url
export const BUILD_ID = /^[a-f0-9]{12}$/;

// A link to someone's build: public https only, so it can never point back at the
// visitor's machine, a private network, or smuggle credentials past the reader.
export const checkUrl = (v: unknown): string => {
  if (typeof v !== "string" || v.trim() === "") return "Paste the link to your build.";
  if (v.length > 300) return "That link is too long (300 characters max).";
  let u: URL;
  try {
    u = new URL(v.trim());
  } catch {
    return "That is not a valid link.";
  }
  if (u.protocol !== "https:") return "The link must start with https://";
  if (u.username || u.password) return "Links with a username or password are not allowed.";
  const h = u.hostname;
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local")) return "Link to your live build, not localhost.";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.startsWith("[")) return "Link to a domain, not an IP address.";
  if (!h.includes(".")) return "That link has no real domain.";
  return "";
};

// Titles are plain text of 3 to 80 characters; control characters are refused outright.
export const checkTitle = (v: unknown): string => {
  if (typeof v !== "string") return "Give your build a title.";
  const t = v.trim();
  if (/\p{C}/u.test(t)) return "The title has invisible control characters in it.";
  if (/[<>]/.test(t)) return "Titles cannot contain < or >.";
  const n = [...t].length;
  if (n < 3 || n > 80) return "The title must be 3 to 80 characters.";
  return "";
};
