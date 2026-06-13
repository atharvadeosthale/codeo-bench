import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette } from "../theme";
import { track, pop, EASE } from "../lib/anim";

const Word: React.FC<{
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  const y = track(frame, [delay, delay + 22], [120, 0], EASE);
  const o = track(frame, [delay, delay + 16], [0, 1]);
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ transform: `translateY(${y}%)`, opacity: o, ...style }}>
        {children}
      </div>
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blobT = frame * 0.02;
  const sheen = ((frame - 18) * 2.4) % 260;
  const lineW = track(frame, [30, 60], [0, 1]);
  const kicker = track(frame, [6, 22], [0, 1]);
  const sub = track(frame, [40, 60], [0, 1]);
  const badge = pop(frame, fps, 2, 12);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(130% 120% at 50% 30%, #0E1424 0%, #070A12 55%, #04060A 100%)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* drifting accents */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "#1E6BFF",
          filter: "blur(130px)",
          opacity: 0.32,
          left: "8%",
          top: "10%",
          transform: `translate(${Math.sin(blobT) * 50}px, ${Math.cos(blobT) * 40}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "#A98BFF",
          filter: "blur(130px)",
          opacity: 0.28,
          right: "8%",
          bottom: "8%",
          transform: `translate(${Math.cos(blobT) * 50}px, ${Math.sin(blobT) * 40}px)`,
        }}
      />

      <div style={{ textAlign: "center", position: "relative" }}>
        {/* kicker badge */}
        <div
          style={{
            opacity: kicker,
            transform: `scale(${badge})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            border: "1px solid rgba(125,249,255,0.3)",
            background: "rgba(125,249,255,0.06)",
            marginBottom: 34,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#7DF9FF",
              boxShadow: "0 0 12px #7DF9FF",
            }}
          />
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              letterSpacing: 6,
              color: "#CFEFF3",
            }}
          >
            A COMPONENT SHOWCASE · 7 STYLES
          </span>
        </div>

        {/* title */}
        <div style={{ position: "relative" }}>
          <Word
            delay={14}
            style={{
              fontFamily: fonts.display,
              fontSize: 230,
              lineHeight: 0.82,
              color: palette.white,
              letterSpacing: 2,
            }}
          >
            LOWER
          </Word>
          <Word
            delay={22}
            style={{
              fontFamily: fonts.display,
              fontSize: 230,
              lineHeight: 0.86,
              letterSpacing: 2,
              background: "linear-gradient(100deg, #7DF9FF, #A98BFF, #7DF9FF)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            THIRDS
          </Word>
          {/* sheen sweep across title */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sheen - 30}%`,
              width: 120,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              transform: "skewX(-16deg)",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* underline */}
        <div
          style={{
            height: 3,
            width: `${lineW * 360}px`,
            margin: "26px auto 0",
            background: "linear-gradient(90deg, #7DF9FF, #A98BFF)",
            borderRadius: 3,
            boxShadow: "0 0 18px #7DF9FF88",
          }}
        />

        <div
          style={{
            opacity: sub,
            marginTop: 26,
            fontFamily: fonts.ui,
            fontSize: 26,
            letterSpacing: 4,
            color: palette.mute,
          }}
        >
          STUNNING ON-SCREEN GRAPHICS, ANIMATED IN REMOTION
        </div>
      </div>
    </AbsoluteFill>
  );
};
