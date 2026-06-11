import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER, PLAYFAIR_ITALIC } from "../fonts";
import { useEnterExit } from "./useEnterExit";
import type { LowerThirdProps } from "./Glass";

/**
 * 03 — EDITORIAL. No panel at all: a hairline rule draws itself, a serif
 * name rises letter by letter, a tracked-out role settles beneath. Vogue,
 * not Vegas.
 */
export const EditorialLowerThird: React.FC<LowerThirdProps> = ({
  delay = 0,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { exit, local } = useEnterExit(delay, exitAt);
  const name = "Isabelle Laurent";
  const rule = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const roleIn = interpolate(local, [26, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity: 1 - exit, transform: `translateY(${exit * 60}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#e7c873",
            transform: `scale(${rule})`,
            boxShadow: "0 0 14px rgba(231,200,115,0.7)",
          }}
        />
        <div
          style={{
            height: 1,
            width: 620,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.15))",
            transform: `scaleX(${rule})`,
            transformOrigin: "left",
          }}
        />
      </div>
      <div style={{ display: "flex", overflow: "hidden", paddingBottom: 8 }}>
        {name.split("").map((ch, i) => {
          const p = spring({
            frame: frame - delay - 4 - i * 1.3,
            fps,
            config: { damping: 30, stiffness: 140 },
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: PLAYFAIR_ITALIC,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 92,
                lineHeight: 1.05,
                color: "#f7f3ea",
                display: "inline-block",
                whiteSpace: "pre",
                transform: `translateY(${(1 - p) * 110}%)`,
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: INTER,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 14,
          color: "rgba(247,243,234,0.75)",
          opacity: roleIn,
          transform: `translateY(${(1 - roleIn) * 16}px)`,
        }}
      >
        CREATIVE DIRECTOR&nbsp;&nbsp;·&nbsp;&nbsp;ATELIER NORD
      </div>
    </div>
  );
};
