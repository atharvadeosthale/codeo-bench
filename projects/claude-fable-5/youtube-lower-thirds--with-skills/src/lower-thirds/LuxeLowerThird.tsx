import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ramp } from "../easing";
import { mono, serif } from "../fonts";

const GOLD = "#d9b97c";

// 05 — Gold luxe: hairlines from center, letter-by-letter blur reveal,
// shimmering gradient fill across the serif name.
export const LuxeLowerThird: React.FC<{
  name?: string;
  role?: string;
}> = ({ name = "Isabelle Moreau", role = "EXECUTIVE CHEF · LUMIÈRE PARIS" }) => {
  const frame = useCurrentFrame();

  const topLine = ramp(frame, 4, 24);
  const bottomLine = ramp(frame, 10, 24);
  const ornamentIn = ramp(frame, 0, 18);
  const roleIn = ramp(frame, 44, 20);

  const shimmer = interpolate(frame, [60, 110], [-20, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shimmerLayer = ramp(frame, 50, 10);

  const hairline = (progress: number): React.CSSProperties => ({
    height: 1.5,
    width: 660,
    background: `linear-gradient(90deg, transparent, ${GOLD} 30%, #f4e3c2 50%, ${GOLD} 70%, transparent)`,
    transformOrigin: "center",
    transform: `scaleX(${progress})`,
    opacity: 0.9,
  });

  const letters = name.split("");

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        bottom: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 700,
      }}
    >
      <div style={hairline(topLine)} />

      <div
        style={{
          margin: "10px 0 6px",
          fontSize: 20,
          color: GOLD,
          opacity: ornamentIn,
          transform: `rotate(${(1 - ornamentIn) * 90}deg) scale(${0.5 + ornamentIn * 0.5})`,
        }}
      >
        ✦
      </div>

      <div style={{ position: "relative" }}>
        {/* entrance layer: per-letter blur reveal in solid gold */}
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 72,
            lineHeight: 1.15,
            whiteSpace: "pre",
            display: "flex",
            color: "#ecd5a4",
            opacity: 1 - shimmerLayer,
          }}
        >
          {letters.map((ch, i) => {
            const p = ramp(frame, 12 + i * 1.6, 20);
            return (
              <span
                key={i}
                style={{
                  opacity: p,
                  filter: `blur(${(1 - p) * 9}px)`,
                  transform: `translateY(${(1 - p) * 20}px)`,
                  display: "inline-block",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {/* settled layer: single element so background-clip works, with shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 72,
            lineHeight: 1.15,
            whiteSpace: "pre",
            backgroundImage: `linear-gradient(105deg, #ecd5a4 0%, #f7ecd4 ${shimmer - 12}%, #ffffff ${shimmer}%, #f7ecd4 ${shimmer + 12}%, #ecd5a4 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: shimmerLayer,
          }}
        >
          {name}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: mono,
          fontSize: 19,
          letterSpacing: "0.42em",
          color: "rgba(217,185,124,0.85)",
          opacity: roleIn,
          transform: `translateY(${(1 - roleIn) * 12}px)`,
          textIndent: "0.42em",
        }}
      >
        {role}
      </div>

      <div style={{ marginTop: 18, ...hairline(bottomLine) }} />
    </div>
  );
};
