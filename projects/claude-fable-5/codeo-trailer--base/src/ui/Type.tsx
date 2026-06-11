import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, EASE_OUT, FONT_MONO } from "../theme";

/**
 * A display line that rises out of an overflow mask — the slam used
 * across the whole trailer. Settles tracking from loose to tight.
 */
export const RisingLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fontSize?: number;
  style?: React.CSSProperties;
  out?: { at: number; duration?: number };
}> = ({ children, delay = 0, duration = 22, fontSize = 150, style, out }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const y = (1 - t) * 112;
  const skew = (1 - t) * -5;
  const spacing = interpolate(t, [0, 1], [0.06, -0.035]);

  let exitY = 0;
  if (out) {
    const o = interpolate(
      frame,
      [out.at, out.at + (out.duration ?? 14)],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT,
      },
    );
    exitY = o * -112;
  }

  return (
    <div style={{ overflow: "hidden", padding: "0.04em 0.1em" }}>
      <div
        style={{
          fontWeight: 800,
          fontSize,
          lineHeight: 0.94,
          textTransform: "uppercase",
          letterSpacing: `${spacing.toFixed(4)}em`,
          color: C.ink,
          transform: `translateY(${(y + exitY).toFixed(2)}%) skewY(${skew.toFixed(2)}deg)`,
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Lime stroke-only text, matching the site's .line-outline hero style. */
export const outlineStyle: React.CSSProperties = {
  color: "transparent",
  WebkitTextStroke: `3px ${C.accent}`,
  filter: "drop-shadow(0 0 22px rgba(212,255,63,0.22))",
};

/** Small mono kicker with a typed-on reveal. */
export const Kicker: React.FC<{
  text: string;
  delay?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, color = C.accent, style }) => {
  const frame = useCurrentFrame();
  const chars = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - delay) / 1.2)),
  );
  const caret = chars < text.length && frame >= delay;
  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color,
        minHeight: 30,
        ...style,
      }}
    >
      {text.slice(0, chars)}
      {caret ? <span style={{ opacity: 0.8 }}>▌</span> : null}
    </div>
  );
};

/** Dashed horizontal rule from the site's .hero-rule. */
export const DashRule: React.FC<{ width?: number | string; grow?: number }> = ({
  width = "100%",
  grow = 1,
}) => (
  <div
    style={{
      width,
      height: 1,
      transform: `scaleX(${grow})`,
      transformOrigin: "left",
      background: `repeating-linear-gradient(90deg, ${C.lineStrong} 0 10px, transparent 10px 18px)`,
    }}
  />
);
