import React from "react";
import { random, useCurrentFrame } from "remotion";
import { ramp } from "../easing";
import { mono, sora } from "../fonts";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%/<>";

const scramble = (text: string, frame: number, start: number): string => {
  return text
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      const resolveAt = start + 8 + i * 1.6;
      if (frame >= resolveAt) return ch;
      const r = random(`scramble-${i}-${frame}`);
      return CHARSET[Math.floor(r * CHARSET.length)];
    })
    .join("");
};

// 02 — Cyberpunk plate: clipped corners, RGB-split glitch entrance,
// character scramble, laser underline and pulsing glow.
export const NeonLowerThird: React.FC<{
  name?: string;
  tag?: string;
  stat?: string;
}> = ({ name = "KAI NAKAMURA", tag = "TECH REVIEWER", stat = "2.4M SUBS" }) => {
  const frame = useCurrentFrame();

  const enter = ramp(frame, 0, 20);
  const glitch = 1 - ramp(frame, 0, 24);
  const lineIn = ramp(frame, 18, 16);
  const tagIn = ramp(frame, 28, 14);

  // hard flicker during the first frames
  const flicker =
    frame < 10 ? (random(`flicker-${frame}`) > 0.35 ? 1 : 0.25) : 1;

  const jitterX = glitch > 0 ? (random(`jx-${frame}`) - 0.5) * 10 * glitch : 0;
  const jitterY = glitch > 0 ? (random(`jy-${frame}`) - 0.5) * 6 * glitch : 0;
  const split = glitch * 5;

  const pulse = 14 + 7 * Math.sin(frame / 7);
  const cursorOn = Math.floor(frame / 9) % 2 === 0;

  const displayName = scramble(name, frame, 4);

  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 26,
    height: 26,
    opacity: lineIn,
    ...pos,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        bottom: 130,
        opacity: enter * flicker,
        transform: `translateX(${(1 - enter) * -60 + jitterX}px) translateY(${jitterY}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "26px 46px 24px 34px",
          backgroundColor: "rgba(6,10,22,0.88)",
          clipPath:
            "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))",
          border: "1px solid rgba(34,211,238,0.65)",
          boxShadow: `0 0 ${pulse}px rgba(34,211,238,0.45), inset 0 0 30px rgba(34,211,238,0.08)`,
        }}
      >
        {/* scanline texture inside the plate */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(34,211,238,0.07) 0 1px, transparent 1px 4px)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* RGB split layers */}
          <div
            style={{
              position: "absolute",
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: "0.05em",
              color: "rgba(255,0,80,0.85)",
              transform: `translate(${-split}px, 0)`,
              opacity: split > 0.3 ? 0.9 : 0,
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              position: "absolute",
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: "0.05em",
              color: "rgba(0,229,255,0.85)",
              transform: `translate(${split}px, 0)`,
              opacity: split > 0.3 ? 0.9 : 0,
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              position: "relative",
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: "0.05em",
              color: "#eafcff",
              textShadow: "0 0 22px rgba(34,211,238,0.8)",
            }}
          >
            {displayName}
          </div>
        </div>

        {/* laser underline */}
        <div
          style={{
            marginTop: 14,
            height: 3,
            width: 520,
            transformOrigin: "left",
            transform: `scaleX(${lineIn})`,
            background: "linear-gradient(90deg, #22d3ee, #e879f9 70%, transparent)",
            boxShadow: "0 0 14px rgba(34,211,238,0.9)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 13,
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 12}px)`,
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 22,
              letterSpacing: "0.28em",
              color: "#22d3ee",
            }}
          >
            {tag}
            <span style={{ opacity: cursorOn ? 1 : 0 }}>_</span>
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 18,
              letterSpacing: "0.12em",
              color: "rgba(232,121,249,0.95)",
              border: "1px solid rgba(232,121,249,0.5)",
              padding: "3px 12px",
              boxShadow: "0 0 12px rgba(232,121,249,0.35)",
            }}
          >
            ▶ {stat}
          </span>
        </div>

        {/* corner ticks */}
        <div style={corner({ left: -1, top: -1, borderLeft: "3px solid #e879f9", borderTop: "3px solid #e879f9" })} />
        <div style={corner({ right: -1, bottom: -1, borderRight: "3px solid #e879f9", borderBottom: "3px solid #e879f9" })} />
      </div>
    </div>
  );
};
