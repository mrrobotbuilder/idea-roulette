import "./style.css";
import { CATEGORIES, TWISTS, parseIdea, type Pick } from "./ideas.ts";
import { sliceAtPointer, targetRotation } from "./wheel.ts";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
};

// Any exception in a handler shows on screen instead of silently doing nothing.
const errBox = $("err");
const showErr = (msg: string) => {
  errBox.textContent = `Something broke: ${msg}`;
  errBox.hidden = false;
};
window.addEventListener("error", (e) => showErr(e.message));
window.addEventListener("unhandledrejection", (e) => showErr(String(e.reason)));

// ---------- storage (per-browser conveniences only) ----------
const load = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback; // private mode or blocked storage: the page still works
  }
};
const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: history and settings just will not persist */
  }
};

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const N = CATEGORIES.length;
const SLICES = N * 2;

let enabled: boolean[] = load("ir-enabled", CATEGORIES.map(() => true));
if (enabled.length !== N) enabled = CATEGORIES.map(() => true);
let muted: boolean = load("ir-muted", false);
let history: Pick[] = load("ir-history", []);
let rotation = 0;
let spinning = false;
let current: Pick | null = null;

// ---------- header stats ----------
const totalIdeas = CATEGORIES.reduce((n, c) => n + c.ideas.length, 0);
$("stats").textContent = `${totalIdeas} ideas × ${TWISTS.length} twists = ${(totalIdeas * (TWISTS.length + 1)).toLocaleString("en-US")} fortunes`;

const bulbs = document.querySelector(".bulbs")!;
bulbs.innerHTML = Array.from({ length: 24 }, (_, i) => `<i style="animation-delay:${(i % 3) * 0.25}s"></i>`).join("");

// ---------- wheel ----------
const wheel = $("wheel") as unknown as SVGSVGElement;
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r].map((v) => v.toFixed(2)).join(" ");
};
const drawWheel = () => {
  const seg = 360 / SLICES;
  let svg = `<circle r="248" class="rim"/>`;
  for (let s = 0; s < SLICES; s++) {
    const c = CATEGORIES[s % N];
    const a0 = s * seg;
    const a1 = a0 + seg;
    const mid = a0 + seg / 2;
    const off = enabled[s % N] ? "" : " off";
    svg += `<path class="slice${off}" d="M0 0 L${polar(a0, 228)} A228 228 0 0 1 ${polar(a1, 228)} Z" fill="${c.color}"/>`;
    svg += `<g transform="rotate(${mid})" class="label${off}"><text y="-180" text-anchor="middle" font-size="30">${c.emoji}</text>`;
    svg += `<text transform="translate(0 -122) rotate(-90)" text-anchor="middle" dominant-baseline="central" font-size="12" class="lname">${c.name.split(" ")[0].toUpperCase()}</text></g>`;
  }
  for (let b = 0; b < 32; b++) {
    const [x, y] = polar(b * (360 / 32), 239).split(" ");
    svg += `<circle cx="${x}" cy="${y}" r="4.5" class="bulb" style="animation-delay:${(b % 2) * 0.4}s"/>`;
  }
  svg += `<circle r="62" class="hub-ring"/>`;
  wheel.innerHTML = svg;
};
const setRotation = (deg: number) => {
  wheel.style.transform = `rotate(${deg}deg)`;
};

// ---------- category chips ----------
const chips = $("chips");
const drawChips = () => {
  chips.innerHTML = CATEGORIES.map(
    (c, i) =>
      `<button class="chip${enabled[i] ? " on" : ""}" data-i="${i}" aria-pressed="${enabled[i]}" style="--c:${c.color}">${c.emoji} ${c.name}</button>`,
  ).join("");
};
chips.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".chip");
  if (!btn || spinning) return;
  const i = Number(btn.dataset.i);
  const next = enabled.slice();
  next[i] = !next[i];
  if (!next.some(Boolean)) return toast("Keep at least one category in play.");
  enabled = next;
  save("ir-enabled", enabled);
  drawChips();
  drawWheel();
});

// ---------- sound ----------
let ctx: AudioContext | null = null;
const beep = (freq: number, dur: number, when = 0, type: OscillatorType = "square", vol = 0.05) => {
  if (muted) return;
  ctx ??= new AudioContext();
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur);
};
const tick = () => beep(1600, 0.03);
const jingle = () => [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.25, i * 0.1, "triangle", 0.08));
const crunch = () => [220, 180, 140].forEach((f, i) => beep(f, 0.06, i * 0.04, "sawtooth", 0.04));
const drawMute = () => ($("mute").textContent = muted ? "🔇 sound off" : "🔊 sound on");
$("mute").addEventListener("click", () => {
  muted = !muted;
  save("ir-muted", muted);
  drawMute();
});

