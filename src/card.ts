// Fortune card: a 1200x630 PNG painted with the Canvas 2D API.
import { inkOn, type Theme } from "./themes.ts";

export type CardData = {
  category: string;
  emoji: string;
  color: string; // category colour in the current theme
  title: string;
  pitch: string;
  twist: string | null;
  lucky: string;
  site: string;
  theme: Theme;
  jackpot: boolean;
};

export const W = 1200;
export const H = 630;
const EMOJI = `"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
const GOLD = { bg: ["#ffe68a", "#b8860b"], frame: "#7a5200", accent: "#9a3412", paper: "#fffaf0", ink: "#3b2a00" } as const;

// Greedy word wrap by measured width. A single word wider than `max` stays on its own
// line; layout() then rejects that scale because the line is too wide.
export const wrap = (ctx: CanvasRenderingContext2D, text: string, max: number) => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};

// Slip geometry: text runs from TEXT_X for TEXT_W, and must end above the lucky line.
const SLIP = { x: 390, y: 48, w: 770, h: 534 };
const TEXT_X = SLIP.x + 40;
const TEXT_W = SLIP.w - 80;
const TEXT_TOP = SLIP.y + 40;
const LUCKY_Y = SLIP.y + SLIP.h - 34;
const TEXT_BOTTOM = LUCKY_Y - 40;

type Block = { font: string; lines: string[]; lh: number; color: string; gap: number };

// Lay out title, pitch and twist at the largest scale where every line fits the width and
// the whole stack fits the height. Throws rather than draw clipped text.
const layout = (ctx: CanvasRenderingContext2D, d: CardData, ink: string, accent: string) => {
  const t = d.theme.card;
  for (let s = 1; s >= 0.4; s -= 0.05) {
    const specs = [
      { text: d.title, font: `${Math.round(50 * s)}px "${t.title}"`, lh: 1.2, color: ink, gap: 0 },
      { text: d.pitch, font: `${Math.round(30 * s)}px "${t.body}"`, lh: 1.45, color: ink, gap: 18 * s },
      ...(d.twist ? [{ text: `🌶️ ${d.twist}`, font: `${Math.round(26 * s)}px "${t.body}", ${EMOJI}`, lh: 1.4, color: accent, gap: 16 * s }] : []),
    ];
    const blocks: Block[] = specs.map((b) => {
      ctx.font = b.font;
      const size = parseInt(b.font, 10);
      return { font: b.font, lines: wrap(ctx, b.text, TEXT_W), lh: size * b.lh, color: b.color, gap: b.gap };
    });
    const fitsWidth = blocks.every((b) => {
      ctx.font = b.font;
      return b.lines.every((l) => ctx.measureText(l).width <= TEXT_W);
    });
    const height = blocks.reduce((h, b) => h + b.gap + b.lines.length * b.lh, 0);
    if (fitsWidth && TEXT_TOP + 56 + height <= TEXT_BOTTOM) return blocks;
  }
  throw new Error(`Card text does not fit: "${d.title}"`);
};

const cookieHalf = (ctx: CanvasRenderingContext2D, cx: number, cy: number, side: 1 | -1) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(side * 0.45);
  const g = ctx.createRadialGradient(-side * 10, -20, 6, 0, 0, 80);
  g.addColorStop(0, "#ffe0a3");
  g.addColorStop(0.55, "#e9a948");
  g.addColorStop(1, "#b8741f");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, 58, 72, 0, side === 1 ? -Math.PI / 2 : Math.PI / 2, side === 1 ? Math.PI / 2 : (3 * Math.PI) / 2);
  ctx.closePath();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fill();
  ctx.restore();
};

export const renderCard = async (d: CardData): Promise<Blob> => {
  const t = d.theme.card;
  // fonts.ready alone does not fetch a face nothing on the page uses yet, so ask for each.
  await Promise.all([t.title, t.body, "Outfit"].map((f) => document.fonts.load(`800 40px "${f}"`)));
  await document.fonts.ready;

  const c = d.jackpot ? { ...t, ...GOLD } : t;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");

  // background + frame
  const bg = ctx.createRadialGradient(W * 0.3, H * 0.4, 40, W / 2, H / 2, W * 0.7);
  bg.addColorStop(0, c.bg[0]);
  bg.addColorStop(1, c.bg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = c.frame;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 24);
  ctx.stroke();

  // left: cookie, category emoji, brand
  const lightText = d.jackpot ? GOLD.ink : "rgba(255,255,255,0.85)";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (d.jackpot) {
    ctx.fillStyle = GOLD.frame;
    ctx.font = `40px "${t.title}", ${EMOJI}`;
    ctx.fillText("👑 JACKPOT", 200, 100, 320);
  }
  cookieHalf(ctx, 140, 250, -1);
  cookieHalf(ctx, 260, 250, 1);
  ctx.save();
  ctx.translate(200, 262);
  ctx.rotate(-0.08);
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(-70, -14, 140, 28);
  ctx.restore();
  ctx.font = `84px ${EMOJI}`;
  ctx.fillText(d.emoji, 200, 440);
  ctx.fillStyle = c.frame;
  ctx.font = `30px "${t.title}"`;
  ctx.fillText("IDEA ROULETTE", 200, 520, 320);
  ctx.fillStyle = lightText;
  ctx.font = `22px "Outfit"`;
  ctx.fillText(d.site, 200, 556, 320);

  // right: paper slip with faint ruled lines
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = c.paper;
  ctx.fillRect(SLIP.x, SLIP.y, SLIP.w, SLIP.h);
  ctx.restore();
  ctx.fillStyle = c.accent;
  ctx.globalAlpha = 0.12;
  for (let y = SLIP.y + 34; y < SLIP.y + SLIP.h; y += 34) ctx.fillRect(SLIP.x, y, SLIP.w, 1.5);
  ctx.globalAlpha = 1;

  // category pill
  ctx.textAlign = "left";
  ctx.font = `800 22px "Outfit", ${EMOJI}`;
  const label = `${d.emoji} ${d.category.toUpperCase()}`;
  const pillW = ctx.measureText(label).width + 32;
  ctx.fillStyle = d.color;
  ctx.beginPath();
  ctx.roundRect(TEXT_X, TEXT_TOP, pillW, 38, 19);
  ctx.fill();
  ctx.fillStyle = inkOn(d.color);
  ctx.fillText(label, TEXT_X + 16, TEXT_TOP + 27);

  // title, pitch, twist
  let y = TEXT_TOP + 56;
  for (const b of layout(ctx, d, c.ink, c.accent)) {
    y += b.gap;
    ctx.font = b.font;
    ctx.fillStyle = b.color;
    ctx.textBaseline = "top";
    for (const line of b.lines) {
      ctx.fillText(line, TEXT_X, y);
      y += b.lh;
    }
  }

  // lucky numbers
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = c.ink;
  ctx.globalAlpha = 0.7;
  ctx.font = `20px "${t.body}"`;
  ctx.fillText(`Lucky numbers: ${d.lucky}`, TEXT_X, LUCKY_Y, TEXT_W);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode the card PNG."))), "image/png"),
  );
};
