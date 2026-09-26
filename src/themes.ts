// Themes. Page colours and fonts live in style.css under [data-theme]; this file holds
// what JavaScript needs: the wheel palette (one colour per category, in CATEGORIES order)
// and the colours and fonts the fortune card is painted with.

export type Theme = {
  key: string;
  name: string;
  meta: string; // <meta name="theme-color">
  palette: string[];
  card: {
    bg: [string, string]; // radial gradient centre, edge
    frame: string;
    accent: string; // twist line and URL
    paper: string;
    ink: string;
    title: string; // font families; must be loaded by index.html
    body: string;
  };
};

export const THEMES: Theme[] = [
  {
    key: "monte",
    name: "Monte Carlo",
    meta: "#0b3d2e",
    palette: ["#1f9d55", "#2779bd", "#e3342f", "#6c5ce7", "#f6993f", "#9561e2", "#38c172", "#f66d9b"],
    card: { bg: ["#145c45", "#062419"], frame: "#ffd54a", accent: "#c0392b", paper: "#fffaf0", ink: "#2b1d0e", title: "Bungee", body: "Special Elite" },
  },
  {
    key: "neon",
    name: "Neon Vegas",
    meta: "#07020d",
    palette: ["#ff2e97", "#00b8d4", "#d500f9", "#2979ff", "#00c853", "#ff6d00", "#00e5ff", "#ff4081"],
    card: { bg: ["#2a0a3a", "#050208"], frame: "#ff2e97", accent: "#00e5ff", paper: "#12061c", ink: "#f8e8ff", title: "Bungee", body: "Outfit" },
  },
  {
    key: "lunar",
    name: "Lunar New Year",
    meta: "#7a0a10",
    palette: ["#c8102e", "#d4a017", "#8b0000", "#e8b923", "#b22222", "#c9971c", "#a0141e", "#f0a202"],
    card: { bg: ["#b3121f", "#4a0508"], frame: "#f5c542", accent: "#b3121f", paper: "#fff4dc", ink: "#4a0508", title: "Cinzel", body: "Outfit" },
  },
  {
    key: "arcade",
    name: "Retro Arcade",
    meta: "#1a0b2e",
    palette: ["#ff004d", "#29adff", "#00b543", "#ffa300", "#ff77a8", "#83769c", "#e6c700", "#c2378a"],
    card: { bg: ["#3b1c5a", "#0d0518"], frame: "#ffec27", accent: "#ff004d", paper: "#1d0f33", ink: "#fff1e8", title: "Press Start 2P", body: "Press Start 2P" },
  },
];

export const themeByKey = (key: unknown) => THEMES.find((t) => t.key === key) ?? THEMES[0];
