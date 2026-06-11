import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { colors as C, fonts } from "./theme";

type EasingFn = (t: number) => number;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_INOUT = Easing.bezier(0.45, 0, 0.55, 1);
export const EASE_IN = Easing.in(Easing.cubic);
export const POP = Easing.bezier(0.34, 1.56, 0.64, 1);

// Normalized eased progress: 0 → 1 between `start` and `start + dur`.
export const ez = (
  frame: number,
  start: number,
  dur: number,
  easing: EasingFn = EASE_OUT,
): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ---------------------------------------------------------------------------
// Background: gradient base, drifting glows, grid, floating particles, vignette
// ---------------------------------------------------------------------------

export const Background: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const g1x = 30 + Math.sin((frame + seed * 90) / 220) * 8;
  const g1y = 22 + Math.cos((frame + seed * 90) / 260) * 6;
  const g2x = 74 - Math.sin((frame + seed * 50) / 240) * 7;
  const g2y = 80 + Math.cos((frame + seed * 50) / 200) * 5;

  const particles = Array.from({ length: 36 }, (_, i) => {
    const px = random(`px-${i}`) * 1920;
    const speed = 0.12 + random(`ps-${i}`) * 0.25;
    const py = (random(`py-${i}`) * 1180 - frame * speed) % 1180;
    const size = 1.5 + random(`pz-${i}`) * 2.5;
    const tw = 0.25 + 0.35 * Math.sin(frame / 20 + i * 1.7) ** 2;
    return { x: px, y: py < 0 ? py + 1180 : py, size, tw };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(900px 700px at ${g1x}% ${g1y}%, rgba(97,218,251,0.10), transparent 70%),
            radial-gradient(800px 650px at ${g2x}% ${g2y}%, rgba(167,139,250,0.09), transparent 70%),
            linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 100%)
          `,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <pattern id="grid" width={80} height={80} patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={C.grid} strokeWidth={1} />
          </pattern>
        </defs>
        <rect width={1920} height={1080} fill="url(#grid)" />
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={C.accent} opacity={p.tw * 0.4} />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 60%, rgba(2,4,9,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene shell: chip + animated title, content slot
// ---------------------------------------------------------------------------

export const SceneShell: React.FC<{
  index: string;
  kicker: string;
  title: string;
  seed?: number;
  children?: React.ReactNode;
}> = ({ index, kicker, title, seed, children }) => {
  const frame = useCurrentFrame();
  const chipP = ez(frame, 4, 24);
  const words = title.split(" ");

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display }}>
      <Background seed={seed} />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 70,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: chipP,
          transform: `translateX(${(1 - chipP) * -30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 24,
            fontWeight: 700,
            color: C.accent,
            border: `1px solid ${C.panelBorder}`,
            borderRadius: 8,
            padding: "6px 14px",
            background: "rgba(97,218,251,0.06)",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 22,
            letterSpacing: 6,
            color: C.muted,
          }}
        >
          {kicker}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 128,
          fontSize: 72,
          fontWeight: 700,
          color: C.text,
          letterSpacing: -1,
        }}
      >
        {words.map((w, i) => {
          const p = ez(frame, 10 + i * 4, 30);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 20,
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {children}
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 28);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          maxWidth: 1400,
          padding: "16px 32px",
          borderRadius: 14,
          background: "rgba(7, 11, 22, 0.7)",
          border: `1px solid rgba(97,218,251,0.10)`,
        }}
      >
        <div style={{ width: 5, height: 36, borderRadius: 3, background: C.accent }} />
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 31,
            fontWeight: 500,
            color: C.text,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const Chip: React.FC<{
  at: number;
  color?: string;
  x: number;
  y: number;
  mono?: boolean;
  fontSize?: number;
  children: React.ReactNode;
}> = ({ at, color = C.accent, x, y, mono = true, fontSize = 24, children }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 22, POP);
  const o = ez(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.7 + p * 0.3})`,
        opacity: o,
        fontFamily: mono ? fonts.mono : fonts.display,
        fontSize,
        fontWeight: 700,
        color,
        background: "rgba(7, 11, 22, 0.85)",
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 24px ${color}33`,
        borderRadius: 12,
        padding: "10px 22px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tree primitives
