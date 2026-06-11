import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Animated film grain — re-seeded noise every other frame, blended softly. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 40;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Hard white pop at the head of a cut — classic trailer punctuation. */
export const CutFlash: React.FC<{ color?: string }> = ({ color = "#fff" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0.85, 0], {
    extrapolateRight: "clamp",
  });
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity, pointerEvents: "none" }} />;
};

/**
 * YouTube-flavoured chrome: red progress bar with scrubber tracking the whole
 * video, plus a faint channel watermark. Grounds the "YouTube" framing.
 */
export const YouTubeChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 90,
          background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 5,
          background: "rgba(255,255,255,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress * 100 + 12}%`,
            background: "rgba(255,255,255,0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress * 100}%`,
            background: "#ff0033",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${progress * 100}%`,
            top: "50%",
            width: 16,
            height: 16,
            borderRadius: 8,
            background: "#ff0033",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 12px rgba(255,0,51,0.8)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 36,
          bottom: 28,
          width: 52,
          height: 52,
          borderRadius: 14,
          opacity: 0.4,
          border: "2px solid rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 1,
        }}
      >
        LT
      </div>
    </AbsoluteFill>
  );
};
