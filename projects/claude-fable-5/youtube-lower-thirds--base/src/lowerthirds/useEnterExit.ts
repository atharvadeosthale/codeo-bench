import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Shared timing hook for lower thirds: a springy entrance starting at `delay`
 * and an eased exit starting at `exitAt` (omit for no exit, e.g. the outro).
 */
export const useEnterExit = (delay: number, exitAt?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 26, stiffness: 150, mass: 0.9 },
  });
  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return { frame, fps, enter, exit, local: frame - delay };
};
