import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER, MONO } from "../fonts";
import { useEnterExit } from "./useEnterExit";
import type { LowerThirdProps } from "./Glass";

const NAVY = "#0b1f4b";
const RED = "#d6132e";
const GOLD = "#f5b81c";

/**
 * 05 — BROADCAST. Network-news double decker: a flipping BREAKING tab,
 * a clean headline bar and a scrolling ticker with a live clock chip.
 */
export const BroadcastLowerThird: React.FC<LowerThirdProps> = ({
  delay = 0,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { exit, local } = useEnterExit(delay, exitAt);

  const barIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 130 },
  });
  const tabFlip = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 16, stiffness: 160 },
  });
  const tickerIn = interpolate(local, [16, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tickerScroll = (local * 3.2) % 1400;
  const sec = Math.floor(local / fps) % 60;
  const clock = `21:${String(14 + Math.floor(local / (fps * 60))).padStart(2, "0")}:${String((sec + 32) % 60).padStart(2, "0")}`;

  const width = 1500;

  return (
    <div
      style={{
        width,
        transform: `translateY(${(1 - barIn) * 180 + exit * 200}px)`,
        opacity: 1 - exit,
        fontFamily: INTER,
        filter: "drop-shadow(0 16px 44px rgba(0,0,0,0.55))",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            background: RED,
            color: "#fff",
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 5,
            padding: "12px 34px",
            transform: `perspective(700px) rotateX(${(1 - tabFlip) * 90}deg)`,
            transformOrigin: "bottom",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.5 + 0.5 * Math.abs(Math.sin(local * 0.22)),
            }}
          />
          BREAKING
        </div>
        <div
          style={{
            background: GOLD,
            color: NAVY,
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: 2,
            padding: "8px 22px",
            transform: `scaleX(${tabFlip})`,
            transformOrigin: "left",
          }}
        >
          EXCLUSIVE
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(180deg, #ffffff, #e9edf5)",
          padding: "20px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: `10px solid ${RED}`,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 44,
              color: "#10182b",
              letterSpacing: -0.5,
              whiteSpace: "nowrap",
              transform: `translateY(${(1 - interpolate(local, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) * 110}%)`,
            }}
          >
            Dr. Amara Okafor — First Interview From Orbit
          </div>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: NAVY,
            background: "rgba(11,31,75,0.08)",
            border: `1px solid rgba(11,31,75,0.25)`,
            borderRadius: 6,
            padding: "6px 16px",
            marginLeft: 24,
            whiteSpace: "nowrap",
          }}
        >
          {clock} UTC
        </div>
      </div>

      <div
        style={{
          background: NAVY,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          transform: `scaleY(${tickerIn})`,
          transformOrigin: "top",
        }}
      >
        <div
          style={{
            background: GOLD,
            color: NAVY,
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 3,
            padding: "10px 22px",
            zIndex: 1,
            whiteSpace: "nowrap",
          }}
        >
          CBN 24
        </div>
        <div style={{ position: "relative", flex: 1, height: 44, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              left: 0,
              top: 8,
              fontFamily: MONO,
              fontSize: 23,
              color: "rgba(255,255,255,0.85)",
              transform: `translateX(${-tickerScroll}px)`,
            }}
          >
            ORBITAL LAB MARKS 500 DAYS · MARKETS STEADY AHEAD OF LAUNCH WINDOW
            · CBN 24 SPECIAL REPORT AT THE TOP OF THE HOUR · ORBITAL LAB MARKS
            500 DAYS · MARKETS STEADY AHEAD OF LAUNCH WINDOW · CBN 24 SPECIAL
            REPORT AT THE TOP OF THE HOUR ·
          </div>
        </div>
      </div>
    </div>
  );
};
