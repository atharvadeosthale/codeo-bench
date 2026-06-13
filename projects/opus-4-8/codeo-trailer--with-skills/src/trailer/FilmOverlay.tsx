import { AbsoluteFill, random, useCurrentFrame } from "remotion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Film grain + scanlines + vignette + a faint gate flicker. Everything is
// driven by the frame (via remotion's deterministic random) so it renders
// identically every time — no CSS animations, no Math.random.
export const FilmOverlay: React.FC<{ grain?: number; vignette?: number }> = ({
  grain = 0.06,
  vignette = 0.5,
}) => {
  const frame = useCurrentFrame();
  // jitter the grain tile every frame so it shimmers like real stock
  const gx = random(`gx${frame}`) * 180;
  const gy = random(`gy${frame}`) * 180;
  // gentle, irregular exposure flicker
  const flicker =
    1 - random(`fl${Math.floor(frame / 2)}`) * 0.05 - (frame % 11 === 0 ? 0.04 : 0);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 80 }}>
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at 50% 48%, transparent 56%, rgba(5,6,3,${vignette}) 100%)`,
        }}
      />
      {/* scanlines */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* grain */}
      <AbsoluteFill
        style={{
          opacity: grain * flicker,
          backgroundImage: NOISE,
          backgroundPosition: `${gx}px ${gy}px`,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

// Subtle film-gate weave: nudges the whole frame on two slow sines so the
// image breathes the way film does as it runs through the gate.
export const GateWeave: React.FC<{ children: React.ReactNode; amount?: number }> = ({
  children,
  amount = 1,
}) => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 19) * 1.2 * amount;
  const y = Math.cos(frame / 13) * 0.9 * amount;
  const r = Math.sin(frame / 41) * 0.06 * amount;
  return (
    <AbsoluteFill
      style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}
    >
      {children}
    </AbsoluteFill>
  );
};
