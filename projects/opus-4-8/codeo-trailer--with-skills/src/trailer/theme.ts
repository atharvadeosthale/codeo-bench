import { Easing, interpolate } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

// Fonts mirror the site (Bricolage Grotesque display + IBM Plex Mono labels).
export const display = loadDisplay("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

// Palette lifted verbatim from src/styles.css — the trailer IS the brand.
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

// Shared easing curves (same family the site uses in its CSS).
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // crisp deceleration entrance
  inOut: Easing.bezier(0.45, 0, 0.55, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45), // accelerating exit
  pop: Easing.bezier(0.34, 1.56, 0.64, 1), // slight overshoot, used sparingly
  expo: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

// interpolate clamped on both ends — the move we make hundreds of times.
export const seg = (
  frame: number,
  from: number,
  to: number,
  outFrom: number,
  outTo: number,
  easing: (n: number) => number = EASE.out,
) =>
  interpolate(frame, [from, to], [outFrom, outTo], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Normalized 0→1 progress across a frame window.
export const prog = (
  frame: number,
  from: number,
  to: number,
  easing: (n: number) => number = EASE.out,
) => seg(frame, from, to, 0, 1, easing);

// A symmetric enter/hold/exit envelope: 0 → 1 (hold) → 0.
export const envelope = (
  frame: number,
  enterFrom: number,
  enterTo: number,
  exitFrom: number,
  exitTo: number,
) =>
  prog(frame, enterFrom, enterTo, EASE.out) -
  prog(frame, exitFrom, exitTo, EASE.in);

// SMPTE-style running timecode HH:MM:SS:FF from a global frame index.
export const timecode = (frame: number, fps: number) => {
  const f = Math.max(0, Math.floor(frame));
  const ff = f % fps;
  const totalSeconds = Math.floor(f / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
};
