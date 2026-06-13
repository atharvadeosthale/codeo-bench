import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { Caption, Kicker, SceneShell } from "../ui";

type F = { id: string; label: string; x: number; y: number };
const W = 1120;
const H = 480;

const FIBERS: F[] = [
  { id: "root", label: "HostRoot", x: 0.5, y: 0.12 },
  { id: "app", label: "App", x: 0.5, y: 0.45 },
  { id: "header", label: "Header", x: 0.26, y: 0.82 },
  { id: "main", label: "Main", x: 0.54, y: 0.82 },
  { id: "footer", label: "Footer", x: 0.82, y: 0.82 },
];
const M: Record<string, F> = Object.fromEntries(FIBERS.map((f) => [f.id, f]));
const X = (f: F) => f.x * W;
const Y = (f: F) => f.y * H;

// child edges (down), sibling edges (across)
const CHILD: [string, string][] = [
  ["root", "app"],
  ["app", "header"],
];
const SIBLING: [string, string][] = [
  ["header", "main"],
  ["main", "footer"],
];

// Depth-first work order with begin/complete labels.
const VISITS: { id: string; phase: string }[] = [
  { id: "root", phase: "beginWork" },
  { id: "app", phase: "beginWork" },
  { id: "header", phase: "beginWork" },
  { id: "header", phase: "completeWork" },
  { id: "main", phase: "beginWork" },
  { id: "main", phase: "completeWork" },
  { id: "footer", phase: "beginWork" },
  { id: "footer", phase: "completeWork" },
  { id: "app", phase: "completeWork" },
  { id: "root", phase: "completeWork" },
];

const FIELDS = [
  ["type", "Counter"],
  ["key", "null"],
  ["stateNode", "→ DOM node"],
  ["child", "→ fiber"],
  ["sibling", "→ fiber"],
  ["return", "→ parent"],
  ["alternate", "→ old fiber"],
];