// ---------- picking ----------
const rand = (n: number) => Math.floor(Math.random() * n);
const pickIdea = (): Pick => {
  const pool = CATEGORIES.map((_, i) => i).filter((i) => enabled[i]);
  const cat = pool[rand(pool.length)];
  const seen = new Set(history.filter((h) => h.cat === cat).map((h) => h.idx));
  let idx = rand(CATEGORIES[cat].ideas.length);
  for (let t = 0; t < 8 && seen.has(idx); t++) idx = rand(CATEGORIES[cat].ideas.length);
  return { cat, idx, twist: null };
};

// ---------- spin ----------
const pointer = $("pointer");
const spin = () => {
  if (spinning) return;
  closeModal();
  spinning = true;
  document.body.classList.add("spinning");
  const pick = pickIdea();
  const slice = pick.cat + (Math.random() < 0.5 ? 0 : N);
  const start = rotation;
  const end = targetRotation(start, slice, SLICES, reducedMotion ? 1 : 6 + rand(3), Math.random() * 0.8 - 0.4);
  const dur = reducedMotion ? 600 : 5200;
  const t0 = performance.now();
  let last = sliceAtPointer(start, SLICES);
  const frame = (now: number) => {
    const t = Math.min(1, (now - t0) / dur);
    rotation = start + (end - start) * (1 - Math.pow(1 - t, 4));
    setRotation(rotation);
    const s = sliceAtPointer(rotation, SLICES);
    if (s !== last) {
      last = s;
      tick();
      pointer.classList.remove("flick");
      void pointer.offsetWidth;
      pointer.classList.add("flick");
    }
    if (t < 1) return requestAnimationFrame(frame);
    const landed = sliceAtPointer(rotation, SLICES) % N;
    if (landed !== pick.cat) throw new Error(`wheel landed on ${landed}, expected ${pick.cat}`);
    rotation %= 360;
    setRotation(rotation);
    spinning = false;
    document.body.classList.remove("spinning");
    remember(pick);
    reveal(pick);
  };
  requestAnimationFrame(frame);
};
$("spin").addEventListener("click", spin);
$("hub").addEventListener("click", spin);
$("again").addEventListener("click", spin);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLInputElement)) {
    e.preventDefault();
    spin();
  }
  if (e.key === "Escape") closeModal();
});

// ---------- fortune ----------
const seedFrom = (p: Pick) => p.cat * 997 + p.idx * 31 + 7;
const TIMES = ["one evening", "a weekend", "one caffeinated night", "a week of evenings", "a lunch break (if you are brave)"];
const buildPrompt = (p: Pick) => {
  const c = CATEGORIES[p.cat];
  const { title, pitch } = parseIdea(c.ideas[p.idx]);
  const twist = p.twist === null ? "" : `\nTwist: ${TWISTS[p.twist]}`;
  return `Build me "${title}": ${pitch}${twist}
Category: ${c.name}.
Make it a polished, mobile-friendly web app I can deploy today. Choose sensible defaults, keep the scope to a weekend MVP, give it a memorable name, and make the first-run experience delightful.`;
};

