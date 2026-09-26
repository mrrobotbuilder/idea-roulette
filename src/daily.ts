// Daily fortune: one pick per UTC day, identical for everyone. Pure, so check.ts can test it.
import { CATEGORIES, TWISTS, type Pick } from "./ideas.ts";

const DAY = 86_400_000;
const ALL = CATEGORIES.flatMap((c, cat) => c.ideas.map((_, idx) => ({ cat, idx })));
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
// A golden-ratio stride coprime to the bank size visits every idea once before
// repeating, and consecutive days land in different categories.
let STRIDE = Math.floor(ALL.length * 0.618);
while (gcd(STRIDE, ALL.length) !== 1) STRIDE++;

// FNV-1a with a murmur finaliser: small, deterministic, well mixed.
const hash = (s: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
};

export const utcDate = (now: number) => new Date(now).toISOString().slice(0, 10);
export const msToNextDay = (now: number) => DAY - (((now % DAY) + DAY) % DAY);

export const dailyPick = (date: string): Pick => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) throw new Error(`dailyPick wants YYYY-MM-DD, got ${date}`);
  const day = Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY;
  const h = hash(date);
  const { cat, idx } = ALL[(((day * STRIDE + 12345) % ALL.length) + ALL.length) % ALL.length];
  return { cat, idx, twist: h % TWISTS.length };
};
