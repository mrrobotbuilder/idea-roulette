import "./style.css";
import { CATEGORIES, JACKPOT, JACKPOTS, STACKS, TWISTS, catOf, ideaOf, parseIdea, type Pick } from "./ideas.ts";
import { sliceAtPointer, targetRotation } from "./wheel.ts";
import { THEMES, themeByKey, inkOn } from "./themes.ts";
import { renderCard } from "./card.ts";
import { dailyPick, msToNextDay, utcDate } from "./daily.ts";
import { challengeHash, cleanName, hashFor, parseHash, type Route } from "./links.ts";

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
// Dev-only knob: ?jackpot=1 makes every spin a jackpot. Compiled out of production builds.
const FORCE_JACKPOT = import.meta.env.DEV && new URLSearchParams(location.search).has("jackpot");

let enabled: boolean[] = load("ir-enabled", CATEGORIES.map(() => true));
if (!Array.isArray(enabled) || enabled.length !== N) enabled = CATEGORIES.map(() => true);
let stack: string[] = load("ir-stack", []);
stack = Array.isArray(stack) ? stack.filter((k) => STACKS.some((s) => s.key === k)) : [];
let muted: boolean = load("ir-muted", false);
let history: Pick[] = load("ir-history", []);
if (!Array.isArray(history)) history = [];
let jackpots: number = load("ir-jackpots", 0);
if (!Number.isInteger(jackpots)) jackpots = 0;
// Challenge link -> when this browser accepted it. Starts the friend's countdown once.
const challenges: Record<string, number> = { ...load<Record<string, number>>("ir-challenges", {}) };
let rotation = 0;
let spinning = false;
let current: Pick | null = null;
let theme = themeByKey(load("ir-theme", "monte"));
// Jackpots keep their gold in every theme; categories take the theme palette.
const catColor = (i: number) => (i === JACKPOT ? catOf(i)!.color : theme.palette[i]);
// What the open slip is showing beyond the idea itself: today's fortune or an accepted challenge.
type Context = { label?: string; hash?: string; deadline?: number };
let context: Context = {};

// ---------- header stats ----------
const totalIdeas = CATEGORIES.reduce((n, c) => n + c.ideas.length, 0);
$("stats").textContent = `${totalIdeas} ideas × ${TWISTS.length} twists = ${(totalIdeas * (TWISTS.length + 1)).toLocaleString("en-US")} fortunes`;

const bulbs = document.querySelector(".bulbs")!;
bulbs.innerHTML = Array.from({ length: 24 }, (_, i) => `<i style="animation-delay:${(i % 3) * 0.25}s"></i>`).join("");

// ---------- stack filter ----------
const TAGS_OF = CATEGORIES.map((c) => c.ideas.map((r) => parseIdea(r).tags));
// Indexes of a category's ideas that pass the selected stack chips (OR between chips).
const poolOf = (cat: number) => {
  const active = STACKS.filter((s) => stack.includes(s.key));
  return TAGS_OF[cat].flatMap((tags, idx) => (active.length === 0 || active.some((s) => s.match(tags)) ? [idx] : []));
};
// Categories that are switched on AND still have at least one idea after the stack filter.
const liveCats = () => CATEGORIES.map((_, i) => i).filter((i) => enabled[i] && poolOf(i).length > 0);
const NOTHING = "No idea matches that mix. Loosen a filter or turn on more categories.";

