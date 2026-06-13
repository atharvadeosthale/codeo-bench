import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { Caption, Code, Panel, SceneHeading, Tok } from "../components/ui";
import { fadeUp, springIn } from "../components/anim";
import { hexA } from "../components/Background";

const jsx: Tok[][] = [
  [{ t: "function ", c: "kw" }, { t: "Like", c: "fn" }, { t: "() {" }],
  [{ t: "  return ", c: "kw" }, { t: "(" }],
  [
    { t: "    <button ", c: "tag" },
    { t: "className", c: "attr" },
    { t: "=", c: "punct" },
    { t: '"btn"', c: "str" },
    { t: ">", c: "tag" },
  ],
  [{ t: "      Likes: ", c: "plain" }, { t: "{count}", c: "cyan" }],
  [{ t: "    </button>", c: "tag" }],
  [{ t: "  )" }],
  [{ t: "}" }],
];

const createEl: Tok[][] = [
  [{ t: "React", c: "cyan" }, { t: ".", c: "punct" }, { t: "createElement", c: "fn" }, { t: "(" }],
  [{ t: '  "button"', c: "str" }, { t: ",", c: "punct" }],
  [
    { t: "  { ", c: "punct" },
    { t: "className", c: "attr" },
    { t: ": ", c: "punct" },
    { t: '"btn"', c: "str" },
    { t: " }", c: "punct" },
    { t: ",", c: "punct" },
  ],
  [{ t: '  "Likes: "', c: "str" }, { t: ", ", c: "punct" }, { t: "count", c: "cyan" }],
  [{ t: ")" }],
];

const obj: Tok[][] = [
  [{ t: "{" }],
  [{ t: "  $$typeof", c: "attr" }, { t: ": ", c: "punct" }, { t: "Symbol(react.element)", c: "comment" }, { t: ",", c: "punct" }],
  [{ t: "  type", c: "attr" }, { t: ": ", c: "punct" }, { t: '"button"', c: "str" }, { t: ",", c: "punct" }],
  [{ t: "  props", c: "attr" }, { t: ": {", c: "punct" }],
  [{ t: "    className", c: "attr" }, { t: ": ", c: "punct" }, { t: '"btn"', c: "str" }, { t: ",", c: "punct" }],
  [{ t: "    children", c: "attr" }, { t: ": [", c: "punct" }, { t: '"Likes: "', c: "str" }, { t: ", ", c: "punct" }, { t: "42", c: "cyan" }, { t: "]", c: "punct" }],
  [{ t: "  }," , c: "punct" }],
  [{ t: "  key", c: "attr" }, { t: ": ", c: "punct" }, { t: "null", c: "kw" }, { t: ", ", c: "punct" }, { t: "ref", c: "attr" }, { t: ": ", c: "punct" }, { t: "null", c: "kw" }],
  [{ t: "}" }],
];

const Arrow: React.FC<{ x: number; label: string; show: number }> = ({
  x,
  label,
  show,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn(frame, fps, show, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 430,
        transform: `translateX(-50%) scale(${p})`,
        opacity: p,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 60, color: COLORS.jsx, lineHeight: 1, filter: `drop-shadow(0 0 10px ${hexA(COLORS.jsx, 0.7)})` }}>
        →
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 16,
          color: COLORS.textDim,
          maxWidth: 130,
          fontFamily: "inherit",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const JsxToElement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p1 = fadeUp(frame, fps, 30);
  const p2 = fadeUp(frame, fps, 78);
  const p3 = fadeUp(frame, fps, 128);

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 01"
        title="JSX is just function calls"
        accent={COLORS.jsx}
      />

      <div
        style={{
          position: "absolute",
          top: 270,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Panel accent={COLORS.synTag} style={{ padding: "22px 14px", width: 470, ...p1 }} glow={0.5}>
          <Label text="What you write — JSX" color={COLORS.synTag} />
          <Code lines={jsx} fontSize={22} revealStart={34} />
        </Panel>

        <Panel accent={COLORS.jsx} style={{ padding: "22px 14px", width: 470, ...p2 }} glow={0.5}>
          <Label text="What the compiler emits" color={COLORS.jsx} />
          <Code lines={createEl} fontSize={22} revealStart={82} />
        </Panel>

        <Panel accent={COLORS.react} style={{ padding: "22px 14px", width: 470, ...p3 }} glow={0.6}>
          <Label text="What React gets — an element" color={COLORS.react} />
          <Code lines={obj} fontSize={19} revealStart={132} revealStep={4} />
        </Panel>
      </div>

      <Arrow x={530} label="Babel / TS transpiles" show={70} />
      <Arrow x={1000} label="called at runtime" show={120} />

      <div style={{ position: "absolute", bottom: 70, left: 80 }}>
        <Caption accent={COLORS.react} delay={165}>
          A React element is a <b style={{ color: COLORS.text }}>plain, immutable object</b> —
          a lightweight description of what should appear on screen. Nothing is touched in the DOM yet.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      fontFamily: "inherit",
      fontSize: 16,
      letterSpacing: 2,
      textTransform: "uppercase",
      color,
      marginBottom: 12,
      paddingLeft: 12,
      fontWeight: 700,
      opacity: 0.9,
    }}
  >
    {text}
  </div>
);
