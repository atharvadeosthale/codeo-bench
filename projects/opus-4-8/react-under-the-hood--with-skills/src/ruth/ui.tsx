import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_MONO, FONT_SANS, rand, SYNTAX } from "./theme";

// ----------------------------------------------------------------------------
// Animated backdrop: deep gradient, perspective grid, drifting code particles,
// and a slow rotating glow. Shared by every scene so the world feels continuous.
// ----------------------------------------------------------------------------
export const Background: React.FC<{ hue?: string }> = ({ hue = COLORS.react }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = React.useMemo(
    () =>
      new Array(46).fill(0).map((_, i) => ({
        x: rand(i) * width,
        y: rand(i + 99) * height,
        size: 1 + rand(i + 7) * 2.4,
        speed: 0.25 + rand(i + 31) * 0.8,
        glyph: ["{ }", "</>", "( )", "fn", "[ ]", "=>", "::", "<>"][i % 8],
        drift: rand(i + 5) * 60 - 30,
      })),
    [width, height],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* base vertical gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 8%, ${COLORS.bg2} 0%, ${COLORS.bg1} 42%, ${COLORS.bg0} 100%)`,
        }}
      />
      {/* perspective grid */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      >
        {new Array(28).fill(0).map((_, i) => {
          const x = (i / 27) * width;
          return (
            <line
              key={`v${i}`}
              x1={x}
              y1={0}
              x2={width / 2 + (x - width / 2) * 1.9}
              y2={height}
              stroke={COLORS.grid}
              strokeWidth={1}
            />
          );
        })}
        {new Array(16).fill(0).map((_, i) => {
          const t = i / 15;
          const y = height * (0.45 + 0.55 * t * t);
          return (
            <line
              key={`h${i}`}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={COLORS.grid}
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {/* rotating soft glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${
            50 + Math.sin(frame / 90) * 14
          }% ${30 + Math.cos(frame / 110) * 10}%, ${hue}22 0%, transparent 70%)`,
        }}
      />

      {/* drifting glyph particles */}
      {particles.map((p, i) => {
        const y = (p.y - frame * p.speed * 2) % (height + 80);
        const yy = y < -40 ? y + height + 80 : y;
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 22 + i));
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: p.x + Math.sin(frame / 50 + i) * p.drift * 0.2,
              top: yy,
              fontFamily: FONT_MONO,
              fontSize: 13 + p.size * 4,
              color: hue,
              opacity: 0.06 + tw * 0.1,
              fontWeight: 600,
            }}
          >
            {p.glyph}
          </span>
        );
      })}

      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 360px rgba(0,0,0,0.75)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene wrapper that fades/zooms its content in and out around its local frame.
export const SceneShell: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) },
  );
  const opacity = enter * exit;
  const scale = interpolate(enter, [0, 1], [0.965, 1]);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// Small kicker label shown above a heading.
export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
        fontFamily: FONT_MONO,
        fontSize: 22,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: COLORS.react,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 34,
          height: 2,
          background: COLORS.react,
          display: "inline-block",
          boxShadow: `0 0 12px ${COLORS.react}`,
        }}
      />
      {children}
    </div>
  );
};

