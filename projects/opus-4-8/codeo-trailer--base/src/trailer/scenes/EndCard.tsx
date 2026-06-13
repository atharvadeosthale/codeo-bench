import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MONO, SANS } from "../fonts";
import { C } from "../theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const push = interpolate(frame, [0, 84], [1.04, 1.0], {
    easing: Easing.out(Easing.cubic),
  });

  // wordmark slides in
  const wordX = interpolate(frame, [4, 24], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const wordOp = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // lime "BENCH" chip pops with overshoot (mirrors the site's wordmark hover)
  const chip = spring({ frame: frame - 16, fps, config: { damping: 9, stiffness: 130, mass: 0.7 } });
  const chipRot = interpolate(chip, [0, 1], [-12, -3]);

  // tagline reveal
  const tagWipe = interpolate(frame, [30, 52], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const footerOp = interpolate(frame, [46, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorOn = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: C.bgDeep,
        alignItems: "center",
        justifyContent: "center",
        opacity: fade,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${push})` }}>
        {/* wordmark: Codeo + lime BENCH chip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 22,
            transform: `translateX(${wordX}px)`,
            opacity: wordOp,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 168,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Codeo
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "0.14em",
              color: "#0a0b07",
              background: C.accent,
              padding: "8px 18px",
              borderRadius: 8,
              transform: `translateY(-26px) scale(${chip}) rotate(${chipRot}deg)`,
              boxShadow: "0 10px 34px rgba(212,255,63,0.35)",
              display: "inline-block",
            }}
          >
            BENCH
          </span>
        </div>

        {/* CTA tagline */}
        <div style={{ overflow: "hidden", marginTop: 30 }}>
          <div
            style={{
              clipPath: `inset(0 0 ${tagWipe}% 0)`,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 52,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Press play. <span style={{ color: C.accent }}>Judge for yourself.</span>
            <span
              style={{
                display: "inline-block",
                width: 26,
                height: 46,
                marginLeft: 14,
                transform: "translateY(6px)",
                background: C.accent,
                opacity: cursorOn,
              }}
            />
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            opacity: footerOp,
            marginTop: 44,
            fontFamily: MONO,
            fontSize: 21,
            letterSpacing: "0.26em",
            color: C.inkDim,
          }}
        >
          CODE + VIDEO · A REMOTION BENCHMARK · NO SCORES
        </div>
      </div>
    </AbsoluteFill>
  );
};
