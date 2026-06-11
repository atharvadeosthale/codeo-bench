import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption, NodeCard } from "../components/ui";
import { Svg, Line as SLine } from "../components/graphics";

type TreeNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  color: string;
  delay: number;
  parent?: string;
};

const NODES: TreeNode[] = [
  { id: "app", x: 520, y: 300, label: "<App />", sub: "component", color: C.purple, delay: 26 },
  { id: "div", x: 520, y: 455, label: '"div"', sub: 'className: "app"', color: C.cyan, delay: 52, parent: "app" },
  { id: "h1", x: 330, y: 615, label: '"h1"', sub: '"Hello, React"', color: C.cyan, delay: 78, parent: "div" },
  { id: "counter", x: 710, y: 615, label: "<Counter />", sub: "initial: 3", color: C.purple, delay: 78, parent: "div" },
  { id: "button", x: 710, y: 775, label: '"button"', sub: "count: 3", color: C.cyan, delay: 104, parent: "counter" },
];

export const VirtualDom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const panelEnter = spring({ frame, fps, delay: 130, config: { damping: 200 }, durationInFrames: 26 });
  const barElement = ramp(frame, 165, 30);
  const barDom = ramp(frame, 185, 40);

  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="02 · ELEMENTS" title="Render builds a tree of objects" accent={C.purple} />

      <Svg>
        {NODES.filter((n) => n.parent).map((n) => {
          const p = byId[n.parent as string];
          const draw = ramp(frame, n.delay + 8, 20);
          return (
            <SLine
              key={n.id}
              x1={p.x}
              y1={p.y + 40}
              x2={n.x}
              y2={n.y - 42}
              p={draw}
              color={C.faint}
              width={3}
            />
          );
        })}
      </Svg>

      {NODES.map((n) => {
        const s = spring({
          frame,
          fps,
          delay: n.delay,
          config: { damping: 13, mass: 0.6 },
          durationInFrames: 34,
        });
        return (
          <NodeCard
            key={n.id}
            x={n.x}
            y={n.y}
            w={222}
            h={84}
            label={n.label}
            sub={n.sub}
            color={n.color}
            enter={s}
            highlight={n.id === "app" ? pulse * 0.3 : 0}
          />
        );
      })}

      {/* tree annotation */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 855,
          fontFamily: MONO,
          fontSize: 22,
          color: C.dim,
          opacity: ramp(frame, 118, 20),
        }}
      >
        the “virtual DOM” — nothing on screen yet
      </div>

      <Panel title="why objects, not DOM nodes?" x={1080} y={258} w={750} h={540} enter={panelEnter} accent={C.green}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, paddingTop: 8 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 23, color: C.green, marginBottom: 12 }}>
              React element
            </div>
            <div
              style={{
                width: `${Math.max(0.04, barElement * 0.12) * 100}%`,
                height: 34,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${C.green}, ${C.green}88)`,
                boxShadow: `0 0 18px ${C.green}44`,
              }}
            />
            <div style={{ fontFamily: FONT, fontSize: 21, color: C.dim, marginTop: 10 }}>
              ~3 fields · created in nanoseconds · garbage-collected for free
            </div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 23, color: C.orange, marginBottom: 12 }}>
              real DOM node
            </div>
            <div
              style={{
                width: `${barDom * 100}%`,
                height: 34,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${C.orange}, ${C.red})`,
                boxShadow: `0 0 18px ${C.orange}44`,
              }}
            />
            <div style={{ fontFamily: FONT, fontSize: 21, color: C.dim, marginTop: 10 }}>
              200+ properties · styles, layout, paint — touching it is expensive
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              color: C.text,
              borderTop: `1px solid ${C.stroke}`,
              paddingTop: 24,
              opacity: ramp(frame, 215, 22),
              lineHeight: 1.5,
            }}
          >
            So React re-creates the <span style={{ color: C.green }}>object tree</span> on
            every render, then computes the{" "}
            <span style={{ color: C.orange }}>minimal DOM changes</span>.
          </div>
        </div>
      </Panel>

      <Caption at={252}>
        Describing the UI is cheap. Updating the screen is not. React separates the two.
      </Caption>
    </AbsoluteFill>
  );
};
