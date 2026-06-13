import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, pop } from "../lib/anim";
import {
  YouTubeGlyph,
  XGlyph,
  InstagramGlyph,
  TikTokGlyph,
} from "../components/icons";

const CHIPS = [
  { Icon: YouTubeGlyph, label: "/pixelforge", tint: "#FF0033" },
  { Icon: InstagramGlyph, label: "@pixelforge", tint: "#E1306C" },
  { Icon: XGlyph, label: "@pixel_forge", tint: "#FFFFFF" },
  { Icon: TikTokGlyph, label: "@pixelforge", tint: "#22D3EE" },
];

/** Social handle rail with staggered chips. */
export const Connect: React.FC<{ enterAt?: number }> = ({ enterAt = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - enterAt;
  const labelP = track(f, [0, 18], [0, 1]);
  const labelX = track(f, [0, 20], [-30, 0]);
  const { a } = accents.connect;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 124,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* lead label */}
      <div
        style={{
          opacity: labelP,
          transform: `translateX(${labelX}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          paddingRight: 8,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 16,
            letterSpacing: 5,
            color: a,
          }}
        >
          FOLLOW
        </span>
        <span
          style={{
            fontFamily: fonts.head,
            fontWeight: 800,
            fontSize: 40,
            color: palette.white,
            lineHeight: 1,
          }}
        >
          @PIXELFORGE
        </span>
      </div>

      {CHIPS.map((c, i) => {
        const d = enterAt + 10 + i * 5;
        const s = pop(frame, fps, d, 14);
        const o = track(frame, [d, d + 12], [0, 1]);
        return (
          <div
            key={i}
            style={{
              transform: `scale(${s}) translateY(${(1 - s) * 18}px)`,
              opacity: o,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 20px",
              borderRadius: 14,
              background: "rgba(14,18,26,0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: `0 16px 40px rgba(0,0,0,0.45), inset 0 0 0 1px ${c.tint}22`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${c.tint}1f`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 16px ${c.tint}44`,
              }}
            >
              <c.Icon size={22} color={c.tint} />
            </div>
            <span
              style={{
                fontFamily: fonts.ui,
                fontWeight: 500,
                fontSize: 20,
                color: palette.white,
                letterSpacing: 0.5,
              }}
            >
              {c.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
