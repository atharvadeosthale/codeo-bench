import { Easing, interpolate } from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.55, 1);
export const OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

// Normalized 0→1 progress over [start, start + duration], clamped.
export const ramp = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE_OUT,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
