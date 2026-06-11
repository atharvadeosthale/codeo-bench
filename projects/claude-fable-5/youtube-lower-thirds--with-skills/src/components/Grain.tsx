import React, { useId } from "react";
import { AbsoluteFill } from "remotion";

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const id = useId();

  return (
    <AbsoluteFill
      style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