export const FiberScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const nodeAppear = (i: number) =>
    interpolate(frame, [14 + i * 6, 14 + i * 6 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  // traversal
  const start = 66;
  const per = 12;
  const idx = Math.max(0, Math.min(VISITS.length - 1, Math.floor((frame - start) / per)));
  const active = frame >= start ? VISITS[idx] : null;

  const panelP = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "70px 96px" }}>
        <Kicker delay={2}>Step 05 — The data structure that runs it all</Kicker>
        <h2 style={{ margin: "16px 0 12px", fontSize: 56, fontWeight: 800, color: COLORS.white, letterSpacing: -1 }}>
          Meet the <span style={{ color: COLORS.react }}>Fiber</span> tree
        </h2>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 30 }}>
          {/* graph */}
          <div style={{ position: "relative", width: W, height: H }}>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <defs>
                <marker id="ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.react} />
                </marker>
                <marker id="ahy" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.yellow} />
                </marker>
                <marker id="ahv" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.violet} />
                </marker>
              </defs>
              {/* return edges (dashed, up) */}
              {CHILD.map(([p, c], i) => {
                const a = M[p], b = M[c];
                const dr = interpolate(frame, [40 + i * 4, 56 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <path key={`r${i}`} d={`M ${X(b) + 60} ${Y(b) - 22} C ${X(b) + 120} ${Y(b) - 60}, ${X(a) + 120} ${Y(a) + 60}, ${X(a) + 60} ${Y(a) + 22}`} fill="none" stroke={COLORS.violet} strokeWidth={2} strokeDasharray="5 6" opacity={0.5 * dr} markerEnd="url(#ahv)" />
                );
              })}
              {/* child edges */}
              {CHILD.map(([p, c], i) => {
                const a = M[p], b = M[c];
                const dr = interpolate(frame, [20 + i * 8, 38 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const len = Math.hypot(X(b) - X(a), Y(b) - Y(a));
                return <line key={`c${i}`} x1={X(a)} y1={Y(a) + 24} x2={X(b)} y2={Y(b) - 26} stroke={COLORS.react} strokeWidth={2.5} markerEnd="url(#ah)" strokeDasharray={len} strokeDashoffset={len * (1 - dr)} />;
              })}
              {/* sibling edges */}
              {SIBLING.map(([p, c], i) => {
                const a = M[p], b = M[c];
                const dr = interpolate(frame, [40 + i * 8, 56 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const len = X(b) - X(a);
                return <line key={`s${i}`} x1={X(a) + 64} y1={Y(a)} x2={X(b) - 66} y2={Y(b)} stroke={COLORS.yellow} strokeWidth={2.5} markerEnd="url(#ahy)" strokeDasharray={len} strokeDashoffset={len * (1 - dr)} />;
              })}
            </svg>

            {FIBERS.map((f, i) => {
              const p = nodeAppear(i);
              const isActive = active?.id === f.id;
              const glow = isActive ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
              return (
                <div
                  key={f.id}
                  style={{
                    position: "absolute",
                    left: X(f) - 64,
                    top: Y(f) - 24,
                    width: 128,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    fontFamily: FONT_MONO,
                    fontSize: 20,
                    fontWeight: 600,
                    color: COLORS.white,
                    background: isActive ? "linear-gradient(180deg,#1a2c4a,#122036)" : "#0f1c2e",
                    border: `2px solid ${isActive ? COLORS.react : COLORS.panelEdge}`,
                    boxShadow: isActive ? `0 0 ${20 + glow * 26}px ${COLORS.react}` : "0 10px 24px rgba(0,0,0,0.4)",
                    opacity: p,
                    transform: `scale(${interpolate(p, [0, 1], [0.5, isActive ? 1.06 : 1]).toFixed(3)})`,
                  }}
                >
                  {f.label}
                </div>
              );
            })}

            {/* phase label */}
            {active ? (
              <div style={{ position: "absolute", left: X(M[active.id]) - 64, top: Y(M[active.id]) + 30, width: 128, textAlign: "center", fontFamily: FONT_MONO, fontSize: 16, color: active.phase === "beginWork" ? COLORS.green : COLORS.orange }}>
                {active.phase}
              </div>
            ) : null}

            {/* edge legend */}
            <div style={{ position: "absolute", left: 0, bottom: -8, display: "flex", gap: 22, fontFamily: FONT_MONO, fontSize: 16, opacity: panelP }}>
              <LegendDot c={COLORS.react} t="child" />
              <LegendDot c={COLORS.yellow} t="sibling" />
              <LegendDot c={COLORS.violet} t="return" />
            </div>
          </div>

          {/* fiber fields panel */}
          <div
            style={{
              width: 340,
              borderRadius: 16,
              border: `1px solid ${COLORS.panelEdge}`,
              background: "linear-gradient(180deg,#0d1424,#090e1a)",
              padding: "20px 22px",
              fontFamily: FONT_MONO,
              opacity: panelP,
              transform: `translateX(${interpolate(panelP, [0, 1], [30, 0])}px)`,
              boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ color: COLORS.react, fontSize: 18, letterSpacing: 1, marginBottom: 14 }}>
              fiber = {"{"}
            </div>
            {FIELDS.map(([k, v], i) => {
              const fp = interpolate(frame, [50 + i * 5, 64 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 19, opacity: fp }}>
                  <span style={{ color: COLORS.violet }}>{k}</span>
                  <span style={{ color: COLORS.muted }}>{v}</span>
                </div>
              );
            })}
            <div style={{ color: COLORS.react, fontSize: 18, marginTop: 8 }}>{"}"}</div>
          </div>
        </div>

        <Caption delay={start + 8}>
          Each node is a Fiber — a unit of work React can pause, resume, and reuse.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};

const LegendDot: React.FC<{ c: string; t: string }> = ({ c, t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.muted }}>
    <span style={{ width: 22, height: 3, background: c, display: "inline-block" }} />
    {t}
  </div>
);
