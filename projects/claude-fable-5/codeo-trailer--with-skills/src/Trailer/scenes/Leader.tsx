import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, CLAMP, MONO, SANS } from "../theme";
import { monoLabel } from "../ui";

const RING = 560;

const corner: React.CSSProperties = {
  ...monoLabel,
  position: "absolute",
  fontSize: 16,
};

// Academy-leader countdown (3… 2…) with a rotating sweep, then a
// flickering "CODEO BENCH PRESENTS" card. Hard cut out.
export const Leader: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 60) {
    const num = frame < 30 ? "3" : "2";
    const sweep = ((frame % 30) / 30) * 360;
    const flash = interpolate(frame, [30, 32], [0.25, 0], CLAMP);
    return (
      <AbsoluteFill
        style={{
          background: C.bgDeep,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* faint scanlines */}
        <AbsoluteFill
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent 0 3px, rgba(238, 240, 226, 0.02) 3px 4px)",
          }}
        />
        {/* crosshair */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: C.line,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 1,
            background: C.line,
          }}
        />
        {/* sweep wedge clipped to the outer circle */}
        <div
          style={{
            position: "absolute",
            width: RING,
            height: RING,
            borderRadius: "50%",
            overflow: "hidden",
            border: `1px solid ${C.lineStrong}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `conic-gradient(from ${sweep}deg, rgba(212, 255, 63, 0.13) 0deg 52deg, transparent 52deg)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: RING - 130,
            height: RING - 130,
            borderRadius: "50%",
            border: `1px solid ${C.line}`,
          }}
        />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 330,
            lineHeight: 1,
            color: C.ink,
            position: "relative",
          }}
        >
          {num}
        </div>
        <span style={{ ...corner, top: 42, left: 48 }}>CODEO BENCH</span>
        <span style={{ ...corner, top: 42, right: 48 }}>OFFICIAL TRAILER</span>
        <span style={{ ...corner, bottom: 42, left: 48 }}>
          1920 × 1080 / 30 FPS
        </span>
        <span style={{ ...corner, bottom: 42, right: 48 }}>LEADER</span>
        <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      </AbsoluteFill>
    );
  }

  const local = frame - 60;
  const dip = random(`leader-flicker-${frame}`);
  const flicker = dip < 0.08 ? 0.45 : 0.92 + random(`leader-base-${frame}`) * 0.08;
  const inOp = interpolate(local, [0, 8], [0, 1], CLAMP);
  const spread = interpolate(local, [0, 44], [0.3, 0.55], CLAMP);
  return (
    <AbsoluteFill
      style={{
        background: C.bgDeep,
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div
        style={{
          opacity: inOp * flicker,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          CODEO
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 38,
              letterSpacing: "0.18em",
              padding: "10px 22px",
              color: C.bg,
              background: C.accent,
              borderRadius: 6,
              transform: "translateY(-12px)",
            }}
          >
            BENCH
          </span>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: `${spread}em`,
            textTransform: "uppercase",
            color: C.inkDim,
          }}
        >
          presents
        </div>
      </div>
    </AbsoluteFill>
  );
};
