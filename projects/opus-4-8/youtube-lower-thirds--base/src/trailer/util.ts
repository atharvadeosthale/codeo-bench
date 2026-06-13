import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Entrance (spring up) + exit (clamped fade) timing for a card that lives inside
// a <Sequence>, so `useCurrentFrame()` is already local to the scene.
export const useStage = (
  durationInFrames: number,
  opts?: { enterDur?: number; exitDur?: number; delay?: number },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterDur = opts?.enterDur ?? 22;
  const exitDur = opts?.exitDur ?? 16;
  const delay = opts?.delay ?? 0;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: enterDur,
  });

  const exit = interpolate(
    frame,
    [durationInFrames - exitDur, durationInFrames - 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return { frame, fps, enter, exit, present: enter * (1 - exit) };
};

// Pure springy stagger value for the n-th element of a group. Not a hook, so it
// is safe to call inside a .map() (frame/fps are passed in by the caller).
export const staggerSpring = (
  frame: number,
  fps: number,
  index: number,
  startFrame: number,
  step = 4,
  config: { damping?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - startFrame - index * step,
    fps,
    config: { damping: config.damping ?? 200, mass: config.mass ?? 0.6 },
    durationInFrames: 20,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Zero-pad to two digits without String.prototype.padStart (not in es2015 lib).
export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Thousands separators without Intl/toLocaleString(locale) (not typed for es2015).
export const formatThousands = (n: number) => {
  const s = `${Math.round(n)}`;
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ",";
    out += s[i];
  }
  return out;
};

export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// mix two hex colors — handy for animated gradients without extra deps.
export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const out = pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(t))));
  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
};
