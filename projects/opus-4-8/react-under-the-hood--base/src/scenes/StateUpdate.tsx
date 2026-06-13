import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, Code, Panel, SceneHeading, Tok } from "../components/ui";
import { AppUI } from "../components/AppUI";
import { ramp, springIn } from "../components/anim";
import { hexA } from "../components/Background";

const code: Tok[][] = [
  [{ t: "function ", c: "kw" }, { t: "Post", c: "fn" }, { t: "() {" }],
  [
    { t: "  const ", c: "kw" },
    { t: "[count, setCount]", c: "cyan" },
    { t: " = ", c: "punct" },
    { t: "useState", c: "fn" },
    { t: "(", c: "punct" },
    { t: "42", c: "cyan" },
    { t: ")", c: "punct" },
  ],
  [{ t: "" }],
  [{ t: "  return ", c: "kw" }, { t: "(" }],
  [
    { t: "    <button ", c: "tag" },
    { t: "onClick", c: "attr" },
    { t: "=", c: "punct" },
    { t: "{() => ", c: "punct" },
    { t: "setCount", c: "fn" },
    { t: "(count + ", c: "punct" },
    { t: "1", c: "cyan" },
    { t: ")}", c: "punct" },
    { t: ">", c: "tag" },
  ],
  [{ t: "      Likes: ", c: "plain" }, { t: "{count}", c: "cyan" }],
  [{ t: "    </button>", c: "tag" }],
  [{ t: "  )" }],
  [{ t: "}" }],
];

const CLICK = 70;

export const StateUpdate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clicked = frame >= CLICK;
  const count = clicked ? 43 : 42;

  // cursor travels to button then clicks
  const travel = ramp(frame, 28, CLICK);
  const cx = interpolate(travel, [0, 1], [1700, 1330]);
  const cy = interpolate(travel, [0, 1], [900, 690]);
  const clickPop = clicked
    ? interpolate(frame, [CLICK, CLICK + 6, CLICK + 14], [1, 0.8, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  const flash = clicked
    ? interpolate(frame, [CLICK, CLICK + 10, CLICK + 40], [0, 1, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // setState callout
  const callP = clicked ? springIn(frame, fps, CLICK + 4, 13) : 0;

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 04"
        title="State change schedules a re-render"
        accent={COLORS.change}
      />

      <Panel
        accent={COLORS.change}
        glow={0.5}
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          width: 760,
          padding: "26px 16px",
          opacity: springIn(frame, fps, 12, 16),
        }}
      >
        <Code lines={code} fontSize={24} highlightLine={clicked ? 4 : 1} />
      </Panel>

      {/* App */}
      <div style={{ position: "absolute", top: 300, right: 110 }}>
        <AppUI count={count} flash={flash} liked={clicked} width={520} />
      </div>

      {/* cursor */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {clicked &&
          [0, 1].map((i) => {
            const r = interpolate(
              frame,
              [CLICK, CLICK + 24],
              [10, 70 + i * 25],
              { extrapolateRight: "clamp" },
            );
            const o = interpolate(frame, [CLICK, CLICK + 24], [0.6, 0], {
              extrapolateRight: "clamp",
            });
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.change} strokeWidth={3} opacity={o} />
            );
          })}
        <g transform={`translate(${cx}, ${cy}) scale(${clickPop})`}>
          <path
            d="M0 0 L0 26 L7 19 L12 30 L17 28 L12 17 L22 17 Z"
            fill="#fff"
            stroke="#0a0f1c"
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}
          />
        </g>
      </svg>

      {/* setState callout */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 200,
          opacity: callP,
          transform: `translateY(${interpolate(callP, [0, 1], [20, 0])}px) scale(${callP})`,
          background: hexA(COLORS.change, 0.16),
          border: `2px solid ${COLORS.change}`,
          borderRadius: 14,
          padding: "14px 22px",
          fontFamily: FONT.mono,
          fontSize: 24,
          color: COLORS.change,
          fontWeight: 700,
          boxShadow: `0 0 30px ${hexA(COLORS.change, 0.5)}`,
        }}
      >
        setCount(43) → ⚡ enqueue re-render of &lt;Post&gt;
      </div>

      <div style={{ position: "absolute", bottom: 60, left: 80, right: 80 }}>
        <Caption accent={COLORS.change} delay={CLICK + 20}>
          React doesn't touch the DOM here. It marks the component{" "}
          <b style={{ color: COLORS.text }}>dirty</b> and schedules work — then
          re-runs the component to produce a <i>new</i> element tree.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};
