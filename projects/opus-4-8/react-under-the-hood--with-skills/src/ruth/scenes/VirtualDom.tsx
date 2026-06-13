import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { Caption, Kicker, SceneShell } from "../ui";
import { TreeGraph, TreeNode } from "../Tree";

const NODES: TreeNode[] = [
  { id: "app", label: "App", x: 0.5, y: 0.08, kind: "component", appear: 14 },
  { id: "header", label: "Header", x: 0.18, y: 0.37, parent: "app", kind: "host", appear: 28 },
  { id: "main", label: "Main", x: 0.5, y: 0.37, parent: "app", kind: "host", appear: 34 },
  { id: "footer", label: "Footer", x: 0.82, y: 0.37, parent: "app", kind: "host", appear: 40 },
  { id: "logo", label: "Logo", x: 0.09, y: 0.66, parent: "header", kind: "host", appear: 52 },
  { id: "nav", label: "Nav", x: 0.27, y: 0.66, parent: "header", kind: "host", appear: 58 },
  { id: "counter", label: "Counter", x: 0.5, y: 0.66, parent: "main", kind: "component", appear: 64 },
  { id: "button", label: "button", x: 0.5, y: 0.93, parent: "counter", kind: "host", appear: 78 },
];

const Legend: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [88, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const items = [
    { c: COLORS.violet, t: "Component" },
    { c: COLORS.react, t: "Host element" },
  ];
  return (
    <div style={{ display: "flex", gap: 28, opacity: p, marginBottom: 64 }}>
      {items.map((it) => (
        <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT_MONO, fontSize: 20, color: COLORS.muted }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: it.c, boxShadow: `0 0 10px ${it.c}` }} />
          {it.t}
        </div>
      ))}
    </div>
  );
};

export const VirtualDomScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "70px 110px", alignItems: "center" }}>
        <div style={{ alignSelf: "flex-start" }}>
          <Kicker delay={2}>Step 03 — Objects form a tree</Kicker>
          <h2
            style={{
              margin: "16px 0 0",
              fontSize: 56,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: -1,
            }}
          >
            The <span style={{ color: COLORS.react }}>Virtual DOM</span> — a tree of
            those objects
          </h2>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <TreeGraph nodes={NODES} width={1180} height={540} nodeW={150} />
        </div>
        <Legend frame={frame} />
        <Caption delay={112}>
          A lightweight blueprint of your UI — cheap to build, cheap to throw away.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
