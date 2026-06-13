import { AbsoluteFill, useCurrentFrame } from "remotion";

// Static film grain via an inline SVG fractal-noise data URI. Cheap (one image,
// no per-frame filter recompute); we only nudge its position for life.
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  // shift the tile every few frames to avoid a frozen-noise look
  const x = (frame * 7) % 160;
  const y = (frame * 11) % 160;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN_URI,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 100% at 50% 45%, transparent 40%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Cinematic top/bottom letterbox bars that animate in.
export const Letterbox: React.FC<{ height: number }> = ({ height }) => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height,
        background: "#000",
        zIndex: 50,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height,
        background: "#000",
        zIndex: 50,
      }}
    />
  </>
);

// A soft moving light leak for warmth.
export const LightLeak: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const x = 30 + Math.sin(frame / 70) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(40% 60% at ${x}% 0%, ${color}, transparent 70%)`,
        mixBlendMode: "screen",
        opacity: 0.25,
        pointerEvents: "none",
      }}
    />
  );
};
