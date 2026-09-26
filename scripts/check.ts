// Run: npm run check. Fails loudly if the wheel math or the idea bank is broken.
import assert from "node:assert/strict";
import { CATEGORIES, TWISTS, parseIdea } from "../src/ideas.ts";
import { sliceAtPointer, targetRotation } from "../src/wheel.ts";
import { THEMES, contrast, inkOn } from "../src/themes.ts";

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

// Idea bank: format, no blank pitches, no duplicate titles anywhere.
assert.ok(CATEGORIES.length >= 8, "at least 8 categories");
const titles = new Set<string>();
let ideas = 0;
for (const c of CATEGORIES) {
  assert.ok(c.ideas.length >= 50, `${c.name} has ${c.ideas.length} ideas, want 50+`);
  for (const raw of c.ideas) {
    assert.equal(raw.split(" :: ").length, 2, `bad format in ${c.name}: ${raw}`);
    const { title, pitch } = parseIdea(raw);
    assert.ok(title.length > 2 && pitch.length > 15, `too short: ${raw}`);
    const key = title.toLowerCase();
    assert.ok(!titles.has(key), `duplicate title: ${title}`);
    titles.add(key);
    ideas++;
  }
}
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

console.log(`${pairs} theme colours readable. OK: ${spins} spins landed correctly, ${ideas} unique ideas, ${TWISTS.length} twists`);
