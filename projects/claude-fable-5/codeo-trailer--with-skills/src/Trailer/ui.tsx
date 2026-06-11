import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { BRIEF, FPS, JUDGE, REEL, SLAM1, ST1, TITLE } from "./timeline";
import { C, CLAMP, EASE_OUT, MONO } from "./theme";

// Same fractal-noise tile the site uses for its film grain, jittered
// per frame so it crawls like real grain instead of sitting still.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.floor(random(`grain-x-${frame}`) * 160);
  const y = Math.floor(random(`grain-y-${frame}`) * 160);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundPosition: `${x}px ${y}px`,
        opacity: 0.065,
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      boxShadow: "inset 0 0 320px rgba(0, 0, 0, 0.6)",
      pointerEvents: "none",
    }}
  />
);

export const SceneBg: React.FC<{ glowX?: number }> = ({ glowX = 50 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(1100px 540px at ${glowX}% -10%, rgba(212, 255, 63, 0.07), transparent 62%), radial-gradient(900px 600px at 92% 112%, rgba(255, 68, 56, 0.04), transparent 60%), linear-gradient(180deg, #0c0d09 0%, ${C.bg} 32%, ${C.bgDeep} 100%)`,
    }}
  />
);

// Reveal children by sliding them up out of an overflow-hidden mask.
export const MaskRise: React.FC<{
  at: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, dur = 20, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    easing: EASE_OUT,
    ...CLAMP,
  });
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 112}%)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

export const FadeUp: React.FC<{
  at: number;
  dur?: number;
  dy?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, dur = 18, dy = 22, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    easing: EASE_OUT,
    ...CLAMP,
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * dy}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const kickerStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 19,
  fontWeight: 500,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: C.accent,
};

export const monoLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 17,
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: C.inkDim,
};

const Timecode: React.FC = () => {
  const frame = useCurrentFrame();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ff = frame % FPS;
  const total = Math.floor(frame / FPS);
  const ss = total % 60;
  const mm = Math.floor(total / 60) % 60;
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 18,
        letterSpacing: "0.14em",
        color: C.accent,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      00:{pad(mm)}:{pad(ss)}:{pad(ff)}
    </span>
  );
};

const MARKERS: Array<[number, string]> = [
  [TITLE.from, "CODEO BENCH — V1"],
  [JUDGE.from, "REEL 04 — THE VERDICT"],
  [SLAM1.from, "REEL 03 — THE PROTOCOL"],
  [REEL.from, "REEL 02 — THE TAKES"],
  [BRIEF.from, "REEL 01 — THE BRIEF"],
  [ST1.from, "REEL 00 — THE PREMISE"],
];

const BAR_H = 56;

// Cinematic letterbox bars that double as the camera-furniture rail:
// slate info up top, scene marker + running timecode below.
export const Letterbox: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < ST1.from) {
    return null;
  }
  const fade = interpolate(frame, [1096, 1122], [1, 0], CLAMP);
  const marker = MARKERS.find(([from]) => frame >= from)?.[1] ?? "";
  const barStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: BAR_H,
    background: "#020302",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: 44,
  };
  const recOn = frame % 22 < 13;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...barStyle, top: 0, borderBottom: `1px solid ${C.line}` }}>
        <span style={{ ...monoLabel, opacity: fade }}>
          CODEO BENCH — OFFICIAL TRAILER
        </span>
        <span style={{ ...monoLabel, opacity: fade }}>
          V1 · REMOTION 4.0.475
        </span>
      </div>
      <div style={{ ...barStyle, bottom: 0, borderTop: `1px solid ${C.line}` }}>
        <span style={{ ...monoLabel, opacity: fade }}>{marker}</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: fade,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: C.rec,
              opacity: recOn ? 1 : 0.25,
            }}
          />
          <Timecode />
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const LETTERBOX_H = BAR_H;
