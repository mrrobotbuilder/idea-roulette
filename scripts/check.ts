// Run: npm run check. Fails loudly if the wheel math, the idea bank, the daily pick or link parsing is broken.
import assert from "node:assert/strict";
import { CATEGORIES, JACKPOT, JACKPOTS, STACKS, TAGS, TWISTS, ideaOf, isIdeaId, parseIdea } from "../src/ideas.ts";
import { sliceAtPointer, targetRotation } from "../src/wheel.ts";
import { THEMES, contrast, inkOn } from "../src/themes.ts";
import { dailyPick, msToNextDay, utcDate } from "../src/daily.ts";
import { challengeHash, hashFor, parseHash } from "../src/links.ts";

const SLICES = CATEGORIES.length * 2;

// Wheel: every slice, from many start angles and jitters, lands where asked.
let spins = 0;
for (let slice = 0; slice < SLICES; slice++) {
  for (const start of [0, 13.7, 181, 359.9, 7200.5, -45]) {
    for (const jitter of [-0.4, 0, 0.4]) {
      const end = targetRotation(start, slice, SLICES, 6, jitter);
      assert.ok(end >= start + 6 * 360, "wheel must spin forward at least 6 turns");
      assert.equal(sliceAtPointer(end, SLICES), slice, `slice ${slice} from ${start} jitter ${jitter}`);
      spins++;
    }
  }
}

// Idea bank: format, known tags, no blank pitches, no duplicate titles anywhere (jackpots included).
assert.ok(CATEGORIES.length >= 8, "at least 8 categories");
const titles = new Set<string>();
const addTitle = (raw: string, where: string, allowTags: boolean) => {
  const parts = raw.split(" :: ");
  assert.ok(parts.length === 2 || (allowTags && parts.length === 3), `bad format in ${where}: ${raw}`);
  const { title, pitch, tags } = parseIdea(raw);
  assert.ok(title.length > 2 && pitch.length > 15, `too short: ${raw}`);
  if (parts.length === 3) assert.ok(tags.length > 0, `empty tag list: ${raw}`);
  for (const t of tags) assert.ok(TAGS.includes(t), `unknown tag "${t}" in ${raw}`);
  assert.equal(new Set(tags).size, tags.length, `repeated tag: ${raw}`);
  const key = title.toLowerCase();
  assert.ok(!titles.has(key), `duplicate title: ${title}`);
  titles.add(key);
};
let ideas = 0;
for (const c of CATEGORIES) {
  assert.ok(c.ideas.length >= 50, `${c.name} has ${c.ideas.length} ideas, want 50+`);
  for (const raw of c.ideas) addTitle(raw, c.name, true), ideas++;
  // Every category stays spinnable under every single stack filter.
  for (const s of STACKS) {
    const n = c.ideas.filter((r) => s.match(parseIdea(r).tags)).length;
    assert.ok(n >= 5, `${c.name} has only ${n} ideas for "${s.label}", want 5+`);
  }
}
assert.equal(JACKPOTS.length, 25, "25 jackpot ideas");
for (const raw of JACKPOTS) addTitle(raw, "JACKPOTS", false);
assert.ok(ideaOf({ cat: JACKPOT, idx: 24, twist: null }) && !ideaOf({ cat: JACKPOT, idx: 25, twist: null }), "jackpot bounds");
assert.ok(TWISTS.length >= 30 && TWISTS.every((t) => t.startsWith("...")), "twists");

// Themes: text written on any category colour (chips, slip pill, card pill, wheel) reaches 4.5:1.
let pairs = 0;
for (const t of THEMES) {
  assert.equal(t.palette.length, CATEGORIES.length, `${t.name} needs one colour per category`);
  for (const c of t.palette) {
    const r = contrast(c, inkOn(c));
    assert.ok(r >= 4.5, `${t.name} ${c}: text contrast ${r.toFixed(2)} < 4.5`);
    pairs++;
  }
}
assert.ok(contrast("#ffffff", "#000000") > 20.9 && Math.abs(contrast("#777777", "#ffffff") - 4.48) < 0.01, "contrast() matches WCAG");

