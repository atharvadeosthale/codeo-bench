import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Classic React atom: nucleus + 3 orbital ellipses with travelling electrons.
export const ReactLogo: React.FC<{
  size?: number;
  speed?: number;
  glow?: number;
}> = ({ size = 220, speed = 1, glow = 1 }) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.6 * speed;
  const rx = 75;
  const ry = 28;
  const c = COLORS.react;

  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200">
      <defs>
        <radialGradient id="nuc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdf0ff" />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
      </defs>
      <g transform={`rotate(${rot * 0.15})`}>
        {[0, 60, 120].map((base, i) => {
          const angle = base;
          const t = (frame * 2 * speed + i * 120) % 360;
          const er = (t * Math.PI) / 180;
          // electron position on the un-rotated ellipse
          const ex = rx * Math.cos(er);
          const ey = ry * Math.sin(er);
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <ellipse
                cx={0}
                cy={0}
                rx={rx}
                ry={ry}
                fill="none"
                stroke={c}
                strokeWidth={2.5}
                opacity={0.85}
                style={{ filter: `drop-shadow(0 0 ${6 * glow}px ${c})` }}
              />
              <circle
                cx={ex}
                cy={ey}
                r={6}
                fill={c}
                style={{ filter: `drop-shadow(0 0 ${8 * glow}px ${c})` }}
              />
            </g>
          );
        })}
        <circle
          cx={0}
          cy={0}
          r={13}
          fill="url(#nuc)"
          style={{ filter: `drop-shadow(0 0 ${16 * glow}px ${c})` }}
        />
      </g>
    </svg>
  );
};
