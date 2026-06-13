import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MONO, SANS } from "../fonts";
import { C } from "../theme";

// Reveal a block by wiping it up from a baseline + settling into place, with a
// brief focus-pull. The editorial title treatment from the site's hero.
const Reveal: React.FC<{
  local: number;
  delay: number;
  children: React.ReactNode;
}> = ({ local, delay, children }) => {
  const t = local - delay;
  const wipe = interpolate(t, [0, 22], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(t, [0, 22], [54, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(t, [0, 16], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        clipPath: `inset(0 0 ${wipe}% 0)`,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  // open from the leader's cut-flash
  const fadeUp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  // slow cinematic push-in
  const push = interpolate(frame, [0, 120], [1, 1.035]);
  // rule draws after titles land
  const rule = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // exit upward into the manifesto
  const exitY = interpolate(frame, [108, 120], [0, -46], {
    extrapolateLeft: "clamp",
  });
  const exitOpacity = interpolate(frame, [108, 120], [1, 0], {
    extrapolateLeft: "clamp",
  });

  const giant: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: 220,
    lineHeight: 0.92,
    letterSpacing: "-0.035em",
    textTransform: "uppercase",
    margin: 0,
  };

  return (
    <AbsoluteFill
      style={{
        background: C.bgDeep,
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeUp,
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${push}) translateY(${exitY}px)`,
          opacity: exitOpacity,
        }}
      >
        <Reveal local={frame} delay={0}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: "0.5em",
              color: C.accent,
              marginBottom: 30,
              paddingLeft: "0.5em",
            }}
          >
            CODEO BENCH
          </div>
        </Reveal>

        <Reveal local={frame} delay={10}>
          <h1 style={{ ...giant, color: C.ink }}>REMOTION</h1>
        </Reveal>
        <Reveal local={frame} delay={20}>
          <h1
            style={{
              ...giant,
              color: "transparent",
              WebkitTextStroke: `3px ${C.accent}`,
              filter: "drop-shadow(0 0 26px rgba(212,255,63,0.28))",
            }}
          >
            BENCHMARK
          </h1>
        </Reveal>

        <div
          style={{
            width: 560,
            height: 2,
            margin: "44px auto 28px",
            background: C.accent,
            transform: `scaleX(${rule})`,
            transformOrigin: "left center",
            boxShadow: `0 0 16px ${C.accentSoft}`,
          }}
        />

        <Reveal local={frame} delay={48}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              letterSpacing: "0.32em",
              color: C.inkDim,
            }}
          >
            HOW MODELS SEE MOTION
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
