import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AtomLogo } from "../AtomLogo";
import { COLORS, FONT_MONO, FONT_SANS } from "../theme";
import { SceneShell } from "../ui";

const PHASES = [
  { n: "01", label: "Render", desc: "call components → element tree", c: COLORS.violet },
  { n: "02", label: "Reconcile", desc: "diff new vs old fibers", c: COLORS.orange },
  { n: "03", label: "Commit", desc: "patch the real DOM", c: COLORS.green },
];

export const OutroScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const intro = (d: number) => interpolate(frame, [d, d + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const titleP = intro(8);
  const logoP = intro(0);

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
        <div style={{ opacity: logoP * 0.22, transform: `scale(${interpolate(logoP, [0, 1], [0.7, 1])})`, position: "absolute", top: 80 }}>
          <AtomLogo size={260} speed={0.8} />
        </div>

        <div style={{ textAlign: "center", opacity: titleP, transform: `translateY(${interpolate(titleP, [0, 1], [30, 0])}px)`, zIndex: 2 }}>
          <div style={{ fontFamily: FONT_MONO, color: COLORS.react, letterSpacing: 8, fontSize: 22, marginBottom: 16 }}>THE WHOLE LOOP</div>
          <h1 style={{ fontFamily: FONT_SANS, fontSize: 76, fontWeight: 800, color: COLORS.white, margin: 0, letterSpacing: -2 }}>
            Render · Reconcile · Commit
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "stretch", gap: 24, zIndex: 2 }}>
          {PHASES.map((p, i) => {
            const ip = intro(34 + i * 12);
            return (
              <React.Fragment key={p.label}>
                <div
                  style={{
                    width: 300,
                    padding: "28px 26px",
                    borderRadius: 18,
                    background: "linear-gradient(180deg,#0e1626,#0a0f1c)",
                    border: `1.5px solid ${p.c}`,
                    boxShadow: `0 0 30px ${p.c}33, 0 24px 60px rgba(0,0,0,0.5)`,
                    opacity: ip,
                    transform: `translateY(${interpolate(ip, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div style={{ fontFamily: FONT_MONO, color: p.c, fontSize: 20, marginBottom: 10 }}>{p.n}</div>
                  <div style={{ fontFamily: FONT_SANS, color: "#fff", fontSize: 34, fontWeight: 700 }}>{p.label}</div>
                  <div style={{ fontFamily: FONT_MONO, color: COLORS.muted, fontSize: 18, marginTop: 8 }}>{p.desc}</div>
                </div>
                {i < PHASES.length - 1 ? (
                  <div style={{ display: "flex", alignItems: "center", color: COLORS.faint, fontSize: 36, opacity: intro(40 + i * 12) }}>→</div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: COLORS.muted, opacity: intro(78), zIndex: 2, marginTop: 6 }}>
          That's React — <span style={{ color: COLORS.react }}>under the hood</span>.
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
