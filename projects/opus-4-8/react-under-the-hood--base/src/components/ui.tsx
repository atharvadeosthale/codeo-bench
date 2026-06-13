import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";
import { hexA } from "./Background";
import { fadeUp, ramp, springIn } from "./anim";

// ── Scene heading (kicker + title) ─────────────────────────────
export const SceneHeading: React.FC<{
  kicker: string;
  title: React.ReactNode;
  accent?: string;
  delay?: number;
}> = ({ kicker, title, accent = COLORS.react, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = fadeUp(frame, fps, delay);
  const b = fadeUp(frame, fps, delay + 6);
  const line = ramp(frame, delay + 8, delay + 26);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          ...a,
          fontFamily: FONT.mono,
          fontSize: 24,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: accent,
          fontWeight: 600,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          ...b,
          fontFamily: FONT.sans,
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.05,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: 4,
          width: interpolate(line, [0, 1], [0, 220]),
          borderRadius: 4,
          background: `linear-gradient(90deg, ${accent}, ${hexA(accent, 0)})`,
          boxShadow: `0 0 18px ${hexA(accent, 0.7)}`,
        }}
      />
    </div>
  );
};

// ── Glass panel ────────────────────────────────────────────────
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
  glow?: number;
}> = ({ children, style, accent = COLORS.react, glow = 0.4 }) => (
  <div
    style={{
      background: COLORS.panel,
      backdropFilter: "blur(6px)",
      border: `1px solid ${hexA(accent, 0.35)}`,
      borderRadius: 18,
      boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 40px ${hexA(accent, glow * 0.4)}, inset 0 1px 0 ${hexA("#ffffff", 0.05)}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// ── Chip / token badge ─────────────────────────────────────────
export const Chip: React.FC<{
  label: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ label, color = COLORS.react, style }) => (
  <span
    style={{
      fontFamily: FONT.mono,
      fontSize: 18,
      fontWeight: 600,
      color,
      padding: "6px 14px",
      borderRadius: 999,
      border: `1px solid ${hexA(color, 0.5)}`,
      background: hexA(color, 0.1),
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {label}
  </span>
);

// ── Syntax-highlighted code ────────────────────────────────────
export type Tok = { t: string; c?: keyof typeof SYN };
const SYN = {
  tag: COLORS.synTag,
  attr: COLORS.synAttr,
  str: COLORS.synStr,
  kw: COLORS.synKw,
  fn: COLORS.synFn,
  punct: COLORS.synPunct,
  comment: COLORS.synComment,
  plain: COLORS.text,
  cyan: COLORS.react,
  pink: COLORS.change,
};

export const Code: React.FC<{
  lines: Tok[][];
  fontSize?: number;
  // reveal lines progressively: frame at which each line appears
  revealStart?: number;
  revealStep?: number;
  highlightLine?: number;
  style?: React.CSSProperties;
}> = ({
  lines,
  fontSize = 26,
  revealStart,
  revealStep = 6,
  highlightLine,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize,
        lineHeight: 1.65,
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const reveal =
          revealStart === undefined
            ? { opacity: 1, transform: "none" }
            : fadeUp(frame, fps, revealStart + i * revealStep, 10);
        const isHi = highlightLine === i;
        return (
          <div
            key={i}
            style={{
              ...reveal,
              display: "flex",
              alignItems: "baseline",
              padding: "1px 12px",
              borderRadius: 8,
              background: isHi ? hexA(COLORS.react, 0.12) : "transparent",
              boxShadow: isHi
                ? `inset 3px 0 0 ${COLORS.react}`
                : "none",
            }}
          >
            <span
              style={{
                color: COLORS.textFaint,
                width: 30,
                flexShrink: 0,
                userSelect: "none",
                fontSize: fontSize * 0.7,
              }}
            >
              {i + 1}
            </span>
            <span>
              {line.map((tok, j) => (
                <span key={j} style={{ color: SYN[tok.c ?? "plain"] }}>
                  {tok.t}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Tree node box (for component / DOM trees) ──────────────────
export const NodeBox: React.FC<{
  label: string;
  sub?: string;
  color?: string;
  appear?: number; // local frame when it appears
  width?: number;
  filled?: boolean;
  emphasis?: number; // 0..1 extra glow
}> = ({
  label,
  sub,
  color = COLORS.react,
  appear = 0,
  width = 150,
  filled = false,
  emphasis = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn(frame, fps, appear, 14);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        width,
        padding: "10px 8px",
        borderRadius: 12,
        textAlign: "center",
        background: filled ? hexA(color, 0.18) : COLORS.panelSolid,
        border: `2px solid ${color}`,
        boxShadow: `0 0 ${14 + emphasis * 26}px ${hexA(color, 0.4 + emphasis * 0.5)}`,
        fontFamily: FONT.mono,
      }}
    >
      <div style={{ color, fontSize: 22, fontWeight: 700 }}>{label}</div>
      {sub && (
        <div style={{ color: COLORS.textDim, fontSize: 14, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
};

// ── SVG connector line that "draws" itself ─────────────────────
export const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  draw: number; // 0..1
  width?: number;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, color = COLORS.reactDim, draw, width = 2.5, dashed }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? "6 8" : len}
      strokeDashoffset={dashed ? 0 : len * (1 - draw)}
      opacity={dashed ? draw : 1}
    />
  );
};

// A flowing particle along a line (data flow)
export const FlowDot: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t: number; // 0..1 position
  color?: string;
  r?: number;
}> = ({ x1, y1, x2, y2, t, color = COLORS.react, r = 5 }) => {
  const cx = interpolate(t, [0, 1], [x1, x2]);
  const cy = interpolate(t, [0, 1], [y1, y2]);
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    />
  );
};

export const Caption: React.FC<{
  children: React.ReactNode;
  accent?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, accent = COLORS.react, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...fadeUp(frame, fps, delay, 16),
        fontFamily: FONT.sans,
        fontSize: 30,
        lineHeight: 1.5,
        color: COLORS.textDim,
        maxWidth: 720,
        ...style,
      }}
    >
      <span style={{ color: accent, fontWeight: 700 }}>›</span>{" "}
      {children}
    </div>
  );
};
