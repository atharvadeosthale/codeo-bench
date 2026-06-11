import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_SOFT } from "../theme";
import { Kicker, RisingLine, outlineStyle } from "../ui/Type";

const CUT = 82;

/** Slow push-in applied to each held statement so nothing sits dead. */
const Push: React.FC<{
  children: React.ReactNode;
  from: number;
  to: number;
  start: number;
  end: number;
}> = ({ children, from, to, start, end }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${s.toFixed(4)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < CUT) {
    return (
      <Push from={1} to={1.045} start={0} end={CUT}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            textAlign: "center",
          }}
        >
          <Kicker text="the premise" delay={4} />
          <div>
            <RisingLine delay={8} fontSize={172}>
              Every video
            </RisingLine>
            <RisingLine delay={14} fontSize={172}>
              on this site
            </RisingLine>
          </div>
        </div>
      </Push>
    );
  }

  return (
    <Push from={1.05} to={1} start={CUT} end={CUT + 14}>
      <div style={{ textAlign: "center" }}>
        <RisingLine delay={CUT} fontSize={186}>
          was written
        </RisingLine>
        <RisingLine delay={CUT + 5} fontSize={186}>
          by&nbsp;<span style={outlineStyle}>a machine.</span>
        </RisingLine>
      </div>
    </Push>
  );
};
