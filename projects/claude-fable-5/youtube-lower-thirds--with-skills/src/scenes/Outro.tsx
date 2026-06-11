import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AuroraBackdrop } from "../backdrops/Backdrops";
import { ramp } from "../easing";
import { mono, sora } from "../fonts";

const STYLES: Array<{ label: string; accent: string }> = [
  { label: "01 FROSTED GLASS", accent: "#8b5cf6" },
  { label: "02 NEON PULSE", accent: "#22d3ee" },
  { label: "03 BREAKING NEWS", accent: "#e11d48" },
  { label: "04 EDITORIAL", accent: "#cbb88a" },
  { label: "05 GOLD LUXE", accent: "#d9b97c" },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const line1 = ramp(frame, 22, 24);
  const line2 = ramp(frame, 30, 24);
  const footer = ramp(frame, 52, 20);
  const fadeOut = ramp(frame, 96, 18);

  return (
    <AbsoluteFill>
      <AuroraBackdrop dim={0.62} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* style chips */}
        <div style={{ display: "flex", gap: 18, marginBottom: 56 }}>
          {STYLES.map((s, i) => {
            const p = ramp(frame, 4 + i * 4, 16);
            return (
              <div
                key={s.label}
                style={{
                  fontFamily: mono,
                  fontSize: 19,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.88)",
                  border: `1px solid ${s.accent}`,
                  borderRadius: 999,
                  padding: "9px 22px",
                  boxShadow: `0 0 16px ${s.accent}33`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </div>

        <div style={{ overflow: "hidden", height: 122 }}>
          <div
            style={{
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: "122px",
              color: "#fff",
              transform: `translateY(${(1 - line1) * 130}px)`,
            }}
          >
            FIVE STYLES.
          </div>
        </div>
        <div style={{ overflow: "hidden", height: 122 }}>
          <div
            style={{
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: "122px",
              backgroundImage:
                "linear-gradient(100deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              transform: `translateY(${(1 - line2) * 130}px)`,
            }}
          >
            INFINITE STORIES.
          </div>
        </div>

        <div
          style={{
            marginTop: 54,
            fontFamily: mono,
            fontSize: 21,
            letterSpacing: "0.32em",
            textIndent: "0.32em",
            color: "rgba(255,255,255,0.55)",
            opacity: footer,
            transform: `translateY(${(1 - footer) * 12}px)`,
          }}
        >
          BUILT WITH REMOTION · 1920×1080 · 30FPS
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: fadeOut, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
