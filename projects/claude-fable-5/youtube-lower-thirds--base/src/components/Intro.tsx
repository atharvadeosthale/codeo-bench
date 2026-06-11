import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { INTRO_DURATION } from "../constants";
import { GROTESK, INTER, MONO } from "../fonts";
import { Reveal } from "./Reveal";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kicker = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tracking = interpolate(frame, [4, 30], [26, 14], {
    extrapolateRight: "clamp",
  });
  const spotlight = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exitZoom = interpolate(
    frame,
    [INTRO_DURATION - 12, INTRO_DURATION],
    [1, 1.18],
    { extrapolateLeft: "clamp" },
  );
  const exitFade = interpolate(
    frame,
    [INTRO_DURATION - 10, INTRO_DURATION - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: "#07070d", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 75%)",
          transform: `scale(${1 + frame * 0.0012})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: spotlight,
          background:
            "radial-gradient(ellipse 45% 38% at 50% 46%, rgba(120,110,255,0.22), transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${exitZoom})`,
          opacity: exitFade,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: tracking,
            color: "rgba(255,255,255,0.6)",
            opacity: kicker,
            marginBottom: 30,
          }}
        >
          A COMPONENT COLLECTION
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {["LOWER", "THIRDS"].map((word, w) => (
            <Reveal key={word} delay={14 + w * 5} distance={120} damping={30}>
              <div
                style={{
                  fontFamily: GROTESK,
                  fontWeight: 700,
                  fontSize: 188,
                  lineHeight: 1,
                  letterSpacing: -4,
                  background:
                    "linear-gradient(180deg, #ffffff 35%, #8b8bf5 110%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {word}
              </div>
            </Reveal>
          ))}
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          {["01", "02", "03", "04", "05"].map((n, i) => {
            const p = spring({
              frame: frame - 30 - i * 3,
              fps,
              config: { damping: 18, stiffness: 200 },
            });
            return (
              <div
                key={n}
                style={{
                  fontFamily: MONO,
                  fontSize: 24,
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 8,
                  padding: "8px 18px",
                  transform: `scale(${p}) translateY(${(1 - p) * 20}px)`,
                  opacity: p,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: INTER,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.55)",
            opacity: interpolate(frame, [42, 56], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          FIVE STYLES · BUILT FROM SCRATCH
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
