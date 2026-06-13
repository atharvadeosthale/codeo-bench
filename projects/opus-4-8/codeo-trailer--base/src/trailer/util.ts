// Deterministic helpers — no Math.random(), every frame must be reproducible.

// Sum-of-sines "noise" in roughly [-1, 1]. Used for projector gate-weave and
// brightness flicker so motion feels mechanical/organic rather than computed.
export const weave = (f: number, seed = 0): number =>
  (Math.sin(f * 0.7 + seed) +
    Math.sin(f * 1.9 + seed * 2.3) * 0.5 +
    Math.sin(f * 3.7 + seed * 1.1) * 0.25) /
  1.75;

// SMPTE-style timecode HH:MM:SS:FF from a frame index.
export const timecode = (frame: number, fps: number): string => {
  const f = Math.floor(frame % fps);
  const totalSeconds = Math.floor(frame / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
};
