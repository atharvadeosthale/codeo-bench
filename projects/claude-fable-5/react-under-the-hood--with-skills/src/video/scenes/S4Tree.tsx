import React from "react";
import { useCurrentFrame } from "remotion";
import { colors as C } from "../theme";
import { SceneShell, Caption, Chip, TreeNode, Edge, ez } from "../ui";

type NodeSpec = {
  x: number;
  y: number;
  label: string;
  sub?: string;
  at: number;
  color?: string;
  fontSize?: number;
};

const NODES: NodeSpec[] = [
  { x: 960, y: 330, label: "<App />", at: 25, color: C.accent },
  { x: 520, y: 510, label: "<header>", at: 70, color: C.blue },
  { x: 960, y: 510, label: "<Counter />", at: 80, color: C.accent },
  { x: 1400, y: 510, label: "<ul>", at: 90, color: C.blue },
  { x: 520, y: 680, label: "<h1>", sub: '"My App"', at: 125, color: C.blue, fontSize: 24 },
  { x: 960, y: 680, label: "<button>", at: 135, color: C.blue },
  { x: 1290, y: 680, label: "<li>", sub: '"a"', at: 145, color: C.blue, fontSize: 24 },
  { x: 1510, y: 680, label: "<li>", sub: '"b"', at: 152, color: C.blue, fontSize: 24 },
  { x: 960, y: 832, label: '"Count: 0"', at: 175, color: C.green, fontSize: 24 },
];

const EDGES: { from: [number, number]; to: [number, number]; at: number }[] = [
  { from: [960, 362], to: [520, 478], at: 48 },
  { from: [960, 362], to: [960, 478], at: 56 },
  { from: [960, 362], to: [1400, 478], at: 64 },
  { from: [520, 542], to: [520, 648], at: 105 },
  { from: [960, 542], to: [960, 648], at: 113 },
  { from: [1400, 542], to: [1290, 648], at: 121 },
  { from: [1400, 542], to: [1510, 648], at: 128 },
  { from: [960, 712], to: [960, 802], at: 158 },
];

export const S4Tree: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = ez(frame, 205, 14) - ez(frame, 250, 35) * 0.9;

  return (
    <SceneShell index="03" kicker="RENDER" title="Your components return a tree" seed={4}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {EDGES.map((e, i) => (
          <Edge key={i} from={e.from} to={e.to} at={e.at} frame={frame} />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <TreeNode
          key={i}
          x={n.x}
          y={n.y}
          label={n.label}
          sub={n.sub}
          at={n.at}
          frame={frame}
          color={n.color}
          flash={Math.max(0, flash)}
          fontSize={n.fontSize}
        />
      ))}

      <Chip at={215} x={1430} y={350} color={C.accent} fontSize={27}>
        the “virtual DOM”
      </Chip>

      <Caption at={255}>
        React calls your components and assembles the result into a tree — entirely in memory.
      </Caption>
    </SceneShell>
  );
};
