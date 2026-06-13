import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Animated dark "screening room" backdrop: drifting grid + parallax glow + sparse particles.
export const Background: React.FC<{ accent?: string }> = ({
  accent = COLORS.react,
}) => {
  const frame = useCurrentFrame();

  const gridShift = (frame * 0.35) % 64;
  const glowX = interpolate(Math.sin(frame / 120), [-1, 1], [35, 65]);
  const glowY = interpolate(Math.cos(frame / 95), [-1, 1], [30, 70]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* deep radial vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${hexA(
            accent,
            0.16,
          )} 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 90%, ${hexA(
            COLORS.jsx,
            0.1,
          )} 0%, rgba(0,0,0,0) 50%)`,
        }}
      />
      {/* moving grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${gridShift}px ${gridShift}px`,
          maskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 85%)",
        }}
      />
      {/* floating particles */}
      {new Array(40).fill(0).map((_, i) => {
        const seed = i + 1;
        const x = random(`x${seed}`) * 1920;
        const baseY = random(`y${seed}`) * 1080;
        const speed = 0.2 + random(`s${seed}`) * 0.8;
        const size = 1 + random(`z${seed}`) * 2.5;
        const y = (baseY - frame * speed + 2160) % 1080;
        const tw = 0.2 + 0.8 * Math.abs(Math.sin(frame / 30 + seed));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: accent,
              opacity: tw * 0.5,
              boxShadow: `0 0 ${size * 3}px ${accent}`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.45))",
        }}
      />
    </AbsoluteFill>
  );
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
