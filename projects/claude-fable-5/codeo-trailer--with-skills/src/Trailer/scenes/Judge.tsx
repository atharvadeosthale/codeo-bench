import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";
import { kickerStyle, MaskRise, SceneBg } from "../ui";

const bigWord: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: 158,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  color: C.ink,
};

// The verdict beat. Quietest scene in the trailer — slow push,
// sentence case, one lime italic word. Let it breathe.
export const Judge: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);

  return (
    <AbsoluteFill>
      <SceneBg glowX={62} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
        }}
      >
        <MaskRise at={2} dur={16}>
          <span style={kickerStyle}>THE VERDICT</span>
        </MaskRise>
        <div style={{ height: 48 }} />
        <div style={{ display: "flex", gap: 40 }}>
          <MaskRise at={8} dur={24}>
            <span style={bigWord}>You</span>
          </MaskRise>
          <MaskRise at={13} dur={24}>
            <span style={bigWord}>are</span>
          </MaskRise>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          <MaskRise at={20} dur={24}>
            <span style={bigWord}>the</span>
          </MaskRise>
          <MaskRise at={26} dur={26}>
            <span
              style={{
                ...bigWord,
                color: C.accent,
                display: "inline-block",
                transform: "skewX(-7deg)",
                textShadow: "0 0 44px rgba(212, 255, 63, 0.28)",
              }}
            >
              judge
            </span>
            <span style={bigWord}>.</span>
          </MaskRise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