// ---------- wheel ----------
const wheel = $("wheel") as unknown as SVGSVGElement;
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r].map((v) => v.toFixed(2)).join(" ");
};
const drawWheel = () => {
  const live = new Set(liveCats());
  const seg = 360 / SLICES;
  let svg = `<circle r="248" class="rim"/>`;
  for (let s = 0; s < SLICES; s++) {
    const c = CATEGORIES[s % N];
    const a0 = s * seg;
    const a1 = a0 + seg;
    const mid = a0 + seg / 2;
    const off = live.has(s % N) ? "" : " off";
    svg += `<path class="slice${off}" d="M0 0 L${polar(a0, 228)} A228 228 0 0 1 ${polar(a1, 228)} Z" fill="${catColor(s % N)}"/>`;
    svg += `<g transform="rotate(${mid})" class="label${off}"><text y="-180" text-anchor="middle" font-size="30">${c.emoji}</text>`;
    svg += `<text transform="translate(0 -122) rotate(-90)" text-anchor="middle" dominant-baseline="central" font-size="12" class="lname" style="fill:${inkOn(catColor(s % N))}">${c.name.split(" ")[0].toUpperCase()}</text></g>`;
  }
  for (let b = 0; b < 32; b++) {
    const [x, y] = polar(b * (360 / 32), 239).split(" ");
    svg += `<circle cx="${x}" cy="${y}" r="4.5" class="bulb" style="--d:${(b % 2) * 0.4}s;--i:${b}"/>`;
  }
  svg += `<circle r="62" class="hub-ring"/>`;
  wheel.innerHTML = svg;
};
const setRotation = (deg: number) => {
  wheel.style.transform = `rotate(${deg}deg)`;
};

// ---------- chips ----------
const chips = $("chips");
const stackEl = $("stack");
const poolEl = $("pool");
const drawChips = () => {
  chips.innerHTML = CATEGORIES.map(
    (c, i) =>
      `<button class="chip${enabled[i] ? " on" : ""}" data-i="${i}" aria-pressed="${enabled[i]}" style="--c:${catColor(i)};--on:${inkOn(catColor(i))}">${c.emoji} ${c.name}</button>`,
  ).join("");
  stackEl.innerHTML = STACKS.map((s) => {
    const on = stack.includes(s.key);
    return `<button class="chip stack-chip${on ? " on" : ""}" data-k="${s.key}" aria-pressed="${on}">${s.label}</button>`;
  }).join("");
  const n = liveCats().reduce((sum, i) => sum + poolOf(i).length, 0);
  poolEl.textContent = n ? `${n} ideas in play` : NOTHING;
  poolEl.classList.toggle("empty", n === 0);
};
const redraw = () => {
  drawChips();
  drawWheel();
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
  redraw();
});
stackEl.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".chip");
  if (!btn || spinning) return;
  const k = btn.dataset.k!;
  stack = stack.includes(k) ? stack.filter((x) => x !== k) : [...stack, k];
  save("ir-stack", stack);
  redraw();
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
const fanfare = () =>
  [392, 523, 659, 784, 659, 784, 1047, 1319, 1568].forEach((f, i) => beep(f, i === 8 ? 0.9 : 0.16, i * 0.09, "square", 0.06));
const crunch = () => [220, 180, 140].forEach((f, i) => beep(f, 0.06, i * 0.04, "sawtooth", 0.04));
const drawMute = () => ($("mute").textContent = muted ? "🔇 sound off" : "🔊 sound on");
$("mute").addEventListener("click", () => {
  muted = !muted;
  save("ir-muted", muted);
  drawMute();
});

// ---------- picking ----------
const rand = (n: number) => Math.floor(Math.random() * n);
const pickIdea = (): Pick | null => {
  const cats = liveCats();
  if (cats.length === 0) return null;
  const cat = cats[rand(cats.length)];
  const pool = poolOf(cat);
  const seen = new Set(history.filter((h) => h.cat === cat).map((h) => h.idx));
  let idx = pool[rand(pool.length)];
  for (let t = 0; t < 8 && seen.has(idx); t++) idx = pool[rand(pool.length)];
  return { cat, idx, twist: null };
};
const hitJackpot = () => FORCE_JACKPOT || crypto.getRandomValues(new Uint32Array(1))[0] % 40 === 0;

