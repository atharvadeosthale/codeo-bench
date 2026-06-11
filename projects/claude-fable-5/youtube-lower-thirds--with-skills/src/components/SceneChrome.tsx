import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, ramp } from "../easing";
import { mono, sora } from "../fonts";

// Shared per-scene dressing: typed corner label, ghost index numeral,
// and a faux YouTube player bar to ground the lower thirds in context.
export const SceneChrome: React.FC<{
  index: string;
  title: string;
  accent: string;
  sceneDuration: number;
  light?: boolean;
}> = ({ index, title, accent, sceneDuration, light = false }) => {
  const frame = useCurrentFrame();

  const ink = light ? "rgba(26,23,20,0.85)" : "rgba(255,255,255,0.9)";
  const faint = light ? "rgba(26,23,20,0.08)" : "rgba(255,255,255,0.07)";

  const typed = Math.round(
    interpolate(frame, [10, 34], [0, title.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const cursorOn = frame < 44 && Math.floor(frame / 8) % 2 === 0;

  const lineIn = ramp(frame, 6, 22);
  const labelIn = ramp(frame, 4, 16);
  const ghostIn = ramp(frame, 0, 40);

  const progress = interpolate(frame, [0, sceneDuration], [0.12, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ghost numeral */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: -60,
          fontFamily: sora,
          fontWeight: 800,
          fontSize: 560,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `2px ${faint}`,
          opacity: ghostIn,
          transform: `translateX(${(1 - ghostIn) * 80}px)`,
        }}
      >
        {index}
      </div>

      {/* corner label */}
      <div style={{ position: "absolute", left: 100, top: 84, opacity: labelIn }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 24,
            letterSpacing: "0.32em",
            color: ink,
            whiteSpace: "pre",
          }}
        >
          <span style={{ color: accent }}>{index}</span>
          {"  /  "}
          {title.slice(0, typed)}
          <span style={{ opacity: cursorOn ? 1 : 0, color: accent }}>▍</span>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 2,
            width: 320,
            transformOrigin: "left",
            transform: `scaleX(${lineIn})`,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }}
        />
      </div>

      {/* faux YouTube player chrome */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 160,
          background: light
            ? "linear-gradient(transparent, rgba(0,0,0,0.18))"
            : "linear-gradient(transparent, rgba(0,0,0,0.45))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 5,
          backgroundColor: "rgba(255,255,255,0.22)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: "#ff0033",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${progress * 100}%`,
            top: -4.5,
            width: 14,
            height: 14,
            marginLeft: -7,
            borderRadius: "50%",
            backgroundColor: "#ff0033",
            boxShadow: "0 0 10px rgba(255,0,51,0.7)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
