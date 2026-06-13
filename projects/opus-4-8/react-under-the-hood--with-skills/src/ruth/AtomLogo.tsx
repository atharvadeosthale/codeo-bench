import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

// The React atom: three elliptical orbits with an electron tracing each,
// and a pulsing nucleus. Pure frame-driven, deterministic.
export const AtomLogo: React.FC<{ size?: number; speed?: number; spin?: number }> = ({
  size = 320,
  speed = 1,
  spin = 0,
}) => {
  const frame = useCurrentFrame();
  const r = size / 2;
  const rx = r * 0.92;
  const ry = r * 0.36;
  const orbits = [0, 60, 120];
  const t = (frame * speed) / 30;

  const nucleus = 1 + Math.sin(frame / 9) * 0.12;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-r} ${-r} ${size} ${size}`}
      style={{ transform: `rotate(${spin}deg)`, overflow: "visible" }}
    >
      <defs>
        <radialGradient id="nuc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bff3ff" />
          <stop offset="55%" stopColor={COLORS.react} />
          <stop offset="100%" stopColor={COLORS.reactDim} />
        </radialGradient>
      </defs>
      {orbits.map((deg, i) => {
        const reveal = interpolate(frame, [i * 8, i * 8 + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // electron position
        const ang = t * 2 * Math.PI + (i * 2 * Math.PI) / 3;
        const ex = rx * Math.cos(ang);
        const ey = ry * Math.sin(ang);
        const rot = deg;
        const cos = Math.cos((rot * Math.PI) / 180);
        const sin = Math.sin((rot * Math.PI) / 180);
        const px = ex * cos - ey * sin;
        const py = ex * sin + ey * cos;
        return (
          <g key={i}>
            <ellipse
              cx={0}
              cy={0}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={COLORS.react}
              strokeWidth={3}
              opacity={0.55 * reveal}
              transform={`rotate(${rot})`}
            />
            <circle
              cx={px}
              cy={py}
              r={9}
              fill={COLORS.react}
              opacity={reveal}
              style={{ filter: `drop-shadow(0 0 10px ${COLORS.react})` }}
            />
          </g>
        );
      })}
      <circle
        cx={0}
        cy={0}
        r={16 * nucleus}
        fill="url(#nuc)"
        style={{ filter: `drop-shadow(0 0 18px ${COLORS.react})` }}
      />
    </svg>
  );
};
