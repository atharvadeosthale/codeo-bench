import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts, palette } from "./theme";
import { AuroraBG } from "./Backgrounds";
import { staggerSpring } from "./util";

export const Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kicker = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 18 });
  const title = spring({ frame: frame - 16, fps, config: { damping: 200, mass: 0.9 } });
  const titleY = interpolate(title, [0, 1], [70, 0]);
  const reveal = interpolate(frame, [20, 48], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 22 });

  // sweeping highlight line
  const sweepX = interpolate(frame, [16, 60], [-200, 1400], { extrapolateRight: "clamp" });

  const out = interpolate(frame, [duration - 18, duration - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, duration], [1, 1.06]);

  const word = "LOWER THIRDS";

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <AuroraBG a={palette.cyan} b={palette.violet} />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              opacity: kicker,
              transform: `translateY(${interpolate(kicker, [0, 1], [20, 0])}px)`,
              marginBottom: 26,
            }}
          >
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,0.5)" }} />
            <span style={{ fontFamily: fonts.mono, fontSize: 18, letterSpacing: 10, color: "rgba(255,255,255,0.7)" }}>
              CODEO BENCH PRESENTS
            </span>
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,0.5)" }} />
          </div>

          <div style={{ position: "relative", display: "inline-block", overflow: "hidden", paddingBottom: 8 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: fonts.sans,
                fontSize: 150,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 0.95,
                color: palette.white,
                transform: `translateY(${titleY}px)`,
                clipPath: `inset(0 ${100 - reveal}% 0 0)`,
                textShadow: "0 20px 80px rgba(0,0,0,0.5)",
              }}
            >
              {word}
            </h1>
            {/* sweep glow over the title */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: sweepX,
                width: 160,
                background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.55), transparent)",
                transform: "skewX(-12deg)",
                mixBlendMode: "overlay",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 22,
              opacity: sub,
              transform: `translateY(${interpolate(sub, [0, 1], [18, 0])}px)`,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Eight broadcast-grade components · One continuous take
          </div>

          {/* dot row */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30 }}>
            {[palette.cyan, palette.violet, palette.magenta, palette.amber, palette.emerald].map((c, i) => {
              const s = staggerSpring(frame, fps, i, 50, 4);
              return (
                <span
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    boxShadow: `0 0 12px ${c}`,
                    transform: `scale(${s})`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
