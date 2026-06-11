import React from "react";
import { interpolate, random } from "remotion";
import { GROTESK, MONO } from "../fonts";
import { useEnterExit } from "./useEnterExit";
import type { LowerThirdProps } from "./Glass";

const CYAN = "#22e4ff";
const MAGENTA = "#ff2bd6";

/**
 * 02 — NEON. Cyberpunk plate: clipped corners, glowing gradient border,
 * scanlines, RGB-split glitch on entry and a scanning underline.
 */
export const NeonLowerThird: React.FC<LowerThirdProps> = ({
  delay = 0,
  exitAt,
}) => {
  const { enter, exit, local } = useEnterExit(delay, exitAt);

  // Deterministic glitch jitter for the first beats of the entrance.
  const glitchAmount = interpolate(local, [0, 6, 18], [0, 10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jx = (random(`nx-${Math.floor(local / 2)}`) - 0.5) * glitchAmount;
  const jy = (random(`ny-${Math.floor(local / 2)}`) - 0.5) * glitchAmount * 0.5;

  const scan = interpolate(local % 70, [0, 70], [0, 100]);
  const underline = interpolate(local, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flicker =
    local > 4 && local < 14 ? (random(`fl-${local}`) > 0.4 ? 1 : 0.55) : 1;

  const clip =
    "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 34px 100%, 0 calc(100% - 34px))";

  return (
    <div
      style={{
        transform: `translateX(${(1 - enter) * -110 + jx}px) translateY(${jy + exit * 140}px)`,
        opacity: Math.min(enter * 2.5, 1) * (1 - exit) * flicker,
      }}
    >
      <div
        style={{
          position: "relative",
          clipPath: clip,
          padding: 2,
          background: `linear-gradient(110deg, ${CYAN}, ${MAGENTA} 60%, ${CYAN})`,
          filter: `drop-shadow(0 0 22px rgba(34,228,255,0.55)) drop-shadow(0 0 38px rgba(255,43,214,0.3))`,
        }}
      >
        <div
          style={{
            clipPath: clip,
            background: "linear-gradient(160deg, #0b0b1a 30%, #141231)",
            padding: "30px 64px 30px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(34,228,255,0.07) 0 2px, transparent 2px 6px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${scan}%`,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, rgba(34,228,255,0.12), transparent)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 26,
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              {glitchAmount > 1 ? (
                <>
                  <NeonName style={{ position: "absolute", left: jx * 1.6, top: 0, color: CYAN, opacity: 0.8 }} />
                  <NeonName style={{ position: "absolute", left: -jx * 1.6, top: 0, color: MAGENTA, opacity: 0.8 }} />
                </>
              ) : null}
              <NeonName style={{ position: "relative", color: "#fff" }} />
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 24,
                color: CYAN,
                border: `1px solid ${CYAN}`,
                padding: "4px 14px",
                opacity: 0.9,
                textShadow: `0 0 12px ${CYAN}`,
              }}
            >
              GRID_07
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              height: 3,
              width: 560,
              background: "rgba(255,255,255,0.12)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${underline * 100}%`,
                background: `linear-gradient(90deg, ${CYAN}, ${MAGENTA})`,
                boxShadow: `0 0 14px ${CYAN}`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: MONO,
              fontSize: 26,
              letterSpacing: 5,
              color: "rgba(255,255,255,0.75)",
              position: "relative",
            }}
          >
            TECH REVIEWER <span style={{ color: MAGENTA }}>//</span> NIGHT CITY
            DESK
          </div>
        </div>
      </div>
    </div>
  );
};

const NeonName: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      fontFamily: GROTESK,
      fontWeight: 700,
      fontSize: 58,
      letterSpacing: 2,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    KAITO RYUU
  </div>
);
