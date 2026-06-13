import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, Connector, NodeBox, SceneHeading } from "../components/ui";
import { ramp } from "../components/anim";
import { hexA } from "../components/Background";

type N = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  appear: number;
  color?: string;
  parent?: string;
};

const NW = 150;
const nodes: N[] = [
  { id: "app", label: "<App>", sub: "component", x: 960, y: 330, appear: 6, color: COLORS.react },
  { id: "header", label: "<Header>", sub: "component", x: 620, y: 500, appear: 22, parent: "app", color: COLORS.jsx },
  { id: "feed", label: "<Feed>", sub: "component", x: 1300, y: 500, appear: 30, parent: "app", color: COLORS.jsx },
  { id: "logo", label: "<img>", x: 460, y: 670, appear: 44, parent: "header" },
  { id: "nav", label: "<nav>", x: 780, y: 670, appear: 50, parent: "header" },
  { id: "post1", label: "<Post>", sub: "id: 1", x: 1140, y: 670, appear: 58, parent: "feed", color: COLORS.add },
  { id: "post2", label: "<Post>", sub: "id: 2", x: 1460, y: 670, appear: 66, parent: "feed", color: COLORS.add },
  { id: "p1t", label: "<h2>", x: 1060, y: 840, appear: 78, parent: "post1" },
  { id: "p1b", label: "<button>", x: 1230, y: 840, appear: 84, parent: "post1" },
  { id: "p2t", label: "<h2>", x: 1400, y: 840, appear: 90, parent: "post2" },
  { id: "p2b", label: "<button>", x: 1560, y: 840, appear: 96, parent: "post2" },
];

const byId = (id: string) => nodes.find((n) => n.id === id)!;

export const VirtualDom: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 02"
        title="React builds a tree in memory"
        accent={COLORS.react}
      />

      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {nodes
          .filter((n) => n.parent)
          .map((n) => {
            const p = byId(n.parent!);
            const draw = ramp(frame, n.appear - 6, n.appear + 8);
            return (
              <Connector
                key={n.id}
                x1={p.x}
                y1={p.y + 28}
                x2={n.x}
                y2={n.y - 28}
                draw={draw}
                color={hexA(n.color ?? COLORS.reactDim, 0.7)}
              />
            );
          })}
      </svg>

      {nodes.map((n) => (
        <div
          key={n.id}
          style={{
            position: "absolute",
            left: n.x - NW / 2,
            top: n.y - 28,
            width: NW,
          }}
        >
          <NodeBox
            label={n.label}
            sub={n.sub}
            color={n.color ?? COLORS.react}
            appear={n.appear}
            width={NW}
          />
        </div>
      ))}

      {/* "Virtual DOM" badge */}
      <div
        style={{
          position: "absolute",
          top: 300,
          right: 90,
          opacity: ramp(frame, 110, 130),
          transform: `translateY(${interpolate(ramp(frame, 110, 130), [0, 1], [20, 0])}px)`,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 22,
            color: COLORS.textFaint,
            letterSpacing: 3,
          }}
        >
          a.k.a.
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.react,
            textShadow: `0 0 24px ${hexA(COLORS.react, 0.6)}`,
            fontFamily: FONT.sans,
          }}
        >
          the Virtual DOM
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 60, left: 80, right: 80 }}>
        <Caption accent={COLORS.react} delay={120}>
          Each element points to its children, forming a tree. It's{" "}
          <b style={{ color: COLORS.text }}>cheap JavaScript objects</b> — not real
          DOM nodes — so React can build, compare and throw it away fast.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};