// ---------- spin ----------
const pointer = $("pointer");
const envelope = $("envelope");
const spin = () => {
  if (spinning || !envelope.hidden) return;
  const normal = pickIdea();
  if (!normal) return toast(NOTHING); // never spin into nothing
  closeModal();
  // The wheel always lands on a live category; a jackpot swaps in a legendary idea on top.
  const jp = hitJackpot();
  const pick: Pick = jp ? { cat: JACKPOT, idx: rand(JACKPOTS.length), twist: null } : normal;
  spinning = true;
  document.body.classList.add("spinning");
  document.body.classList.toggle("jackpot", jp);
  const slice = normal.cat + (Math.random() < 0.5 ? 0 : N);
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
    if (landed !== normal.cat) throw new Error(`wheel landed on ${landed}, expected ${normal.cat}`);
    rotation %= 360;
    setRotation(rotation);
    spinning = false;
    document.body.classList.remove("spinning");
    if (jp) save("ir-jackpots", ++jackpots);
    remember(pick);
    reveal(pick);
  };
  requestAnimationFrame(frame);
};
$("spin").addEventListener("click", spin);
$("hub").addEventListener("click", spin);
$("again").addEventListener("click", spin);
document.addEventListener("keydown", (e) => {
  const t = e.target;
  if (e.code === "Space" && !(t instanceof HTMLButtonElement || t instanceof HTMLInputElement || t instanceof HTMLSelectElement)) {
    e.preventDefault();
    spin();
  }
  if (e.key === "Escape") closeModal();
});

// ---------- fortune ----------
const seedFrom = (p: Pick) => p.cat * 997 + p.idx * 31 + 7;
const luckyFor = (p: Pick) => {
  const seed = seedFrom(p);
  return [seed % 9 + 1, (seed * 7) % 42 + 3, (seed * 13) % 77 + 10].join(" · ");
};
const TIMES = ["one evening", "a weekend", "one caffeinated night", "a week of evenings", "a lunch break (if you are brave)"];
const buildPrompt = (p: Pick) => {
  const { title, pitch, cat } = ideaOf(p)!;
  const twist = p.twist === null ? "" : `\nTwist: ${TWISTS[p.twist]}`;
  const scope =
    p.cat === JACKPOT
      ? "This is a legendary, ambitious idea: plan the full vision, then build the smallest slice that proves it works."
      : "Keep the scope to a weekend MVP.";
  return `Build me "${title}": ${pitch}${twist}
Category: ${cat.name}.
Make it a polished, mobile-friendly web app I can deploy today. Choose sensible defaults, ${scope} Give it a memorable name, and make the first-run experience delightful.`;
};

