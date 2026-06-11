import React from "react";
import { interpolate } from "remotion";
import { INTER, MONO } from "../fonts";
import { Reveal } from "../components/Reveal";
import { useEnterExit } from "./useEnterExit";

export type LowerThirdProps = { delay?: number; exitAt?: number };

/**
 * 01 — GLASS. Frosted glassmorphism card: blurred panel, gradient avatar
 * ring, staggered masked text, and a specular shine sweep across the face.
 */
export const GlassLowerThird: React.FC<LowerThirdProps> = ({
  delay = 0,
  exitAt,
}) => {
  const { enter, exit, local } = useEnterExit(delay, exitAt);
  const shine = interpolate(local, [22, 58], [-30, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barGrow = interpolate(local, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        transform: `translateY(${(1 - enter) * 140 + exit * 160}px)`,
        opacity: Math.min(enter * 2, 1) * (1 - exit),
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "26px 52px 26px 28px",
          borderRadius: 28,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
          border: "1px solid rgba(255,255,255,0.28)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 24px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            bottom: -60,
            left: `${shine}%`,
            width: 130,
            background:
              "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)",
            transform: "rotate(8deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: 104,
            height: 104,
            borderRadius: "50%",
            padding: 4,
            background: "conic-gradient(from 200deg, #7dd3fc, #c084fc, #f472b6, #7dd3fc)",
            boxShadow: "0 0 30px rgba(168,85,247,0.45)",
            transform: `scale(${enter})`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #312e81, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 38,
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            MC
          </div>
        </div>
        <div
          style={{
            width: 5,
            borderRadius: 3,
            alignSelf: "stretch",
            background: "linear-gradient(#7dd3fc, #c084fc)",
            transform: `scaleY(${barGrow})`,
          }}
        />
        <div>
          <Reveal delay={delay + 6}>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 52,
                color: "#fff",
                letterSpacing: -0.5,
                textShadow: "0 2px 18px rgba(0,0,0,0.35)",
              }}
            >
              Maya Chen
            </div>
          </Reveal>
          <Reveal delay={delay + 12}>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontFamily: INTER,
                fontWeight: 500,
                fontSize: 27,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Product Designer
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: "rgba(125,211,252,0.18)",
                  border: "1px solid rgba(125,211,252,0.45)",
                  color: "#bae6fd",
                }}
              >
                @mayabuilds
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
