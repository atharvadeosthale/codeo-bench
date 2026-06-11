import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { Easing } from "remotion";

const bricolage = loadBricolage("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const plexMono = loadPlexMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const SANS = bricolage.fontFamily;
export const MONO = plexMono.fontFamily;

// Palette lifted verbatim from the site's styles.css
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

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IMPACT = Easing.bezier(0.12, 0.8, 0.2, 1);

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
