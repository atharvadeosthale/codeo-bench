import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_OUT, FONT_MONO } from "../theme";
import { RisingLine, outlineStyle } from "../ui/Type";

const CUT_1 = 42;
const CUT_2 = 84;

/** Registration corner brackets, snapping in like the video-card hover. */
const Brackets: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const inset = 120 + (1 - t) * 36;
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 54,
    height: 54,
    opacity: t,
    ...pos,
  });
  const b = `4px solid ${C.accent}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={corner({ top: inset, left: inset, borderTop: b, borderLeft: b })} />
      <div style={corner({ top: inset, right: inset, borderTop: b, borderRight: b })} />
      <div style={corner({ bottom: inset, left: inset, borderBottom: b, borderLeft: b })} />
      <div style={corner({ bottom: inset, right: inset, borderBottom: b, borderRight: b })} />
    </AbsoluteFill>
  );
};

const Statement: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <div>
      <RisingLine delay={delay} fontSize={196}>
        {children}
      </RisingLine>
    </div>
  </AbsoluteFill>
);

export const Judge: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < CUT_1) {
    return <Statement delay={2}>No scores.</Statement>;
  }
  if (frame < CUT_2) {
    return <Statement delay={CUT_1 + 1}>No rankings.</Statement>;
  }

  const subIn = interpolate(frame, [CUT_2 + 22, CUT_2 + 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Brackets delay={CUT_2 + 10} />
      <div>
        <RisingLine delay={CUT_2 + 1} fontSize={210}>
          You are
        </RisingLine>
        <RisingLine delay={CUT_2 + 6} fontSize={210}>
          <span style={outlineStyle}>the judge.</span>
        </RisingLine>
        <div
          style={{
            marginTop: 38,
            fontFamily: FONT_MONO,
            fontSize: 23,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: C.inkDim,
            opacity: subIn,
            transform: `translateY(${((1 - subIn) * 12).toFixed(1)}px)`,
          }}
        >
          press play&nbsp;&nbsp;·&nbsp;&nbsp;watch&nbsp;&nbsp;·&nbsp;&nbsp;decide
        </div>
      </div>
    </AbsoluteFill>
  );
};
