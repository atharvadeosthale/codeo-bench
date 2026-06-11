import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AuroraBackdrop } from "../backdrops/Backdrops";
import { EASE_IN_OUT, ramp } from "../easing";
import { mono, sora } from "../fonts";

const MaskedWord: React.FC<{
  word: string;
  start: number;
  gradient?: boolean;
}> = ({ word, start, gradient = false }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 26);

  return (
    <div style={{ overflow: "hidden", height: 170 }}>
      <div
        style={{
          fontFamily: sora,
          fontWeight: 800,
          fontSize: 172,
          lineHeight: "170px",
          letterSpacing: "-0.01em",
          transform: `translateY(${(1 - p) * 185}px)`,
          ...(gradient
            ? {
                backgroundImage:
                  "linear-gradient(100deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : { color: "#ffffff" }),
        }}
      >
        {word}
      </div>
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const kicker = ramp(frame, 4, 18);
  const footer = ramp(frame, 42, 20);
  const zoom = 1 + frame * 0.0008;

  const counter = Math.round(
    interpolate(frame, [44, 70], [1, 5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT,
    }),
  );

  return (
    <AbsoluteFill>
      <AuroraBackdrop dim={0.45} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 24,
            letterSpacing: "0.55em",
            textIndent: "0.55em",
            color: "rgba(255,255,255,0.65)",
            marginBottom: 38,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 14}px)`,
          }}
        >
          A COMPONENT SHOWCASE
        </div>

        <div style={{ textAlign: "center" }}>
          <MaskedWord word="LOWER" start={12} />
          <MaskedWord word="THIRDS" start={20} gradient />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginTop: 48,
            opacity: footer,
            transform: `translateY(${(1 - footer) * 16}px)`,
          }}
        >
          <div style={{ height: 1, width: 90, backgroundColor: "rgba(255,255,255,0.35)" }} />
          <span
            style={{
              fontFamily: mono,
              fontSize: 22,
              letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            0{counter} STYLES · BUILT IN REMOTION
          </span>
          <div style={{ height: 1, width: 90, backgroundColor: "rgba(255,255,255,0.35)" }} />
        </div>
      </AbsoluteFill>

      {/* fade from black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: 1 - ramp(frame, 0, 14),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