const dur = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${String(s % 60).padStart(2, "0")}s`;
};
const hoursLabel = (h: number) => (h === 168 ? "1 week" : `${h} hours`);

const fillSlip = (p: Pick) => {
  const { title, pitch, cat: c } = ideaOf(p)!;
  const seed = seedFrom(p);
  const lucky = luckyFor(p);
  const stars = p.cat === JACKPOT ? "★★★ + 👑" : "★".repeat((seed % 3) + 1).padEnd(3, "☆");
  $("slipCat").textContent = `${context.label ? `${context.label} · ` : ""}${c.emoji} ${c.name}`;
  $("slipCat").style.background = catColor(p.cat);
  $("slipCat").style.color = inkOn(catColor(p.cat));
  $("slipTitle").textContent = title;
  $("slipPitch").textContent = pitch;
  const tw = $("slipTwist");
  tw.hidden = p.twist === null;
  tw.textContent = p.twist === null ? "" : `🌶️ ${TWISTS[p.twist]}`;
  $("slipMeta").innerHTML = `<div><dt>Difficulty</dt><dd>${stars}</dd></div><div><dt>Build time</dt><dd>${p.cat === JACKPOT ? "a legendary summer" : TIMES[seed % TIMES.length]}</dd></div><div><dt>Lucky numbers</dt><dd>${lucky}</dd></div>`;
  $("promptText").textContent = buildPrompt(p);
  tickClock();
  window.history.replaceState(null, "", context.hash ?? hashFor(p));
};

// One clock drives both countdowns: the daily button and an accepted challenge's deadline.
const tickClock = () => {
  $("dailyIn").textContent = `next one in ${dur(msToNextDay(Date.now()))}`;
  const dl = $("slipDeadline");
  dl.hidden = context.deadline === undefined;
  if (context.deadline !== undefined) {
    const left = context.deadline - Date.now();
    dl.textContent = left > 0 ? `⏳ ${dur(left)} left to build it` : "⌛ Time is up. Did you ship it?";
  }
};
setInterval(tickClock, 1000);

const modal = $("modal");
const modalInner = $("modalInner");
const cookie = $("cookie");
const chForm = $<HTMLFormElement>("chForm");
const reveal = (p: Pick, ctxt: Context = {}) => {
  current = p;
  context = ctxt;
  const jp = p.cat === JACKPOT;
  fillSlip(p);
  document.body.classList.toggle("jackpot", jp);
  modalInner.classList.toggle("gold", jp);
  $("jpBanner").hidden = !jp;
  chForm.hidden = true;
  modal.hidden = false;
  modal.classList.remove("open");
  cookie.classList.remove("cracked");
  void modal.offsetWidth;
  modal.classList.add("open");
  setTimeout(() => {
    cookie.classList.add("cracked");
    crunch();
    setTimeout(jp ? fanfare : jingle, 250);
    confetti(jp);
    if (jp) [450, 900].forEach((ms) => setTimeout(() => confetti(true), ms));
    $("again").focus();
  }, reducedMotion ? 0 : 1100);
};
const closeModal = () => {
  if (modal.hidden) return;
  modal.hidden = true;
  modal.classList.remove("open");
  document.body.classList.remove("jackpot");
  context = {};
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
  context = {}; // a new twist is a new fortune, no longer today's or the challenged one
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
    $("promptText").textContent = text;
    toast("Clipboard is blocked here. Select the text below instead.");
  }
};
const shareLink = async (url: string, text: string, copiedMsg: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Idea Roulette", text, url });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return; // user closed the sheet
      throw e;
    }
  }
  await copy(url, copiedMsg);
};
$("copy").addEventListener("click", () => current && copy(buildPrompt(current), "Prompt copied. Paste it into your AI builder."));
$("share").addEventListener("click", () => {
  if (!current) return;
  const url = location.origin + location.pathname + hashFor(current);
  return shareLink(url, `The wheel says I should build: ${ideaOf(current)!.title}`, "Link copied. Send it to a friend who needs an idea.");
});

// ---------- daily fortune ----------
const openDaily = () => {
  const p = dailyPick(utcDate(Date.now()));
  remember(p);
  reveal(p, { label: "🗓️ Today's fortune", hash: "#daily" });
};
$("daily").addEventListener("click", () => !spinning && envelope.hidden && openDaily());

// ---------- challenge a friend ----------
const chName = $<HTMLInputElement>("chName");
$("challenge").addEventListener("click", () => {
  chForm.hidden = !chForm.hidden;
  if (!chForm.hidden) {
    chName.value = load("ir-name", "");
    chName.focus();
  }
});
chForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!current) return;
  const name = cleanName(chName.value);
  const hours = Number($<HTMLSelectElement>("chHours").value);
  save("ir-name", name);
  const url = location.origin + location.pathname + challengeHash(current, hours, name);
  chForm.hidden = true;
  return shareLink(url, `I challenge you to build this within ${hoursLabel(hours)}. Dare to open it?`, "Challenge link copied. Send it to your rival.");
});

let pending: { route: Extract<Route, { kind: "challenge" }>; hash: string } | null = null;
const revealChallenge = (r: Extract<Route, { kind: "challenge" }>, hash: string, acceptedAt: number) => {
  remember(r.pick);
  reveal(r.pick, { label: "⚔️ Challenge", hash, deadline: acceptedAt + r.hours * 3_600_000 });
};
const openChallenge = (r: Extract<Route, { kind: "challenge" }>, hash: string) => {
  const acceptedAt = challenges[hash];
  if (typeof acceptedAt === "number") return revealChallenge(r, hash, acceptedAt);
  closeModal();
  pending = { route: r, hash };
  $("envText").textContent = `${r.name || "A friend"} challenges you to build this within ${hoursLabel(r.hours)}. Accept?`;
  $("envAsk").hidden = false;
  $("envChicken").hidden = true;
  envelope.hidden = false;
  window.history.replaceState(null, "", hash);
  $("accept").focus();
};
$("accept").addEventListener("click", () => {
  if (!pending) return;
  const { route, hash } = pending;
  pending = null;
  challenges[hash] = Date.now();
  save("ir-challenges", challenges);
  envelope.hidden = true;
  revealChallenge(route, hash, challenges[hash]);
});
$("decline").addEventListener("click", () => {
  pending = null;
  $("envAsk").hidden = true;
  $("envChicken").hidden = false;
  window.history.replaceState(null, "", location.pathname);
  $("envBack").focus();
});
$("envBack").addEventListener("click", () => {
  envelope.hidden = true;
  $("spin").focus();
});

// ---------- fortune card ----------
$("card").addEventListener("click", async () => {
  if (!current) return;
  const p = current;
  const { title, pitch, cat: c } = ideaOf(p)!;
  const blob = await renderCard({
    category: c.name,
    emoji: c.emoji,
    color: catColor(p.cat),
    title,
    pitch,
    twist: p.twist === null ? null : TWISTS[p.twist],
    lucky: luckyFor(p),
    site: location.host,
    theme,
    jackpot: p.cat === JACKPOT,
  });
  const name = `idea-roulette-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`;
  const file = new File([blob], name, { type: "image/png" });
  // Phones get the share sheet (save to photos, send in a chat); desktops just download.
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Idea Roulette" });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return;
      throw e;
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  toast("Card saved. Post it and tag a friend.");
});

// ---------- themes ----------
const themePick = $<HTMLSelectElement>("theme");
themePick.innerHTML = THEMES.map((t) => `<option value="${t.key}">${t.name}</option>`).join("");
const applyTheme = () => {
  document.documentElement.dataset.theme = theme.key;
  document.querySelector('meta[name="theme-color"]')!.setAttribute("content", theme.meta);
  themePick.value = theme.key;
};
themePick.addEventListener("change", () => {
  theme = themeByKey(themePick.value);
  save("ir-theme", theme.key);
  applyTheme();
  drawWheel();
  drawChips();
  drawHistory();
  if (current && !modal.hidden) fillSlip(current);
});

// ---------- history ----------
const remember = (p: Pick, replaceLast = false) => {
  const rest = replaceLast ? history.slice(1) : history;
  history = [p, ...rest.filter((h) => !(h.cat === p.cat && h.idx === p.idx))].slice(0, 12);
  save("ir-history", history);
  drawHistory();
};
const drawHistory = () => {
  history = history.filter((h) => h && ideaOf(h));
  $("historyWrap").hidden = history.length === 0;
  $("jpCount").textContent = jackpots ? ` · 👑 × ${jackpots}` : "";
  $("history").innerHTML = history
    .map((h, i) => {
      const { title, cat: c } = ideaOf(h)!;
      return `<li><button data-i="${i}" style="--c:${catColor(h.cat)}">${c.emoji} ${title}${h.twist === null ? "" : " 🌶️"}</button></li>`;
    })
    .join("");
};
$("history").addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (btn && !spinning) reveal(history[Number(btn.dataset.i)]);
});

// ---------- confetti ----------
const confetti = (gold = false) => {
  if (reducedMotion) return;
  const colors = gold ? ["#ffd54a", "#fff3a0", "#c9971c", "#ffe68a", "#fff"] : ["#ffd54a", "#e3342f", "#38c172", "#2779bd", "#f66d9b", "#fff"];
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

// ---------- routing: #<idea>, #jackpot-<i>, #daily, #challenge-... ; anything else is the plain wheel ----------
const route = () => {
  const r = parseHash(location.hash);
  if (!r) return;
  if (r.kind === "daily") openDaily();
  else if (r.kind === "idea") reveal(r.pick);
  else openChallenge(r, location.hash);
};
window.addEventListener("hashchange", route);

// ---------- boot ----------
applyTheme();
redraw();
drawMute();
drawHistory();
tickClock();
route();