// Daily fortune: deterministic, valid, spread out, and the countdown never hits zero.
const DAY = 86_400_000;
const t0 = Date.UTC(2026, 0, 1);
const seen = new Set<string>();
for (let d = 0; d < 365; d++) {
  const date = utcDate(t0 + d * DAY);
  const p = dailyPick(date);
  assert.deepEqual(dailyPick(date), p, `daily ${date} not deterministic`);
  assert.ok(ideaOf(p) && p.twist !== null, `daily ${date} gave an invalid pick`);
  seen.add(`${p.cat}-${p.idx}`);
}
assert.ok(seen.size >= 300, `365 days gave only ${seen.size} distinct ideas, want 300+`);
assert.equal(utcDate(Date.UTC(2026, 8, 26, 23, 59, 59)), "2026-09-26", "UTC date, not local");
assert.equal(msToNextDay(t0), DAY);
assert.equal(msToNextDay(t0 + DAY - 1), 1);
assert.throws(() => dailyPick("26/09/2026"));

// Links: round trips, and hostile hashes fall back to null instead of throwing.
const pick = { cat: 3, idx: 7, twist: 5 };
assert.deepEqual(parseHash(hashFor(pick)), { kind: "idea", pick });
assert.deepEqual(parseHash(hashFor({ cat: JACKPOT, idx: 4, twist: null })), { kind: "idea", pick: { cat: JACKPOT, idx: 4, twist: null } });
assert.deepEqual(parseHash("#daily"), { kind: "daily" });
for (const name of ["Darre", "Åsa-Märta 🦊", "a_b-c", ""]) {
  for (const hours of [24, 48, 168]) {
    const h = challengeHash(pick, hours, name);
    assert.deepEqual(parseHash(h), { kind: "challenge", pick, hours, name }, h);
  }
}
assert.deepEqual(parseHash(challengeHash({ ...pick, twist: null }, 48, "x")), { kind: "challenge", pick: { ...pick, twist: null }, hours: 48, name: "x" });
assert.equal(parseHash(challengeHash(pick, 48, "x".repeat(99))!)?.kind, "challenge", "long names are trimmed, not rejected");
const bad = [
  "", "#", "#dailyx", "#nope-1", "#money-9999", "#money-01", "#money-1-40", "#money-1-", "#jackpot-25",
  "#challenge-money-1-2-47-RGFycmU", "#challenge-money-1-2-48-", "#challenge-money-1-2-48-!!", "#challenge-money-1-99-48",
  "#challenge-money-1-2-48-_w", /* not UTF-8 */ "#challenge-money-1-2-48-IA", /* only a space */ "#challenge-money-1-2-48-AQ", /* control char */
  "#challenge-nope-1-2-48", "#challenge-money-1-2-48-" + "A".repeat(200), "#money-1-2<script>",
];
for (const h of bad) assert.equal(parseHash(h), null, `should reject ${h}`);

// Vote ids: every real idea is valid, and near-misses can never become a second vote key.
const allIds = [...CATEGORIES.flatMap((c) => c.ideas.map((_, i) => `${c.key}-${i}`)), ...JACKPOTS.map((_, i) => `jackpot-${i}`)];
for (const id of allIds) assert.ok(isIdeaId(id), id);
const badIds = ["", "money", "money-", "money-01", "money-1.0", "money--1", "Money-1", "nope-1", `money-${CATEGORIES[0].ideas.length}`, `jackpot-${JACKPOTS.length}`, "money-1 ", 7, null];
for (const id of badIds) assert.equal(isIdeaId(id), false, `should reject ${String(id)}`);

console.log(
  `OK: ${pairs} theme colours readable, ${spins} spins landed, ${ideas} ideas + ${JACKPOTS.length} jackpots, ${TWISTS.length} twists, ` +
    `every category has 5+ ideas per stack filter, daily gave ${seen.size}/365 distinct, ${bad.length} bad links rejected`,
);
