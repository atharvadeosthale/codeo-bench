import { interpolate } from "remotion";

// Fade a scene in at its start and out at its end.
export const fadeEdges = (
  frame: number,
  duration: number,
  fadeIn = 12,
  fadeOut = 14,
): number =>
  interpolate(frame, [0, fadeIn, duration - fadeOut, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Deterministic pseudo-random in [0, 1) — render-safe (no Math.random).
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

// Linear 0..1 ramp starting at `from`, lasting `dur` frames.
export const ramp = (frame: number, from: number, dur: number): number =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