const hashFor = (p: Pick) => `#${CATEGORIES[p.cat].key}-${p.idx}${p.twist === null ? "" : `-${p.twist}`}`;
const parseHash = (): Pick | null => {
  const m = location.hash.match(/^#([a-z]+)-(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const cat = CATEGORIES.findIndex((c) => c.key === m[1]);
  const idx = Number(m[2]);
  const twist = m[3] === undefined ? null : Number(m[3]);
  if (cat < 0 || idx >= CATEGORIES[cat].ideas.length || (twist !== null && twist >= TWISTS.length)) return null;
  return { cat, idx, twist };
};

const fillSlip = (p: Pick) => {
  const c = CATEGORIES[p.cat];
  const { title, pitch } = parseIdea(c.ideas[p.idx]);
  const seed = seedFrom(p);
  const lucky = [seed % 9 + 1, (seed * 7) % 42 + 3, (seed * 13) % 77 + 10].join(" · ");
  const stars = "★".repeat((seed % 3) + 1).padEnd(3, "☆");
  $("slipCat").textContent = `${c.emoji} ${c.name}`;
  $("slipCat").style.color = c.color;
  $("slipTitle").textContent = title;
  $("slipPitch").textContent = pitch;
  const tw = $("slipTwist");
  tw.hidden = p.twist === null;
  tw.textContent = p.twist === null ? "" : `🌶️ ${TWISTS[p.twist]}`;
  $("slipMeta").innerHTML = `<div><dt>Difficulty</dt><dd>${stars}</dd></div><div><dt>Build time</dt><dd>${TIMES[seed % TIMES.length]}</dd></div><div><dt>Lucky numbers</dt><dd>${lucky}</dd></div>`;
  $("promptText").textContent = buildPrompt(p);
  window.history.replaceState(null, "", hashFor(p));
};

const modal = $("modal");
const cookie = $("cookie");
const reveal = (p: Pick) => {
  current = p;
  fillSlip(p);
  modal.hidden = false;
  modal.classList.remove("open");
  cookie.classList.remove("cracked");
  void modal.offsetWidth;
  modal.classList.add("open");
  setTimeout(() => {
    cookie.classList.add("cracked");
    crunch();
    setTimeout(jingle, 250);
    confetti();
    $("again").focus();
  }, reducedMotion ? 0 : 1100);
};
const closeModal = () => {
  if (modal.hidden) return;
  modal.hidden = true;
  modal.classList.remove("open");
  window.history.replaceState(null, "", location.pathname);
};
$("close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

$("twist").addEventListener("click", () => {
  if (!current) return;
  let t = rand(TWISTS.length);
  if (t === current.twist) t = (t + 1) % TWISTS.length;
  current = { ...current, twist: t };
  fillSlip(current);
  remember(current, true);
  crunch();
});

const toastEl = $("toast");
let toastTimer = 0;
const toast = (msg: string) => {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), 2600);
};

const copy = async (text: string, okMsg: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg);
  } catch {
    (document.querySelector(".prompt") as HTMLDetailsElement).open = true;
    toast("Clipboard is blocked here. Select the prompt text below instead.");
  }
};
$("copy").addEventListener("click", () => current && copy(buildPrompt(current), "Prompt copied. Paste it into your AI builder."));
$("share").addEventListener("click", async () => {
  if (!current) return;
  const url = location.origin + location.pathname + hashFor(current);
  const { title } = parseIdea(CATEGORIES[current.cat].ideas[current.idx]);
  if (navigator.share) {
    try {
      await navigator.share({ title: "Idea Roulette", text: `The wheel says I should build: ${title}`, url });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return; // user closed the sheet
      throw e;
    }
  }
  await copy(url, "Link copied. Send it to a friend who needs an idea.");
});

// ---------- history ----------
const remember = (p: Pick, replaceLast = false) => {
  const rest = replaceLast ? history.slice(1) : history;
  history = [p, ...rest.filter((h) => !(h.cat === p.cat && h.idx === p.idx))].slice(0, 12);
  save("ir-history", history);
  drawHistory();
};
const drawHistory = () => {
  history = history.filter((h) => CATEGORIES[h.cat]?.ideas[h.idx] && (h.twist === null || h.twist < TWISTS.length));
  $("historyWrap").hidden = history.length === 0;
  $("history").innerHTML = history
    .map((h, i) => {
      const c = CATEGORIES[h.cat];
      return `<li><button data-i="${i}" style="--c:${c.color}">${c.emoji} ${parseIdea(c.ideas[h.idx]).title}${h.twist === null ? "" : " 🌶️"}</button></li>`;
    })
    .join("");
};
$("history").addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (btn && !spinning) reveal(history[Number(btn.dataset.i)]);
});

// ---------- confetti ----------
const confetti = () => {
  if (reducedMotion) return;
  const colors = ["#ffd54a", "#e3342f", "#38c172", "#2779bd", "#f66d9b", "#fff"];
  const box = document.createElement("div");
  box.className = "confetti";
  box.innerHTML = Array.from({ length: 70 }, () => {
    const x = Math.random() * 100;
    const d = 1.6 + Math.random() * 1.6;
    return `<i style="left:${x}%;background:${colors[rand(colors.length)]};animation-duration:${d}s;animation-delay:${Math.random() * 0.3}s;transform:rotate(${rand(360)}deg)"></i>`;
  }).join("");
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3600);
};

// ---------- boot ----------
drawWheel();
drawChips();
drawMute();
drawHistory();
const shared = parseHash();
if (shared) reveal(shared);
