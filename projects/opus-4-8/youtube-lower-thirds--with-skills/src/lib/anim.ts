import { Easing, interpolate, spring } from "remotion";

/** Signature ease — crisp UI entrance, no overshoot. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Soft editorial in/out. */
export const EASE_SOFT = Easing.bezier(0.45, 0, 0.55, 1);
/** Playful overshoot for pops. */
export const EASE_POP = Easing.bezier(0.34, 1.56, 0.64, 1);

type Range = [number, number];

/** Clamped interpolate with a default signature ease. */
export const track = (
  frame: number,
  input: Range,
  output: Range,
  easing: (n: number) => number = EASE,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Enter→hold→exit envelope in [0,1]. */
export const envelope = (
  frame: number,
  enter: Range,
  exit: Range,
  enterEase = EASE,
  exitEase = Easing.in(Easing.cubic),
) => track(frame, enter, [0, 1], enterEase) - track(frame, exit, [0, 1], exitEase);

export const pop = (frame: number, fps: number, delay = 0, damping = 14) =>
  spring({ frame, fps, delay, config: { damping, mass: 0.6, stiffness: 140 } });

/** Mask-reveal clip-path string driven by progress 0→1. */
export const wipe = (
  p: number,
  dir: "left" | "right" | "up" | "down" = "left",
) => {
  const v = (1 - p) * 100;
  switch (dir) {
    case "left":
      return `inset(0 ${v}% 0 0)`;
    case "right":
      return `inset(0 0 0 ${v}%)`;
    case "up":
      return `inset(${v}% 0 0 0)`;
    case "down":
      return `inset(0 0 ${v}% 0)`;
  }
};
