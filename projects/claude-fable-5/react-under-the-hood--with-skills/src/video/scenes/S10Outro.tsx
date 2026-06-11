import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { Background, ReactLogo, ez, EASE_INOUT, POP } from "../ui";

const STAGES = [
  { label: "JSX", color: C.yellow },
  { label: "Elements", color: C.accent },
  { label: "Fiber tree", color: C.violet },
  { label: "Diff", color: C.orange },
  { label: "Commit", color: C.green },
  { label: "Pixels", color: "#FFFFFF" },
];

const PIPE_Y = 400;
const X0 = 210;
const X1 = 1710;

export const S10Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const xs = STAGES.map((_, i) => X0 + ((X1 - X0) / (STAGES.length - 1)) * i);

  const pulseX = interpolate(frame, [30, 180], [X0, X1], {
    easing: EASE_INOUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineP = ez(frame, 20, 150, EASE_INOUT);
  const kickerP = ez(frame, 8, 24);
  const t1 = ez(frame, 195, 30);
  const t2 = ez(frame, 218, 30);
  const logoP = ez(frame, 240, 24);
  const fadeOut = interpolate(frame, [300, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display, opacity: fadeOut }}>
      <Background seed={10} />

      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kickerP,
          fontFamily: fonts.mono,
          fontSize: 24,
          letterSpacing: 8,
          color: C.muted,
        }}
      >
        THE WHOLE PIPELINE
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={X0}
          y1={PIPE_Y}
          x2={X0 + (X1 - X0) * lineP}
          y2={PIPE_Y}
          stroke={C.line}
          strokeWidth={2}
        />
        {frame > 30 && frame < 185 ? (
          <>
            <circle cx={pulseX} cy={PIPE_Y} r={7} fill="#fff" />
            <circle cx={pulseX} cy={PIPE_Y} r={16} fill="#fff" opacity={0.2} />
          </>
        ) : null}
      </svg>

      {STAGES.map((s, i) => {
        const lit = pulseX >= xs[i] - 4;
        const litP = ez(frame, 30 + (150 / (STAGES.length - 1)) * i, 14, POP);
        const baseP = ez(frame, 12 + i * 6, 20);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xs[i],
              top: PIPE_Y,
              transform: `translate(-50%, -50%) scale(${1 + (lit ? litP * 0.08 : 0)})`,
              opacity: baseP,
              fontFamily: fonts.mono,
              fontSize: 27,
              fontWeight: 700,
              color: lit ? s.color : C.faint,
              background: "rgba(7, 11, 22, 0.92)",
              border: `2px solid ${lit ? s.color : "rgba(139,151,172,0.3)"}`,
              boxShadow: lit ? `0 0 28px ${s.color}55` : "none",
              borderRadius: 14,
              padding: "14px 28px",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </div>
        );
      })}

      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: C.text,
            opacity: t1,
            transform: `translateY(${(1 - t1) * 30}px)`,
          }}
        >
          Declarative on the outside.
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: C.accent,
            marginTop: 8,
            opacity: t2,
            transform: `translateY(${(1 - t2) * 30}px)`,
            textShadow: "0 0 50px rgba(97,218,251,0.35)",
          }}
        >
          A scheduler underneath.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 905,
          transform: "translate(-50%, -50%)",
          opacity: logoP,
        }}
      >
        <ReactLogo size={130} at={240} spinSpeed={0.05} />
      </div>
    </AbsoluteFill>
  );
};
