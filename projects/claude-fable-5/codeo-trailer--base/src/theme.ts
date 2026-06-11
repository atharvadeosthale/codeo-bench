import { Easing } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

const sans = loadSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const FONT_SANS = `${sans.fontFamily}, ui-sans-serif, system-ui, sans-serif`;
export const FONT_MONO = `${mono.fontFamily}, ui-monospace, monospace`;

// Palette lifted from the site's styles.css — the dark screening room.
export const C = {
  bg: "#0a0b07",
  bgRaised: "#11130c",
  bgDeep: "#050603",
  ink: "#eef0e2",
  inkDim: "#91957e",
  inkFaint: "#565a47",
  line: "rgba(238, 240, 226, 0.09)",
  lineStrong: "rgba(238, 240, 226, 0.19)",
  accent: "#d4ff3f",
  accentSoft: "rgba(212, 255, 63, 0.12)",
  rec: "#ff4438",
  ok: "#57d984",
} as const;

// The site's three easing curves.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo-ish settle
export const EASE_SNAP = Easing.bezier(0.65, 0, 0.35, 1); // symmetric snap
export const EASE_SOFT = Easing.bezier(0.22, 1, 0.36, 1); // gentle overshootless

export const SMPTE = [
  "#a8a8a0",
  "#aaa83e",
  "#3ba8a4",
  "#3ca83e",
  "#a43ca4",
  "#a33b3b",
  "#2f2fa6",
] as const;
