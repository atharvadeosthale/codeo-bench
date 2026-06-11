import React from "react";

// SVG edge primitives. Render these inside one absolutely-positioned
// full-bleed <svg> per scene so coordinates match the HTML layer.

const arrowPoints = (
  x: number,
  y: number,
  angle: number,
  size: number,
): string => {
  const a1 = angle + Math.PI - 0.45;
  const a2 = angle + Math.PI + 0.45;
  return `${x},${y} ${x + Math.cos(a1) * size},${y + Math.sin(a1) * size} ${
    x + Math.cos(a2) * size
  },${y + Math.sin(a2) * size}`;
};

export const Line: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number; // draw progress 0..1
  color: string;
  width?: number;
  dashed?: boolean;
  arrow?: boolean;
  opacity?: number;
}> = ({ x1, y1, x2, y2, p, color, width = 3, dashed, arrow, opacity = 1 }) => {
  if (p <= 0) return null;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ex = x1 + Math.cos(angle) * len * p;
  const ey = y1 + Math.sin(angle) * len * p;
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "7 9" : undefined}
      />
      {arrow && p > 0.55 ? (
        <polygon
          points={arrowPoints(ex, ey, angle, 13)}
          fill={color}
          opacity={Math.min(1, (p - 0.55) / 0.3)}
        />
      ) : null}
    </g>
  );
};

const quadPoint = (
  t: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
): [number, number] => {
  const mt = 1 - t;
  return [
    mt * mt * x1 + 2 * mt * t * cx + t * t * x2,
    mt * mt * y1 + 2 * mt * t * cy + t * t * y2,
  ];
};

export const Curve: React.FC<{
  x1: number;
  y1: number;
  cx: number;
  cy: number;
  x2: number;
  y2: number;
  p: number;
  color: string;
  width?: number;
  dashed?: boolean;
  arrow?: boolean;
  opacity?: number;
}> = ({ x1, y1, cx, cy, x2, y2, p, color, width = 3, dashed, arrow, opacity = 1 }) => {
  if (p <= 0) return null;
  // approximate length by sampling
  let len = 0;
  let prev = quadPoint(0, x1, y1, cx, cy, x2, y2);
  for (let i = 1; i <= 24; i++) {
    const pt = quadPoint(i / 24, x1, y1, cx, cy, x2, y2);
    len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  const [hx, hy] = quadPoint(Math.min(1, p), x1, y1, cx, cy, x2, y2);
  const [bx, by] = quadPoint(Math.max(0, Math.min(1, p) - 0.03), x1, y1, cx, cy, x2, y2);
  const angle = Math.atan2(hy - by, hx - bx);
  return (
    <g opacity={opacity}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? `7 9` : `${len}`}
        strokeDashoffset={dashed ? undefined : len * (1 - p)}
        // when dashed, fade in instead of drawing on
        style={dashed ? { opacity: Math.min(1, p * 1.6) } : undefined}
      />
      {arrow && p > 0.6 ? (
        <polygon
          points={arrowPoints(hx, hy, angle, 13)}
          fill={color}
          opacity={Math.min(1, (p - 0.6) / 0.3)}
        />
      ) : null}
    </g>
  );
};

export const Svg: React.FC<{ children: React.ReactNode; z?: number }> = ({
  children,
  z = 1,
}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0, zIndex: z, pointerEvents: "none" }}
  >
    {children}
  </svg>
);
