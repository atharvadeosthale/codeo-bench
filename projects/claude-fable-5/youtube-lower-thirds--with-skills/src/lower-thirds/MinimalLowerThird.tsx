import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, ramp } from "../easing";
import { mono, sora } from "../fonts";

// 04 — Editorial minimal: drawn rule, masked rise, tracking that settles.
export const MinimalLowerThird: React.FC<{
  name?: string;
  role?: string;
  location?: string;
}> = ({ name = "JONAS LIND", role = "Documentary Filmmaker", location = "OSLO, NORWAY" }) => {
  const frame = useCurrentFrame();

  const ruleIn = ramp(frame, 0, 22, EASE_IN_OUT);
  const nameIn = ramp(frame, 10, 24);
  const trackIn = ramp(frame, 10, 34, EASE_IN_OUT);
  const roleIn = ramp(frame, 30, 18);
  const locIn = ramp(frame, 38, 18);

  const letterSpacing = interpolate(trackIn, [0, 1], [0.42, 0.08]);
  const ink = "#1a1714";

  return (
    <div style={{ position: "absolute", left: 110, bottom: 150 }}>
      {/* rule + rotating accent */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            border: `2px solid ${ink}`,
            transform: `rotate(${45 + frame * 0.6}deg)`,
            opacity: ruleIn,
          }}
        />
        <div
          style={{
            height: 2,
            width: 360,
            backgroundColor: ink,
            transformOrigin: "left",
            transform: `scaleX(${ruleIn})`,
          }}
        />
      </div>

      {/* masked name */}
      <div style={{ overflow: "hidden", marginTop: 22, height: 74 }}>
        <div
          style={{
            fontFamily: sora,
            fontWeight: 600,
            fontSize: 58,
            lineHeight: "74px",
            color: ink,
            letterSpacing: `${letterSpacing}em`,
            transform: `translateY(${(1 - nameIn) * 80}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 22,
          marginTop: 12,
        }}
      >
        <span
          style={{
            fontFamily: sora,
            fontWeight: 400,
            fontSize: 27,
            color: "rgba(26,23,20,0.72)",
            opacity: roleIn,
            transform: `translateY(${(1 - roleIn) * 14}px)`,
            display: "inline-block",
          }}
        >
          {role}
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.26em",
            color: "rgba(26,23,20,0.48)",
            opacity: locIn,
            transform: `translateY(${(1 - locIn) * 10}px)`,
            display: "inline-block",
          }}
        >
          {location}
        </span>
      </div>
    </div>
  );
};
