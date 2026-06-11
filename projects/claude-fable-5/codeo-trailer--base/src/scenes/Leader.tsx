import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_MONO, FONT_SANS } from "../theme";

const PER_NUMBER = 24;

/** Pie wedge sweeping like an academy-leader wiper. */
const Wiper: React.FC<{ progress: number; size: number }> = ({
  progress,
  size,
}) => {
  const r = size / 2;
  const angle = progress * 360;
  const a = ((angle - 90) * Math.PI) / 180;
  const x = r + r * Math.cos(a);
  const y = r + r * Math.sin(a);
  const large = angle > 180 ? 1 : 0;
  if (angle <= 0.5) return null;
  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0 }}
      viewBox={`0 0 ${size} ${size}`}
    >
      <path
        d={`M ${r} ${r} L ${r} 0 A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`}
        fill="rgba(238,240,226,0.085)"
      />
      <line
        x1={r}
        y1={r}
        x2={x}
        y2={y}
        stroke="rgba(238,240,226,0.4)"
        strokeWidth={2}
      />
    </svg>
  );
};

export const Leader: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const countdownEnd = PER_NUMBER * 3;
  const idx = Math.min(2, Math.floor(frame / PER_NUMBER));
  const number = 3 - idx;
  const local = frame - idx * PER_NUMBER;
  const sweep = Math.min(1, local / PER_NUMBER);

  // tail: hard white pop, then black before the first cut
  const inTail = frame >= countdownEnd;
  const pop = inTail && frame < countdownEnd + 2;

  // dirty-print artifacts
  const jitterY = (random(`ly-${frame}`) - 0.5) * 6;
  const exposure = 0.92 + random(`le-${frame}`) * 0.16;
  const hair = random(`h-${Math.floor(frame / 7)}`) > 0.72;

  const RING = 560;

  if (inTail) {
    return (
      <AbsoluteFill style={{ background: pop ? "#dadcc9" : "#000" }}>
        {!pop && frame < durationInFrames - 2 ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: FONT_MONO,
              fontSize: 20,
              letterSpacing: "0.5em",
              color: C.inkFaint,
            }}
          >
            PICTURE&nbsp;START
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: "#101208",
        filter: `brightness(${exposure.toFixed(3)}) contrast(1.04)`,
      }}
    >
      <AbsoluteFill style={{ transform: `translateY(${jitterY.toFixed(1)}px)` }}>
        {/* full-frame crosshair */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: "rgba(238,240,226,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 1,
            background: "rgba(238,240,226,0.22)",
          }}
        />

        {/* ring + wiper + number */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: RING,
            height: RING,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Wiper progress={sweep} size={RING} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              border: "2px solid rgba(238,240,226,0.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 52,
              borderRadius: 999,
              border: "1px solid rgba(238,240,226,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_SANS,
              fontWeight: 800,
              fontSize: 330,
              lineHeight: 1,
              color: C.ink,
              transform: `scale(${interpolate(local, [0, 3], [1.06, 1], {
                extrapolateRight: "clamp",
              })})`,
            }}
          >
            {number}
          </div>
        </div>

        {/* leader markings */}
        {(
          [
            ["CODEO BENCH · SCREENING LEADER", { top: 92 }],
            ["35MM EQUIV · 1920×1080 · 30 FPS", { bottom: 92 }],
          ] as const
        ).map(([text, pos]) => (
          <div
            key={text}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: FONT_MONO,
              fontSize: 19,
              letterSpacing: "0.34em",
              color: C.inkDim,
              ...pos,
            }}
          >
            {text}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 120,
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: FONT_MONO,
            fontSize: 16,
            letterSpacing: "0.3em",
            color: C.inkFaint,
          }}
        >
          HEAD&nbsp;LEADER
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 120,
            transform: "translateY(-50%) rotate(90deg)",
            fontFamily: FONT_MONO,
            fontSize: 16,
            letterSpacing: "0.3em",
            color: C.inkFaint,
          }}
        >
          REEL&nbsp;01
        </div>

        {/* print hairline */}
        {hair ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(random(`hx-${Math.floor(frame / 7)}`) * 80 + 10).toFixed(1)}%`,
              width: 1.5,
              background: "rgba(238,240,226,0.13)",
            }}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
