import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { Caption, Kicker, SceneShell } from "../ui";
import { TreeGraph, TreeNode } from "../Tree";

const mk = (changed: boolean): TreeNode[] => [
  { id: "app", label: "App", x: 0.5, y: 0.1, kind: "component", appear: 10 },
  { id: "main", label: "main", x: 0.5, y: 0.4, parent: "app", kind: "host", appear: 16 },
  { id: "btn", label: "button", x: 0.5, y: 0.7, parent: "main", kind: "host", appear: 22 },
  {
    id: "txt",
    label: changed ? '"4 times"' : '"3 times"',
    x: 0.5,
    y: 0.95,
    parent: "btn",
    kind: "text",
    appear: 28,
    status: changed ? "changed" : "same",
  },
];

const OLD = mk(false);
const NEW = mk(true);

export const ReconcileScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const colW = 520;
  const colH = 440;

  const scan = interpolate(frame, [56, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const scanVis = frame >= 56 && frame <= 100 ? 1 : 0;
  const found = interpolate(frame, [96, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const labP = (d: number) => interpolate(frame, [d, d + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "70px 110px", alignItems: "center" }}>
        <div style={{ alignSelf: "flex-start" }}>
          <Kicker delay={2}>Step 06 — Spot the difference</Kicker>
          <h2 style={{ margin: "16px 0 0", fontSize: 56, fontWeight: 800, color: COLORS.white, letterSpacing: -1 }}>
            <span style={{ color: COLORS.orange }}>Reconciliation</span> — diffing new against old
          </h2>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 80, position: "relative" }}>
          <div style={{ opacity: labP(8) }}>
            <ColLabel text="PREVIOUS render" color={COLORS.muted} />
            <TreeGraph nodes={OLD} width={colW} height={colH} nodeW={148} drawStart={10} />
          </div>

          {/* center comparator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: labP(48) }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 40, color: COLORS.react }}>⇄</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: COLORS.muted, letterSpacing: 2 }}>diff</div>
          </div>

          <div style={{ opacity: labP(8) }}>
            <ColLabel text="NEXT render" color={COLORS.react} />
            <TreeGraph nodes={NEW} width={colW} height={colH} nodeW={148} drawStart={10} />
          </div>

          {/* scanning line */}
          {scanVis ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: interpolate(scan, [0, 1], [40, colH + 30]),
                height: 3,
                background: `linear-gradient(90deg, transparent, ${COLORS.react}, transparent)`,
                boxShadow: `0 0 24px ${COLORS.react}`,
              }}
            />
          ) : null}

          {/* found change badge */}
          <div
            style={{
              position: "absolute",
              right: 30,
              bottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 10,
              background: `${COLORS.orange}1f`,
              border: `1.5px solid ${COLORS.orange}`,
              fontFamily: FONT_MONO,
              fontSize: 20,
              color: COLORS.orange,
              opacity: found,
              transform: `scale(${interpolate(found, [0, 1], [0.7, 1])})`,
            }}
          >
            ● 1 change found — update text only
          </div>
        </div>

        <Caption delay={108} accent={COLORS.orange}>
          Same structure is reused; React records the one node that actually changed.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};

const ColLabel: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ textAlign: "center", marginBottom: 6, fontFamily: FONT_MONO, fontSize: 18, letterSpacing: 3, color }}>
    {text}
  </div>
);
