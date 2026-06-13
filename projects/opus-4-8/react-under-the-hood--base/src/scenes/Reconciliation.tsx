import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, Connector, NodeBox, SceneHeading } from "../components/ui";
import { springIn } from "../components/anim";
import { hexA } from "../components/Background";

type TN = { id: string; label: string; sub?: string; dx: number; dy: number; parent?: string };

// shared tree shape for both sides (dx relative to tree center, dy absolute)
const tree = (changedSub: string): TN[] => [
  { id: "post", label: "<Post>", dx: 0, dy: 330 },
  { id: "h2", label: "<h2>", sub: '"…"', dx: -150, dy: 500, parent: "post" },
  { id: "btn", label: "<button>", dx: 150, dy: 500, parent: "post" },
  { id: "txt", label: "text", sub: changedSub, dx: 150, dy: 670, parent: "btn" },
];

const NW = 150;

const Tree: React.FC<{
  cx: number;
  changedSub: string;
  appearBase: number;
  // per-node compare state keyed by id: 0 idle, 1 checking, 2 same, 3 changed
  state: Record<string, number>;
}> = ({ cx, changedSub, appearBase, state }) => {
  const nodes = tree(changedSub);
  const byId = (id: string) => nodes.find((n) => n.id === id)!;
  const order = ["post", "h2", "btn", "txt"];

  const colorFor = (id: string) => {
    const s = state[id] ?? 0;
    if (s === 3) return COLORS.change;
    if (s === 2) return COLORS.add;
    if (s === 1) return COLORS.fiber;
    return COLORS.reactDim;
  };

  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {nodes
          .filter((n) => n.parent)
          .map((n) => {
            const p = byId(n.parent!);
            return (
              <Connector
                key={n.id}
                x1={cx + p.dx}
                y1={p.dy + 28}
                x2={cx + n.dx}
                y2={n.dy - 28}
                draw={1}
                color={hexA(colorFor(n.id), 0.6)}
              />
            );
          })}
      </svg>
      {nodes.map((n) => {
        const i = order.indexOf(n.id);
        const emph = (state[n.id] ?? 0) >= 2 ? 0.8 : (state[n.id] ?? 0) === 1 ? 0.6 : 0;
        return (
          <div
            key={n.id}
            style={{ position: "absolute", left: cx + n.dx - NW / 2, top: n.dy - 28, width: NW }}
          >
            <NodeBox
              label={n.label}
              sub={n.sub}
              color={colorFor(n.id)}
              appear={appearBase + i * 6}
              width={NW}
              filled={(state[n.id] ?? 0) >= 2}
              emphasis={emph}
            />
          </div>
        );
      })}
    </>
  );
};

export const Reconciliation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // comparison schedule: each node compared at a frame
  const order = ["post", "h2", "btn", "txt"];
  const compareAt: Record<string, number> = { post: 100, h2: 124, btn: 148, txt: 172 };

  const stateFor = (id: string, isChanged: boolean): number => {
    const t = compareAt[id];
    if (frame < t) return 0;
    if (frame < t + 14) return 1; // checking
    return isChanged ? 3 : 2;
  };

  const leftState: Record<string, number> = {};
  const rightState: Record<string, number> = {};
  order.forEach((id) => {
    const changed = id === "txt";
    leftState[id] = stateFor(id, changed);
    rightState[id] = stateFor(id, changed);
  });

  const LCX = 560;
  const RCX = 1360;

  // scan beam connecting compared pairs
  const beamFor = (id: string) => {
    const t = compareAt[id];
    return interpolate(frame, [t, t + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const dyOf: Record<string, number> = { post: 330, h2: 500, btn: 500, txt: 670 };
  const dxOf: Record<string, number> = { post: 0, h2: -150, btn: 150, txt: 150 };

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 05"
        title="Reconciliation — diffing two trees"
        accent={COLORS.add}
      />

      {/* labels */}
      <div style={{ position: "absolute", top: 250, left: LCX - 120, width: 240, textAlign: "center", opacity: springIn(frame, fps, 6) }}>
        <Tag text="PREVIOUS TREE" color={COLORS.reactDim} />
      </div>
      <div style={{ position: "absolute", top: 250, left: RCX - 120, width: 240, textAlign: "center", opacity: springIn(frame, fps, 20) }}>
        <Tag text="NEXT TREE" color={COLORS.react} />
      </div>

      <Tree cx={LCX} changedSub='"Likes: 42"' appearBase={10} state={leftState} />
      <Tree cx={RCX} changedSub='"Likes: 43"' appearBase={24} state={rightState} />

      {/* compare beams */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {order.map((id) => {
          const b = beamFor(id);
          if (b <= 0) return null;
          const y = dyOf[id];
          const x1 = LCX + dxOf[id] + NW / 2;
          const x2 = RCX + dxOf[id] - NW / 2;
          const changed = id === "txt";
          const col = changed ? COLORS.change : COLORS.add;
          return (
            <g key={id}>
              <line
                x1={x1}
                y1={y}
                x2={interpolate(b, [0, 1], [x1, x2])}
                y2={y}
                stroke={col}
                strokeWidth={3}
                strokeDasharray="2 8"
                opacity={0.8}
              />
              {b >= 1 && (
                <text
                  x={(x1 + x2) / 2}
                  y={y - 16}
                  fill={col}
                  fontSize={28}
                  fontFamily={FONT.mono}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {changed ? "≠ changed" : "✓ same"}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", bottom: 56, left: 80, right: 80 }}>
        <Caption accent={COLORS.add} delay={195}>
          Same position, same type →{" "}
          <b style={{ color: COLORS.add }}>reuse the DOM node</b>. React keeps
          descending and finds the one real difference: the text{" "}
          <b style={{ color: COLORS.change }}>42 → 43</b>. Everything else is untouched.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span
    style={{
      fontFamily: FONT.mono,
      fontSize: 22,
      letterSpacing: 4,
      color,
      fontWeight: 700,
      padding: "6px 16px",
      borderRadius: 8,
      border: `1px solid ${hexA(color, 0.5)}`,
      background: hexA(color, 0.1),
    }}
  >
    {text}
  </span>
);
