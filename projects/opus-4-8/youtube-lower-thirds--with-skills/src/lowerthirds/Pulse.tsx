import React from "react";
import { useCurrentFrame } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track } from "../lib/anim";

/** Gaming / streamer neon lower third with glitch + live badge. */
export const Pulse: React.FC<{
  handle?: string;
  tag?: string;
  status?: string;
  enterAt?: number;
}> = ({
  handle = "NOVA_STRIKE",
  tag = "RANKED · GRANDMASTER",
  status = "LIVE",
  enterAt = 6,
}) => {
  const frame = useCurrentFrame();
  const f = frame - enterAt;
  const slide = track(f, [0, 22], [-90, 0]);
  const o = track(f, [0, 16], [0, 1]);
  // tiny deterministic glitch jitter
  const g = Math.sin(frame * 1.7) * Math.sin(frame * 0.9);
  const jitter = Math.abs(g) > 0.85 ? (g > 0 ? 3 : -3) : 0;
  const blink = Math.sin(frame * 0.5) > -0.3 ? 1 : 0.3;
  const chevron = (frame * 2) % 30;

  const { a, b } = accents.pulse;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 124,
        transform: `translateX(${slide + jitter}px) skewX(-9deg)`,
        opacity: o,
        display: "flex",
        alignItems: "stretch",
        filter: `drop-shadow(0 0 18px ${a}55)`,
      }}
    >
      {/* live badge */}
      <div
        style={{
          background: a,
          color: "#0A0008",
          fontFamily: fonts.head,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 3,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 22px",
          boxShadow: `0 0 26px ${a}`,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#0A0008",
            opacity: blink,
          }}
        />
        <span style={{ transform: "skewX(9deg)" }}>{status}</span>
      </div>
      {/* main panel */}
      <div
        style={{
          background:
            "linear-gradient(100deg, rgba(20,6,28,0.94), rgba(8,3,14,0.94))",
          borderTop: `2px solid ${a}`,
          borderBottom: `2px solid ${b}`,
          padding: "14px 30px 16px 26px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: "skewX(9deg)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: fonts.head,
              fontWeight: 800,
              fontSize: 44,
              color: palette.white,
              letterSpacing: 1,
              textShadow: `0 0 18px ${a}aa`,
            }}
          >
            {handle}
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                color: b,
                fontSize: 26,
                opacity: 0.25 + 0.75 * (((chevron / 30 + i / 3) % 1)),
                textShadow: `0 0 12px ${b}`,
              }}
            >
              ›
            </span>
          ))}
        </div>
        <div
          style={{
            transform: "skewX(9deg)",
            marginTop: 6,
            fontFamily: fonts.mono,
            fontSize: 17,
            letterSpacing: 3,
            color: b,
          }}
        >
          {tag}
        </div>
      </div>
    </div>
  );
};
