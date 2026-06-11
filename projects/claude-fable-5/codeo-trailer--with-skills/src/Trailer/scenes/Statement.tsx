import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";
import { kickerStyle, MaskRise, SceneBg } from "../ui";

export type StatementWord = {
  t: string;
  outline?: boolean;
};

// One giant hard-cut statement card in the site's hero-giant style:
// uppercase Bricolage 800, solid or lime-outline words, lime period.
export const Statement: React.FC<{
  lines: StatementWord[][];
  index: string;
  ghost: string;
  glowX?: number;
  fontSize?: number;
}> = ({ lines, index, ghost, glowX = 50, fontSize = 168 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.05]);

  let wordIndex = 0;
  return (
    <AbsoluteFill>
      <SceneBg glowX={glowX} />
      {/* ghost scene numeral, barely there */}
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 10,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 560,
          lineHeight: 1,
          color: "rgba(238, 240, 226, 0.035)",
          userSelect: "none",
        }}
      >
        {ghost}
      </div>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
        }}
      >
        <MaskRise at={2} dur={16}>
          <span style={kickerStyle}>THE PREMISE — {index}</span>
        </MaskRise>
        <div style={{ height: 44 }} />
        {lines.map((words, li) => (
          <div
            key={li}
            style={{
              display: "flex",
              gap: "0.26em",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize,
              lineHeight: 0.96,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
            }}
          >
            {words.map((w, wi) => {
              const at = 5 + wordIndex * 5;
              wordIndex += 1;
              const trailingDot = w.t.endsWith(".");
              const body = trailingDot ? w.t.slice(0, -1) : w.t;
              const wordStyle: React.CSSProperties = w.outline
                ? {
                    color: "transparent",
                    WebkitTextStroke: `3px ${C.accent}`,
                    filter: "drop-shadow(0 0 26px rgba(212, 255, 63, 0.25))",
                  }
                : { color: C.ink };
              return (
                <MaskRise key={wi} at={at} dur={22}>
                  <span style={wordStyle}>{body}</span>
                  {trailingDot ? (
                    <span style={{ color: C.accent, WebkitTextStroke: 0 }}>
                      .
                    </span>
                  ) : null}
                </MaskRise>
              );
            })}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
