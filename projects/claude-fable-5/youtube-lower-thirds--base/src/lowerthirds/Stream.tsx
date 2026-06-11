import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER, MONO } from "../fonts";
import { useEnterExit } from "./useEnterExit";
import type { LowerThirdProps } from "./Glass";

const LIME = "#c8ff2e";

/**
 * 04 — STREAM. Esports energy: skewed chips that slam in with overshoot,
 * a pulsing LIVE badge, animated hazard stripes and a viewer counter.
 */
export const StreamLowerThird: React.FC<LowerThirdProps> = ({
  delay = 0,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { exit, local } = useEnterExit(delay, exitAt);

  const slam = (d: number) =>
    spring({
      frame: frame - delay - d,
      fps,
      config: { damping: 14, stiffness: 210, mass: 0.7 },
    });

  const livePulse = 0.55 + 0.45 * Math.abs(Math.sin(local * 0.18));
  const viewers = Math.floor(
    interpolate(local, [8, 50], [11200, 12437], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const chip = (p: number, dist = 380): React.CSSProperties => ({
    transform: `translateX(${(1 - p) * -dist + exit * -dist}px) skewX(-10deg)`,
    opacity: exit > 0 ? 1 - exit : undefined,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.5))",
      }}
    >
      <div style={chip(slam(0), 320)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "linear-gradient(110deg, #ff1f4c, #ff5e2e)",
            padding: "10px 30px 10px 22px",
            borderRadius: 6,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              opacity: livePulse,
              boxShadow: `0 0 ${14 * livePulse}px #fff`,
            }}
          />
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: 4,
              color: "#fff",
            }}
          >
            LIVE
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 24,
              color: "rgba(255,255,255,0.9)",
              borderLeft: "2px solid rgba(255,255,255,0.4)",
              paddingLeft: 14,
            }}
          >
            {viewers.toLocaleString("en-US")} watching
          </span>
        </div>
      </div>

      <div style={chip(slam(4))}>
        <div
          style={{
            position: "relative",
            background: "#101014",
            border: `3px solid ${LIME}`,
            borderRadius: 10,
            padding: "18px 58px 18px 34px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(125deg, rgba(200,255,46,0.08) 0 18px, transparent 18px 36px)`,
              transform: `translateX(${-((local * 1.4) % 51)}px)`,
              left: -60,
              width: "140%",
            }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: INTER,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 76,
              lineHeight: 1,
              letterSpacing: 1,
              color: "#fff",
            }}
          >
            NOVA<span style={{ color: LIME }}>_</span>PLAYS
          </div>
        </div>
      </div>

      <div style={chip(slam(8), 440)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: LIME,
            borderRadius: 6,
            padding: "10px 30px",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: 2,
              color: "#101014",
            }}
          >
            SPEEDRUN ANY% — WORLD RECORD ATTEMPT
          </span>
        </div>
      </div>
    </div>
  );
};