// ---------------------------------------------------------------------------

export const TreeNode: React.FC<{
  x: number;
  y: number;
  label: string;
  sub?: string;
  color?: string;
  at: number;
  frame: number;
  dim?: number; // 0..1 extra dimming
  flash?: number; // 0..1 glow boost
  fontSize?: number;
}> = ({ x, y, label, sub, color = C.accent, at, frame, dim = 0, flash = 0, fontSize = 26 }) => {
  const p = ez(frame, at, 26, POP);
  const o = ez(frame, at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.6 + p * 0.4})`,
        opacity: o * (1 - dim * 0.6),
        background: "rgba(10, 15, 30, 0.92)",
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 ${18 + flash * 30}px ${color}${flash > 0.05 ? "88" : "2e"}`,
        borderRadius: 12,
        padding: sub ? "10px 22px" : "12px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize,
          fontWeight: 700,
          color,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: fontSize * 0.62,
            color: C.muted,
            marginTop: 2,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// SVG path edge with draw-on animation. Render inside an <svg>.
export const Edge: React.FC<{
  from: [number, number];
  to: [number, number];
  at: number;
  frame: number;
  color?: string;
  width?: number;
  dur?: number;
}> = ({ from, to, at, frame, color = C.line, width = 2.5, dur = 20 }) => {
  const p = ez(frame, at, dur, EASE_INOUT);
  const dy = to[1] - from[1];
  const d = `M ${from[0]} ${from[1]} C ${from[0]} ${from[1] + dy * 0.55}, ${to[0]} ${
    to[1] - dy * 0.55
  }, ${to[0]} ${to[1]}`;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) * 1.25;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
};

// Horizontal animated arrow with head, as standalone SVG.
export const FlowArrow: React.FC<{
  x: number;
  y: number;
  length: number;
  at: number;
  color?: string;
  dur?: number;
}> = ({ x, y, length, at, color = C.accent, dur = 18 }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, dur, EASE_INOUT);
  const headO = ez(frame, at + dur - 6, 8);
  return (
    <svg
      width={length + 24}
      height={40}
      style={{ position: "absolute", left: x, top: y - 20 }}
    >
      <line
        x1={4}
        y1={20}
        x2={4 + length * p}
        y2={20}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d={`M ${length - 8} 8 L ${length + 8} 20 L ${length - 8} 32`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={headO}
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// React atom logo, drawn on + orbiting electrons
// ---------------------------------------------------------------------------

export const ReactLogo: React.FC<{
  size: number;
  at: number;
  color?: string;
  spinSpeed?: number;
}> = ({ size, at, color = C.accent, spinSpeed = 0.035 }) => {
  const frame = useCurrentFrame();
  const draw = ez(frame, at, 55, EASE_INOUT);
  const nucleus = ez(frame, at + 35, 22, POP);
  const rx = size * 0.46;
  const ry = size * 0.175;
  const rots = [0, 60, 120];

  const electrons = rots.map((rot, i) => {
    const t = frame * spinSpeed + (i * Math.PI * 2) / 3;
    const x0 = rx * Math.cos(t);
    const y0 = ry * Math.sin(t);
    const r = (rot * Math.PI) / 180;
    return {
      x: x0 * Math.cos(r) - y0 * Math.sin(r),
      y: x0 * Math.sin(r) + y0 * Math.cos(r),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
    >
      {rots.map((rot) => (
        <ellipse
          key={rot}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot})`}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.013}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          opacity={0.9}
        />
      ))}
      <circle r={size * 0.05 * nucleus} fill={color} opacity={nucleus} />
      <circle r={size * 0.1 * nucleus} fill={color} opacity={nucleus * 0.18} />
      {electrons.map((e, i) => (
        <g key={i} opacity={draw}>
          <circle cx={e.x} cy={e.y} r={size * 0.035} fill={color} opacity={0.25} />
          <circle cx={e.x} cy={e.y} r={size * 0.017} fill="#fff" />
        </g>
      ))}
    </svg>
  );
};