// Big gradient heading with word-by-word rise.
export const Heading: React.FC<{
  text: string;
  delay?: number;
  size?: number;
}> = ({ text, delay = 0, size = 78 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <h1
      style={{
        fontFamily: FONT_SANS,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.04,
        letterSpacing: -1.5,
        margin: 0,
        color: COLORS.white,
        display: "flex",
        flexWrap: "wrap",
        gap: "0 18px",
      }}
    >
      {words.map((w, i) => {
        const d = delay + i * 5;
        const p = interpolate(frame, [d, d + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </h1>
  );
};

// Caption line at the lower third.
export const Caption: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accent?: string;
}> = ({ children, delay = 0, accent = COLORS.react }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 84,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 30px",
          borderRadius: 999,
          background: "rgba(10,16,28,0.72)",
          border: `1px solid ${COLORS.panelEdge}`,
          backdropFilter: "blur(6px)",
          fontFamily: FONT_SANS,
          fontSize: 30,
          fontWeight: 500,
          color: COLORS.white,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: 99,
            background: accent,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
        {children}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Code panel with window chrome + token-colored lines.
// ----------------------------------------------------------------------------
export type Tok = { t: string; c?: keyof typeof SYNTAX };
export type Line = Tok[];

export const tk = (t: string, c?: keyof typeof SYNTAX): Tok => ({ t, c });

export const CodePanel: React.FC<{
  title: string;
  lines: Line[];
  // number of characters revealed (for typewriter). Infinity => all.
  reveal?: number;
  width?: number;
  fontSize?: number;
  highlightLine?: number | null;
  glowLines?: number[];
  accent?: string;
}> = ({
  title,
  lines,
  reveal = Infinity,
  width = 760,
  fontSize = 26,
  highlightLine = null,
  glowLines = [],
  accent = COLORS.react,
}) => {
  let budget = reveal;
  return (
    <div
      style={{
        width,
        borderRadius: 16,
        background: "linear-gradient(180deg, #0c1322 0%, #090e1a 100%)",
        border: `1px solid ${COLORS.panelEdge}`,
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset",
        overflow: "hidden",
        fontFamily: FONT_MONO,
      }}
    >
      {/* chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 18px",
          borderBottom: `1px solid ${COLORS.panelEdge}`,
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <Dot c="#ff5f57" />
        <Dot c="#febc2e" />
        <Dot c="#28c840" />
        <span
          style={{
            marginLeft: 12,
            color: COLORS.muted,
            fontSize: 18,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ color: accent, fontSize: 16, opacity: 0.8 }}>{"</>"}</span>
      </div>

      <div style={{ padding: "22px 26px", fontSize, lineHeight: 1.62 }}>
        {lines.map((line, li) => {
          const isHi = highlightLine === li;
          const isGlow = glowLines.includes(li);
          return (
            <div
              key={li}
              style={{
                display: "flex",
                gap: 18,
                position: "relative",
                background: isHi ? `${accent}14` : "transparent",
                marginLeft: -26,
                marginRight: -26,
                paddingLeft: 26,
                paddingRight: 26,
                borderLeft: isHi
                  ? `3px solid ${accent}`
                  : "3px solid transparent",
              }}
            >
              <span
                style={{
                  color: COLORS.faint,
                  width: 22,
                  textAlign: "right",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {li + 1}
              </span>
              <span
                style={{
                  whiteSpace: "pre",
                  textShadow: isGlow ? `0 0 16px ${accent}` : "none",
                }}
              >
                {line.map((tok, ti) => {
                  const full = tok.t;
                  let shown = full;
                  if (budget !== Infinity) {
                    if (budget <= 0) shown = "";
                    else if (budget < full.length) shown = full.slice(0, budget);
                    budget -= full.length;
                  }
                  return (
                    <span
                      key={ti}
                      style={{ color: tok.c ? SYNTAX[tok.c] : SYNTAX.plain }}
                    >
                      {shown}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dot: React.FC<{ c: string }> = ({ c }) => (
  <span
    style={{
      width: 13,
      height: 13,
      borderRadius: 99,
      background: c,
      display: "inline-block",
    }}
  />
);

const lineLen = (l: Line) => l.reduce((a, b) => a + b.t.length, 0);

export const totalChars = (lines: Line[]) =>
  lines.reduce((a, l) => a + lineLen(l), 0);

// A glowing pill / chip used across diagrams.
export const Chip: React.FC<{
  label: string;
  color?: string;
  sub?: string;
  style?: React.CSSProperties;
  active?: boolean;
}> = ({ label, color = COLORS.react, sub, style, active = false }) => (
  <div
    style={{
      padding: sub ? "14px 22px" : "12px 22px",
      borderRadius: 14,
      background: active
        ? `linear-gradient(180deg, ${color}33, ${color}10)`
        : "linear-gradient(180deg, #0e1626, #0a0f1c)",
      border: `1.5px solid ${active ? color : COLORS.panelEdge}`,
      boxShadow: active ? `0 0 28px ${color}66` : "0 12px 30px rgba(0,0,0,0.4)",
      fontFamily: FONT_MONO,
      textAlign: "center",
      ...style,
    }}
  >
    <div style={{ color: active ? "#fff" : COLORS.white, fontSize: 26, fontWeight: 600 }}>
      {label}
    </div>
    {sub ? (
      <div style={{ color: COLORS.muted, fontSize: 16, marginTop: 3 }}>{sub}</div>
    ) : null}
  </div>
);
