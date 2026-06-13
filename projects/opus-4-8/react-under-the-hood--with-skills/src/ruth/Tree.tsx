import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_MONO } from "./theme";

export type TreeNode = {
  id: string;
  label: string;
  x: number; // 0..1 within the box
  y: number; // 0..1
  parent?: string;
  color?: string;
  kind?: "component" | "host" | "text";
  appear?: number; // frame this node pops in
  status?: "same" | "changed" | "new";
};

const KIND_STYLE: Record<string, { bg: string; border: string; icon: string }> = {
  component: { bg: "#13203a", border: COLORS.violet, icon: "⚛" },
  host: { bg: "#0f1c2e", border: COLORS.react, icon: "</>" },
  text: { bg: "#13241a", border: COLORS.green, icon: '"' },
};

export const TreeGraph: React.FC<{
  nodes: TreeNode[];
  width: number;
  height: number;
  drawStart?: number;
  drawPer?: number;
  nodeW?: number;
}> = ({ nodes, width, height, drawStart = 0, drawPer = 7, nodeW = 150 }) => {
  const frame = useCurrentFrame();
  const byId = React.useMemo(() => {
    const m: Record<string, TreeNode> = {};
    nodes.forEach((n) => (m[n.id] = n));
    return m;
  }, [nodes]);

  const px = (n: TreeNode) => n.x * width;
  const py = (n: TreeNode) => n.y * height;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          if (!n.parent) return null;
          const p = byId[n.parent];
          if (!p) return null;
          const appear = n.appear ?? drawStart + i * drawPer;
          const draw = interpolate(frame, [appear, appear + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x1 = px(p);
          const y1 = py(p) + 26;
          const x2 = px(n);
          const y2 = py(n) - 26;
          const my = (y1 + y2) / 2;
          const path = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
          const len = Math.hypot(x2 - x1, y2 - y1) + 80;
          const stroke =
            n.status === "changed"
              ? COLORS.orange
              : n.status === "new"
                ? COLORS.green
                : COLORS.panelEdge;
          return (
            <path
              key={`e${n.id}`}
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={n.status && n.status !== "same" ? 3 : 2}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
              opacity={n.status && n.status !== "same" ? 0.95 : 0.6}
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const appear = n.appear ?? drawStart + i * drawPer;
        const p = interpolate(frame, [appear, appear + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ks = KIND_STYLE[n.kind ?? "host"];
        const border =
          n.status === "changed"
            ? COLORS.orange
            : n.status === "new"
              ? COLORS.green
              : (n.color ?? ks.border);
        const pulse =
          n.status === "changed"
            ? 0.5 + 0.5 * Math.sin(frame / 6)
            : 0;
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: px(n) - nodeW / 2,
              top: py(n) - 26,
              width: nodeW,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 12,
              background: ks.bg,
              border: `2px solid ${border}`,
              boxShadow:
                n.status === "changed"
                  ? `0 0 ${18 + pulse * 22}px ${COLORS.orange}`
                  : n.status === "new"
                    ? `0 0 22px ${COLORS.green}88`
                    : `0 10px 24px rgba(0,0,0,0.45)`,
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
              fontFamily: FONT_MONO,
            }}
          >
            <span style={{ color: border, fontSize: 15, opacity: 0.9 }}>{ks.icon}</span>
            <span style={{ color: COLORS.white, fontSize: 20, fontWeight: 600 }}>
              {n.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
