import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Masked text/content reveal — the child slides up (or down/left) inside an
 * overflow-hidden wrapper. The workhorse entrance for every lower third.
 */
export const Reveal: React.FC<{
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  damping?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  delay = 0,
  direction = "up",
  distance = 110,
  damping = 26,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness: 160, mass: 0.9 },
  });
  const offset = (1 - progress) * distance;
  const transform =
    direction === "up"
      ? `translateY(${offset}%)`
      : direction === "down"
        ? `translateY(${-offset}%)`
        : direction === "left"
          ? `translateX(${offset}%)`
          : `translateX(${-offset}%)`;
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform }}>{children}</div>
    </div>
  );
};

export const FadeIn: React.FC<{
  delay?: number;
  duration?: number;
  from?: React.CSSProperties["transform"];
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, duration = 14, from, style, children }) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (frame - delay) / duration));
  const eased = 1 - (1 - t) * (1 - t) * (1 - t);
  return (
    <div
      style={{
        opacity: eased,
        transform: from && eased < 1 ? from : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Spring helper with sane trailer defaults. */
export const usePop = (delay: number, damping = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness: 170, mass: 0.8 },
  });
};
