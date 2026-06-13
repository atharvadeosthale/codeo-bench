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

const STYLES = [
  { name: "Glass", c: palette.cyan },
  { name: "Breaking", c: palette.red },
  { name: "Neon", c: palette.magenta },
  { name: "Minimal", c: "#9aa0ac" },
  { name: "Gradient", c: palette.violet },
  { name: "Terminal", c: palette.lime },
  { name: "Luxury", c: palette.gold },
  { name: "Social", c: "#FF0033" },
];

export const Outro: React.FC<{ duration: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inFade = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const title = spring({ frame: frame - 10, fps, config: { damping: 200, mass: 0.9 } });
  const titleScale = interpolate(title, [0, 1], [0.85, 1]);
  const lineW = interpolate(spring({ frame: frame - 70, fps, config: { damping: 200 } }), [0, 1], [0, 520]);
  const sign = spring({ frame: frame - 84, fps, config: { damping: 200 }, durationInFrames: 24 });

  return (
    <AbsoluteFill style={{ opacity: inFade }}>
      <AuroraBG a={palette.violet} b={palette.blue} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", transform: `scale(${titleScale})`, opacity: title }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 18, letterSpacing: 10, color: "rgba(255,255,255,0.65)", marginBottom: 22 }}>
            EIGHT WAYS TO LABEL THE FRAME
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 0.95,
              color: palette.white,
              textShadow: "0 20px 80px rgba(0,0,0,0.5)",
            }}
          >
            LOWER THIRDS
          </h1>
        </div>

        {/* style chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", maxWidth: 1100, marginTop: 44 }}>
          {STYLES.map((s, i) => {
            const sp = staggerSpring(frame, fps, i, 26, 4);
            return (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  opacity: sp,
                  transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px) scale(${interpolate(sp, [0, 1], [0.9, 1])})`,
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.c, boxShadow: `0 0 8px ${s.c}` }} />
                <span style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.92)", letterSpacing: 1 }}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* signature */}
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", opacity: sign }}>
          <div style={{ width: lineW, maxWidth: "90vw", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", marginBottom: 22 }} />
          <div style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 600, color: "#fff", letterSpacing: 3 }}>
            Built with <span style={{ color: palette.cyan }}>Remotion</span>
          </div>
          <div style={{ fontFamily: fonts.mono, fontSize: 15, letterSpacing: 5, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
            CODEO BENCH · OPUS 4.8
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
