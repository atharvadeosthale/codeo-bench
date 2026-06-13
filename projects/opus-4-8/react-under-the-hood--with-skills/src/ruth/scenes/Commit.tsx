import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO, FONT_SANS } from "../theme";
import { Caption, Kicker, SceneShell } from "../ui";

const STEPS = ["before mutation", "mutation", "layout"];

export const CommitScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const beam = interpolate(frame, [44, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const beamVis = frame >= 44 && frame <= 78 ? 1 : 0;
  const flip = frame >= 70; // number updates
  const flipP = interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const intro = (d: number) => interpolate(frame, [d, d + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "74px 110px" }}>
        <Kicker delay={2}>Step 07 — Touch the DOM, finally</Kicker>
        <h2 style={{ margin: "16px 0 8px", fontSize: 56, fontWeight: 800, color: COLORS.white, letterSpacing: -1 }}>
          The <span style={{ color: COLORS.green }}>commit</span> phase
        </h2>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "0 20px" }}>
          {/* left: effect list (changes to apply) */}
          <div style={{ opacity: intro(18), width: 470 }}>
            <div style={{ fontFamily: FONT_MONO, color: COLORS.muted, fontSize: 20, marginBottom: 14, letterSpacing: 1 }}>
              effect list — what to apply
            </div>
            <div style={{ borderRadius: 14, border: `1px solid ${COLORS.panelEdge}`, background: "#0c1322", overflow: "hidden", fontFamily: FONT_MONO }}>
              {[
                { tag: "UPDATE", txt: "button → textContent", c: COLORS.orange, on: true },
                { tag: "—", txt: "main (unchanged)", c: COLORS.faint, on: false },
                { tag: "—", txt: "App (unchanged)", c: COLORS.faint, on: false },
              ].map((r, i) => {
                const rp = interpolate(frame, [24 + i * 8, 38 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const pulse = r.on ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderBottom: i < 2 ? `1px solid ${COLORS.panelEdge}` : "none", opacity: rp, background: r.on ? `${COLORS.orange}${pulse > 0.5 ? "16" : "0c"}` : "transparent" }}>
                    <span style={{ fontSize: 16, color: r.c, border: `1px solid ${r.c}`, borderRadius: 6, padding: "2px 8px", minWidth: 70, textAlign: "center" }}>{r.tag}</span>
                    <span style={{ fontSize: 22, color: r.on ? COLORS.white : COLORS.muted }}>{r.txt}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {STEPS.map((s, i) => {
                const sp = interpolate(frame, [50 + i * 10, 62 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={s} style={{ flex: 1, textAlign: "center", padding: "8px 6px", borderRadius: 8, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.green, border: `1px solid ${COLORS.green}55`, background: `${COLORS.green}10`, opacity: sp }}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>

          {/* beam */}
          {beamVis ? (
            <div style={{ position: "absolute", left: 510, top: "42%", width: interpolate(beam, [0, 1], [0, 300]), height: 4, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.green})`, boxShadow: `0 0 20px ${COLORS.green}`, borderRadius: 4 }} />
          ) : null}

          {/* right: real browser */}
          <div style={{ opacity: intro(30), width: 560, transform: `scale(${interpolate(intro(30), [0, 1], [0.9, 1])})` }}>
            <div style={{ fontFamily: FONT_MONO, color: COLORS.muted, fontSize: 20, marginBottom: 14, textAlign: "right", letterSpacing: 1 }}>
              the real DOM
            </div>
            <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.panelEdge}`, boxShadow: `0 30px 80px rgba(0,0,0,0.55), ${flip ? `0 0 40px ${COLORS.green}55` : "none"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#1a2436" }}>
                <span style={{ width: 12, height: 12, borderRadius: 99, background: "#ff5f57" }} />
                <span style={{ width: 12, height: 12, borderRadius: 99, background: "#febc2e" }} />
                <span style={{ width: 12, height: 12, borderRadius: 99, background: "#28c840" }} />
                <span style={{ marginLeft: 12, color: "#8fa3bf", fontFamily: FONT_MONO, fontSize: 15 }}>localhost:3000</span>
              </div>
              <div style={{ height: 300, background: "linear-gradient(180deg,#f6f8fc,#e8edf6)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
                <div style={{ fontFamily: FONT_SANS, color: "#23304a", fontSize: 30, fontWeight: 700 }}>Counter Demo</div>
                <button
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "20px 40px",
                    background: `linear-gradient(180deg, ${COLORS.react}, #3aa0c4)`,
                    boxShadow: `0 14px 30px ${COLORS.react}66, ${flip ? `0 0 0 ${interpolate(flipP, [0, 1], [0, 6])}px ${COLORS.green}55` : "none"}`,
                    transform: `scale(${1 + (flip ? Math.max(0, Math.sin(flipP * Math.PI)) * 0.06 : 0)})`,
                  }}
                >
                  Clicked
                  <span style={{ color: flip ? "#0a3d12" : "#fff", margin: "0 0.3em" }}>{flip ? 4 : 3}</span>
                  times
                </button>
                <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: flip ? COLORS.green : "#90a0b8", height: 20 }}>
                  {flip ? "▲ 1 DOM node updated" : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Caption delay={84} accent={COLORS.green}>
          Only the flagged nodes are written to the DOM — everything else is left untouched.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
