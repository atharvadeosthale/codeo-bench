import { Easing, interpolate, spring } from "remotion";

// Reusable animation helpers — all local to a sequence's frame.

export const springIn = (frame: number, fps: number, delay = 0, damping = 16) =>
  spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });

export const fadeUp = (frame: number, fps: number, delay = 0, dist = 28) => {
  const p = springIn(frame, fps, delay, 18);
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [dist, 0])}px)`,
  };
};

// 0->1 ramp over [a,b] frames, clamped, eased.
export const ramp = (
  frame: number,
  a: number,
  b: number,
  ease = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// fade in then out: up over [a,b], hold, down over [c,d]
export const window4 = (
  frame: number,
  a: number,
  b: number,
  c: number,
  d: number,
) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const pulse = (frame: number, period = 40, min = 0.6, max = 1) =>
  interpolate(Math.sin((frame / period) * Math.PI * 2), [-1, 1], [min, max]);
