import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO, FONT_SANS } from "../theme";
import { Caption, Kicker, SceneShell } from "../ui";

const NODES = [
  { label: "setState()", sub: "you call it", color: COLORS.pink },
  { label: "Schedule", sub: "mark dirty", color: COLORS.yellow },
  { label: "Render", sub: "re-run components", color: COLORS.violet },
  { label: "Reconcile", sub: "diff the trees", color: COLORS.orange },
  { label: "Commit", sub: "patch the DOM", color: COLORS.green },
];

const CX = 560;
const CY = 300;
const R = 250;

const pos = (i: number) => {
  const ang = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2;
  return { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang), ang };
};

export const StateLoopScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const ringP = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // traveling activation
  const start = 56;
  const per = 16;
  const activeIdx = frame >= start ? Math.floor((frame - start) / per) % NODES.length : -1;
  const loops = frame >= start ? Math.floor((frame - start) / (per * NODES.length)) : 0;

  const intro = (d: number) => interpolate(frame, [d, d + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "70px 110px" }}>
        <Kicker delay={2}>Step 08 — What kicks it all off</Kicker>
        <h2 style={{ margin: "16px 0 0", fontSize: 56, fontWeight: 800, color: COLORS.white, letterSpacing: -1 }}>
          State change → the <span style={{ color: COLORS.react }}>render loop</span>
        </h2>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
          <div style={{ position: "relative", width: 1120, height: 600 }}>
            <svg width={1120} height={600} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <defs>
                <marker id="loopArr" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.react} />
                </marker>
              </defs>
              {/* connecting arcs */}
              {NODES.map((_, i) => {
                const a = pos(i);
                const b = pos((i + 1) % NODES.length);
                const seg = interpolate(frame, [24 + i * 6, 44 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                // arc midpoint pushed outward
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const ox = mx + (mx - CX) * 0.18;
                const oy = my + (my - CY) * 0.18;
                const len = 700;
                return (
                  <path
                    key={i}
                    d={`M ${a.x} ${a.y} Q ${ox} ${oy} ${b.x} ${b.y}`}
                    fill="none"
                    stroke={COLORS.panelEdge}
                    strokeWidth={3}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - seg)}
                    markerEnd="url(#loopArr)"
                    opacity={0.8}
                  />
                );
              })}
              {/* active arc glow */}
              {activeIdx >= 0 ? (() => {
                const a = pos(activeIdx);
                const b = pos((activeIdx + 1) % NODES.length);
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const ox = mx + (mx - CX) * 0.18;
                const oy = my + (my - CY) * 0.18;
                const t = ((frame - start) % per) / per;
                const qx = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * ox + t * t * b.x;
                const qy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * oy + t * t * b.y;
                return <circle cx={qx} cy={qy} r={9} fill={COLORS.react} style={{ filter: `drop-shadow(0 0 12px ${COLORS.react})` }} />;
              })() : null}
            </svg>

            {/* center hub */}
            <div style={{ position: "absolute", left: CX - 110, top: CY - 70, width: 220, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "radial-gradient(circle, #13203a, #0a1120)", border: `1.5px solid ${COLORS.panelEdge}`, opacity: ringP }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: COLORS.react }}>useState</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 16, color: COLORS.muted, marginTop: 6, textAlign: "center" }}>holds state on<br />the fiber</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 15, color: COLORS.green, marginTop: 8 }}>loops: {loops}</div>
            </div>

            {/* loop nodes */}
            {NODES.map((n, i) => {
              const p = pos(i);
              const active = activeIdx === i;
              const ip = intro(28 + i * 6);
              const glow = active ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
              return (
                <div
                  key={n.label}
                  style={{
                    position: "absolute",
                    left: p.x - 95,
                    top: p.y - 48,
                    width: 190,
                    height: 96,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    background: active ? `linear-gradient(180deg, ${n.color}33, ${n.color}10)` : "linear-gradient(180deg,#0e1626,#0a0f1c)",
                    border: `2px solid ${active ? n.color : COLORS.panelEdge}`,
                    boxShadow: active ? `0 0 ${24 + glow * 28}px ${n.color}` : "0 14px 30px rgba(0,0,0,0.45)",
                    opacity: ip,
                    transform: `scale(${interpolate(ip, [0, 1], [0.6, active ? 1.06 : 1]).toFixed(3)})`,
                    fontFamily: FONT_MONO,
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 700, color: active ? "#fff" : COLORS.white }}>{n.label}</div>
                  <div style={{ fontSize: 16, color: active ? n.color : COLORS.muted, marginTop: 4 }}>{n.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        <Caption delay={start + 6}>
          Every setState re-runs render → reconcile → commit — the same loop, forever.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
