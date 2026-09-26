// Every URL hash the site understands. Pure and strict: anything malformed parses
// to null and the page falls back to the plain wheel.
import { ideaId, pickFromId, type Pick } from "./ideas.ts";

export const DEADLINES = [24, 48, 168];
export const NAME_MAX = 24;

export type Route =
  | { kind: "idea"; pick: Pick }
  | { kind: "daily" }
  | { kind: "challenge"; pick: Pick; hours: number; name: string };

const b64url = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s: string): string | null => {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return null; // not base64, or not valid UTF-8: a bad link, not a crash
  }
};
export const cleanName = (s: string) => s.replace(/\p{C}/gu, "").trim().slice(0, NAME_MAX);

export const hashFor = (p: Pick) => `#${ideaId(p)}${p.twist === null ? "" : `-${p.twist}`}`;
export const challengeHash = (p: Pick, hours: number, name: string) => {
  const n = cleanName(name);
  return `#challenge-${ideaId(p)}-${p.twist ?? "n"}-${hours}${n ? `-${b64url(n)}` : ""}`;
};

const num = (s: string) => (/^(0|[1-9]\d{0,3})$/.test(s) ? Number(s) : NaN);

export const parseHash = (hash: string): Route | null => {
  if (hash === "#daily") return { kind: "daily" };
  let m = /^#([a-z]+)-(\d+)(?:-(\d+))?$/.exec(hash);
  if (m) {
    const twist = m[3] === undefined ? null : num(m[3]);
    const pick = Number.isNaN(twist) ? null : pickFromId(m[1], num(m[2]), twist);
    return pick ? { kind: "idea", pick } : null;
  }
  m = /^#challenge-([a-z]+)-(\d+)-(\d+|n)-(\d+)(?:-([A-Za-z0-9_-]{2,128}))?$/.exec(hash);
  if (!m) return null;
  const twist = m[3] === "n" ? null : num(m[3]);
  const hours = num(m[4]);
  const pick = Number.isNaN(twist) ? null : pickFromId(m[1], num(m[2]), twist);
  if (!pick || !DEADLINES.includes(hours)) return null;
  let name = "";
  if (m[5] !== undefined) {
    const raw = unb64url(m[5]);
    if (raw === null || cleanName(raw) !== raw || raw === "") return null;
    name = raw;
  }
  return { kind: "challenge", pick, hours, name };
};
