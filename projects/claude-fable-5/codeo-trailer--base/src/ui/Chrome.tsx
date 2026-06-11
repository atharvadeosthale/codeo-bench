import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C, FONT_MONO } from "../theme";

/** Animated photographic grain — fresh turbulence seed every frame. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const seed = (frame % 97) + 1;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed={seed}
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-${seed})`}
        />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft vignette + the site's lime/red ambient gradients. */
export const Stage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: [
        "radial-gradient(1100px 540px at 50% -10%, rgba(212,255,63,0.06), transparent 62%)",
        "radial-gradient(900px 600px at 92% 112%, rgba(255,68,56,0.035), transparent 60%)",
        `linear-gradient(180deg, #0c0d09 0%, ${C.bg} 32%, ${C.bgDeep} 100%)`,
      ].join(", "),
    }}
  >
    {children}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 58%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);

/** Projector gate weave + exposure flutter. Wraps a whole scene. */
export const Gate: React.FC<{ children: React.ReactNode; amount?: number }> = ({
  children,
  amount = 1,
}) => {
  const frame = useCurrentFrame();
  const wx = (random(`wx-${Math.floor(frame / 2)}`) - 0.5) * 1.6 * amount;
  const wy = (random(`wy-${Math.floor(frame / 2)}`) - 0.5) * 1.2 * amount;
  const flutter = 1 + (random(`fl-${frame}`) - 0.5) * 0.025 * amount;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${wx.toFixed(2)}px, ${wy.toFixed(2)}px)`,
        filter: `brightness(${flutter.toFixed(3)})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const formatTimecode = (frame: number, fps: number) => {
  const ff = String(frame % fps).padStart(2, "0");
  const total = Math.floor(frame / fps);
  const ss = String(total % 60).padStart(2, "0");
  const mm = String(Math.floor(total / 60) % 60).padStart(2, "0");
  return `00:${mm}:${ss}:${ff}`;
};

/** Persistent screening-room HUD: timecode, reel id, hairline frame. */
export const HUD: React.FC<{ fps: number; showRec?: boolean }> = ({
  fps,
  showRec = false,
}) => {
  const frame = useCurrentFrame();
  const recOn = Math.floor(frame / 16) % 2 === 0;
  const label: React.CSSProperties = {
    fontFamily: FONT_MONO,
    fontSize: 17,
    letterSpacing: "0.18em",
    color: C.inkDim,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 28,
          border: `1px solid ${C.line}`,
        }}
      />
      <div style={{ ...label, position: "absolute", top: 44, left: 52 }}>
        CODEO&nbsp;BENCH
      </div>
      <div
        style={{
          ...label,
          position: "absolute",
          top: 44,
          right: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {showRec ? (
          <>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 99,
                background: C.rec,
                opacity: recOn ? 1 : 0.25,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.88)" }}>REC</span>
          </>
        ) : (
          <span>REEL&nbsp;01</span>
        )}
      </div>
      <div style={{ ...label, position: "absolute", bottom: 44, left: 52 }}>
        BENCHMARK&nbsp;V1
      </div>
      <div
        style={{
          ...label,
          position: "absolute",
          bottom: 44,
          right: 52,
          color: C.accent,
        }}
      >
        {formatTimecode(frame, fps)}
      </div>
    </AbsoluteFill>
  );
};
