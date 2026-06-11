import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const WIDTH = 1920;
const HEIGHT = 1080;
const VIDEO_FRAMES = 2880;

const palette = {
  bg: "#080a12",
  bg2: "#101525",
  ink: "#f7fbff",
  muted: "#8ea0bd",
  cyan: "#39d8ff",
  mint: "#42f5b0",
  yellow: "#ffd166",
  coral: "#ff6b6b",
  violet: "#9b7cff",
  blue: "#5f8cff",
  panel: "rgba(13, 19, 35, 0.82)",
  panel2: "rgba(20, 30, 52, 0.92)",
  stroke: "rgba(134, 181, 255, 0.24)",
};

const sceneDefs = [
  { key: "intro", label: "Overview", start: 0, end: 300 },
  { key: "elements", label: "Elements", start: 270, end: 600 },
  { key: "fiber", label: "Fiber", start: 570, end: 930 },
  { key: "scheduler", label: "Scheduler", start: 900, end: 1260 },
  { key: "reconcile", label: "Reconcile", start: 1230, end: 1590 },
  { key: "hooks", label: "Hooks", start: 1560, end: 1920 },
  { key: "commit", label: "Commit", start: 1890, end: 2280 },
  { key: "browser", label: "Browser", start: 2250, end: 2610 },
  { key: "recap", label: "Cycle", start: 2580, end: VIDEO_FRAMES },
] as const;

type SceneProps = {
  start: number;
  end: number;
};

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const ease = (value: number) => Easing.bezier(0.16, 1, 0.3, 1)(clamp(value));

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const fade = (frame: number, start: number, end: number, fadeFrames = 34) => {
  const fadeIn = interpolate(frame, [start, start + fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - fadeFrames, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return Math.min(fadeIn, fadeOut);
};

const inRange = (frame: number, start: number, end: number) =>
  frame >= start - 50 && frame <= end + 50;

const localProgress = (frame: number, start: number, end: number) =>
  clamp((frame - start) / (end - start));

const rise = (local: number, delay = 0, amount = 36) =>
  interpolate(local, [delay, delay + 34], [amount, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const appear = (local: number, delay = 0, duration = 30) =>
  interpolate(local, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const panelBase: CSSProperties = {
  border: `1px solid ${palette.stroke}`,
  background:
    "linear-gradient(145deg, rgba(18,26,47,0.94), rgba(8,12,24,0.78))",
  boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
  borderRadius: 24,
};

const mono: CSSProperties = {
  fontFamily:
    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
};

const textShadow = "0 0 22px rgba(57, 216, 255, 0.28)";

const particles = Array.from({ length: 84 }, (_, index) => ({
  id: index,
  x: (index * 227) % WIDTH,
  y: (index * 131) % HEIGHT,
  size: 2 + ((index * 7) % 9),
  speed: 0.18 + ((index * 13) % 18) / 50,
  drift: 0.2 + ((index * 17) % 30) / 80,
  tone:
    index % 5 === 0
      ? palette.mint
      : index % 3 === 0
        ? palette.violet
        : palette.cyan,
}));

const introTokens = [
  "JSX",
  "element",
  "fiber",
  "lanes",
  "render",
  "diff",
  "commit",
  "DOM",
  "effects",
];

const elementCode = [
  "function Counter() {",
  "  const [count, setCount] = useState(0);",
  "  return <Button tone=\"blue\">{count}</Button>;",
  "}",
];

const elementObject = [
  "{",
  "  type: Button,",
  "  key: null,",
  "  props: {",
  "    tone: 'blue',",
  "    children: count",
  "  }",
  "}",
];

const fiberNodes = [
  { id: "App", x: 90, y: 62, color: palette.cyan },
  { id: "Shell", x: 90, y: 202, color: palette.blue },
  { id: "Counter", x: 310, y: 202, color: palette.mint },
  { id: "Button", x: 310, y: 342, color: palette.yellow },
  { id: "Text", x: 530, y: 342, color: palette.violet },
];

const fiberLinks = [
  [0, 1, "child"],
  [1, 2, "sibling"],
  [2, 3, "child"],
  [3, 4, "sibling"],
] as const;

const lanes = [
  { label: "Sync", detail: "click, input", color: palette.coral },
  { label: "Input", detail: "typing", color: palette.yellow },
  { label: "Default", detail: "setState", color: palette.cyan },
  { label: "Transition", detail: "non-urgent UI", color: palette.mint },
  { label: "Idle", detail: "background", color: palette.violet },
];

const reconcileOld = [
  { key: "A", label: "Todo A", color: palette.cyan },
  { key: "B", label: "Todo B", color: palette.mint },
  { key: "C", label: "Todo C", color: palette.yellow },
];

const reconcileNew = [
  { key: "B", label: "Todo B", color: palette.mint },
  { key: "A", label: "Todo A", color: palette.cyan },
  { key: "D", label: "Todo D", color: palette.violet },
];

const hookRows = [
  { label: "useState", value: "memoizedState: 0 -> 1", color: palette.cyan },
  { label: "useMemo", value: "deps: [count]", color: palette.yellow },
  { label: "useEffect", value: "passive effect tag", color: palette.mint },
];

const commitSteps = [
  {
    label: "Before mutation",
    detail: "read snapshots",
    color: palette.violet,
  },
  {
    label: "Mutation",
    detail: "insert, update, delete DOM",
    color: palette.coral,
  },
  {
    label: "Layout effects",
    detail: "refs + useLayoutEffect",
    color: palette.mint,
  },
  {
    label: "Passive effects",
    detail: "useEffect after paint",
    color: palette.cyan,
  },
];

const browserPipe = [
  { label: "DOM", detail: "nodes", color: palette.cyan },
  { label: "CSSOM", detail: "rules", color: palette.violet },
  { label: "Layout", detail: "geometry", color: palette.yellow },
  { label: "Paint", detail: "pixels", color: palette.coral },
  { label: "Composite", detail: "layers", color: palette.mint },
];

const cycleNodes = [
  { label: "Event", color: palette.coral },
  { label: "Update", color: palette.yellow },
  { label: "Lane", color: palette.violet },
  { label: "Render", color: palette.cyan },
  { label: "Reconcile", color: palette.mint },
  { label: "Commit", color: palette.coral },
  { label: "Browser", color: palette.blue },
  { label: "Effects", color: palette.mint },
];

const SceneLayer: React.FC<
  SceneProps & {
    children: ReactNode;
  }
> = ({ start, end, children }) => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, start, end);
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const StageTitle: React.FC<{
  eyebrow: string;
  title: string;
  body: string;
  local: number;
}> = ({ eyebrow, title, body, local }) => (
  <div
    style={{
      position: "absolute",
      left: 92,
      top: 86,
      width: 880,
      transform: `translateY(${rise(local, 0, 28)}px)`,
      opacity: appear(local, 0, 28),
    }}
  >
    <div
      style={{
        ...mono,
        color: palette.cyan,
        fontSize: 24,
        letterSpacing: 0,
        textTransform: "uppercase",
        marginBottom: 14,
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        color: palette.ink,
        fontSize: 72,
        lineHeight: 0.95,
        fontWeight: 850,
        letterSpacing: 0,
        textShadow,
      }}
    >
      {title}
    </div>
    <div
      style={{
        color: palette.muted,
        fontSize: 28,
        lineHeight: 1.35,
        width: 760,
        marginTop: 20,
      }}
    >
      {body}
    </div>
  </div>
);

const Panel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  label?: string;
}> = ({ children, style, label }) => (
  <div
    style={{
      ...panelBase,
      position: "absolute",
      overflow: "hidden",
      ...style,
    }}
  >
    {label ? (
      <div
        style={{
          ...mono,
          color: palette.cyan,
          fontSize: 18,
          padding: "20px 24px 0",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    ) : null}
    {children}
  </div>
);

const Chip: React.FC<{
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}> = ({ children, color = palette.cyan, style }) => (
  <div
    style={{
      ...mono,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${color}66`,
      color,
      background: `${color}18`,
      borderRadius: 999,
      padding: "8px 14px",
      fontSize: 18,
      lineHeight: 1,
      boxShadow: `0 0 24px ${color}22`,
      ...style,
    }}
  >
    {children}
  </div>
);

const Dot: React.FC<{
  color: string;
  size?: number;
  style?: CSSProperties;
}> = ({ color, size = 10, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: color,
      boxShadow: `0 0 24px ${color}`,
      ...style,
    }}
  />
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 16% 18%, rgba(57,216,255,0.22), transparent 31%), radial-gradient(circle at 82% 26%, rgba(155,124,255,0.20), transparent 34%), radial-gradient(circle at 68% 82%, rgba(66,245,176,0.13), transparent 32%), linear-gradient(135deg, #070911 0%, #11192e 48%, #070911 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.25,
          backgroundImage:
            "linear-gradient(rgba(120, 176, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 176, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform: `translate(${-(frame % 72)}px, ${-(frame % 72)}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.18,
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 5px)",
          mixBlendMode: "screen",
        }}
      />
      {particles.map((particle) => {
        const x = (particle.x + frame * particle.speed) % WIDTH;
        const y =
          (particle.y +
            Math.sin(frame / 38 + particle.id) * 18 +
            frame * particle.drift) %
          HEIGHT;
        const opacity =
          0.25 + Math.sin(frame / 21 + particle.id * 0.63) * 0.18;
        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size,
              background: particle.tone,
              opacity,
              boxShadow: `0 0 ${particle.size * 4}px ${particle.tone}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.78)",
        }}
      />
    </AbsoluteFill>
  );
};

const GlobalHud: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const active =
    sceneDefs.find((scene) => frame >= scene.start && frame < scene.end) ??
    sceneDefs[sceneDefs.length - 1];
  const progress = frame / Math.max(1, durationInFrames - 1);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          ...mono,
          position: "absolute",
          left: 54,
          top: 34,
          color: "rgba(247,251,255,0.78)",
          fontSize: 18,
        }}
      >
        React internals / {active.label}
      </div>
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 34,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Dot color={palette.mint} size={8} />
        <div
          style={{
            ...mono,
            color: "rgba(247,251,255,0.66)",
            fontSize: 18,
          }}
        >
          30 fps / frame {frame}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          bottom: 34,
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, #39d8ff, #42f5b0, #ffd166, #ff6b6b)",
            boxShadow: "0 0 32px rgba(57,216,255,0.65)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const ConnectorLine: React.FC<{
  from: Point;
  to: Point;
  color?: string;
  opacity?: number;
  width?: number;
  dashed?: boolean;
}> = ({
  from,
  to,
  color = palette.cyan,
  opacity = 1,
  width = 3,
  dashed = false,
}) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
      pointerEvents: "none",
    }}
  >
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? "10 12" : undefined}
      opacity={opacity}
    />
  </svg>
);

const IntroScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const p = ease(localProgress(frame, start, end));
  const ring = local * 1.8;
  const titleScale = interpolate(local, [0, 70], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneLayer start={start} end={end}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 52%, rgba(57,216,255,0.12), transparent 34%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 238,
          width: 980,
          transform: `scale(${titleScale}) translateY(${rise(local, 0, 54)}px)`,
          transformOrigin: "left center",
          opacity: appear(local, 0, 40),
        }}
      >
        <div
          style={{
            ...mono,
            color: palette.mint,
            fontSize: 28,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          From JSX to pixels
        </div>
        <div
          style={{
            color: palette.ink,
            fontSize: 126,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: 0,
            textShadow,
          }}
        >
          React under
          <br />
          the hood
        </div>
        <div
          style={{
            color: palette.muted,
            fontSize: 34,
            lineHeight: 1.35,
            width: 780,
            marginTop: 30,
          }}
        >
          A visual pass through elements, fibers, scheduling,
          reconciliation, hooks, commit, and the browser pipeline.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 210,
          top: 178,
          width: 560,
          height: 560,
          opacity: appear(local, 34, 44),
          transform: `rotate(${ring}deg) scale(${mix(0.82, 1, p)})`,
        }}
      >
        <AtomVisual frame={frame} />
      </div>

      {introTokens.map((token, index) => {
        const angle = (index / introTokens.length) * Math.PI * 2 + local / 70;
        const radius = 305 + Math.sin(local / 32 + index) * 18;
        const x = 1460 + Math.cos(angle) * radius;
        const y = 456 + Math.sin(angle) * radius * 0.58;
        return (
          <Chip
            key={token}
            color={
              index % 3 === 0
                ? palette.cyan
                : index % 3 === 1
                  ? palette.mint
                  : palette.violet
            }
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: appear(local, 60 + index * 6, 24),
              transform: `translate(-50%, -50%) scale(${
                0.9 + Math.sin(local / 18 + index) * 0.04
              })`,
            }}
          >
            {token}
          </Chip>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 205,
          bottom: 135,
          display: "flex",
          gap: 14,
          opacity: appear(local, 96, 34),
        }}
      >
        {["Declarative code", "Concurrent render", "Tiny DOM mutations"].map(
          (item, index) => (
            <Chip
              key={item}
              color={[palette.cyan, palette.violet, palette.mint][index]}
            >
              {item}
            </Chip>
          ),
        )}
      </div>
    </SceneLayer>
  );
};

const AtomVisual: React.FC<{ frame: number }> = ({ frame }) => {
  const spin = frame * 1.2;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[0, 60, 120].map((angle, index) => (
        <div
          key={angle}
          style={{
            position: "absolute",
            width: 480,
            height: 152,
            border: `3px solid ${
              [palette.cyan, palette.mint, palette.violet][index]
            }88`,
            borderRadius: "50%",
            transform: `rotate(${angle + spin}deg)`,
            boxShadow: `0 0 38px ${
              [palette.cyan, palette.mint, palette.violet][index]
            }33`,
          }}
        />
      ))}
      <div
        style={{
          width: 142,
          height: 142,
          borderRadius: 142,
          background:
            "radial-gradient(circle at 35% 30%, #f7fbff, #39d8ff 36%, #0b3d68 74%)",
          boxShadow: "0 0 70px rgba(57,216,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.bg,
          fontWeight: 900,
          fontSize: 42,
        }}
      >
        R
      </div>
    </div>
  );
};

const ElementsScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 01"
        title="JSX becomes plain element objects"
        body="React does not create DOM nodes while your component returns JSX. It builds lightweight descriptions of what the UI should be."
        local={local}
      />

      <Panel
        label="Component render"
        style={{
          left: 105,
          top: 390,
          width: 620,
          height: 360,
          transform: `translateY(${rise(local, 18)}px)`,
          opacity: appear(local, 18),
        }}
      >
        <CodeLines lines={elementCode} local={local} delay={44} />
      </Panel>

      <Panel
        label="React element"
        style={{
          right: 120,
          top: 342,
          width: 630,
          height: 454,
          transform: `translateY(${rise(local, 82)}px)`,
          opacity: appear(local, 82),
        }}
      >
        <CodeLines lines={elementObject} local={local} delay={110} accent />
      </Panel>

      <TransformStream local={local} />

      <Chip
        color={palette.yellow}
        style={{
          position: "absolute",
          left: 820,
          top: 785,
          opacity: appear(local, 154, 30),
        }}
      >
        no DOM yet
      </Chip>
      <Chip
        color={palette.mint}
        style={{
          position: "absolute",
          left: 1044,
          top: 785,
          opacity: appear(local, 170, 30),
        }}
      >
        just a description
      </Chip>
    </SceneLayer>
  );
};

const CodeLines: React.FC<{
  lines: string[];
  local: number;
  delay: number;
  accent?: boolean;
}> = ({ lines, local, delay, accent = false }) => (
  <div
    style={{
      ...mono,
      padding: "30px 34px",
      fontSize: accent ? 28 : 26,
      lineHeight: 1.55,
      color: palette.ink,
    }}
  >
    {lines.map((line, index) => (
      <div
        key={`${line}-${index}`}
        style={{
          opacity: appear(local, delay + index * 12, 20),
          transform: `translateX(${rise(local, delay + index * 12, 20)}px)`,
          color:
            line.includes("type") || line.includes("return")
              ? palette.cyan
              : line.includes("props") || line.includes("useState")
                ? palette.mint
                : line.includes("children")
                  ? palette.yellow
                  : "rgba(247,251,255,0.86)",
        }}
      >
        {line}
      </div>
    ))}
  </div>
);

const TransformStream: React.FC<{ local: number }> = ({ local }) => (
  <div
    style={{
      position: "absolute",
      left: 760,
      top: 500,
      width: 380,
      height: 180,
      opacity: appear(local, 72, 30),
    }}
  >
    <ConnectorLine
      from={{ x: 760, y: 590 }}
      to={{ x: 1132, y: 590 }}
      color={palette.cyan}
      opacity={0.45}
      width={4}
    />
    {Array.from({ length: 22 }, (_, index) => {
      const phase = ((local - 74) * 5 + index * 38) % 360;
      const t = clamp(phase / 360);
      const x = mix(770, 1120, t);
      const y = 590 + Math.sin(t * Math.PI * 2 + index) * 42;
      return (
        <div
          key={index}
          style={{
            position: "absolute",
            left: x - 760,
            top: y - 500,
            width: 13,
            height: 13,
            borderRadius: 13,
            background:
              index % 2 === 0
                ? palette.cyan
                : index % 3 === 0
                  ? palette.mint
                  : palette.violet,
            boxShadow: "0 0 20px rgba(57,216,255,0.9)",
            opacity: appear(local, 74 + index * 2, 18) * 0.9,
          }}
        />
      );
    })}
    <div
      style={{
        ...mono,
        position: "absolute",
        left: 98,
        top: 86,
        color: palette.muted,
        fontSize: 18,
      }}
    >
      React.createElement()
    </div>
  </div>
);

const FiberScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const activeIndex = Math.floor(
    interpolate(local, [120, 295], [0, fiberNodes.length - 0.01], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 02"
        title="Elements are turned into a fiber work tree"
        body="A fiber is a unit of work. Each fiber stores type, props, state, effects, priority, and pointers to related fibers."
        local={local}
      />

      <Panel
        label="current"
        style={{
          left: 96,
          top: 398,
          width: 710,
          height: 468,
          opacity: appear(local, 34),
          transform: `translateX(${interpolate(
            local,
            [34, 84],
            [-52, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          )}px)`,
        }}
      >
        <FiberGraph
          local={local}
          offsetX={96}
          offsetY={398}
          activeIndex={activeIndex}
          dim
        />
      </Panel>

      <Panel
        label="workInProgress"
        style={{
          right: 96,
          top: 342,
          width: 790,
          height: 560,
          opacity: appear(local, 78),
          transform: `translateX(${interpolate(
            local,
            [78, 130],
            [60, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          )}px)`,
        }}
      >
        <FiberGraph
          local={local}
          offsetX={1034}
          offsetY={342}
          activeIndex={activeIndex}
        />
      </Panel>

      {fiberNodes.map((node, index) => (
        <ConnectorLine
          key={node.id}
          from={{ x: 96 + node.x + 70, y: 398 + node.y + 35 }}
          to={{ x: 1034 + node.x + 70, y: 342 + node.y + 35 }}
          color={index === activeIndex ? palette.yellow : palette.blue}
          opacity={appear(local, 104 + index * 10, 22) * 0.5}
          width={index === activeIndex ? 5 : 2}
          dashed
        />
      ))}

      <Panel
        style={{
          left: 800,
          top: 844,
          width: 316,
          height: 90,
          padding: 18,
          opacity: appear(local, 140),
        }}
      >
        <div style={{ color: palette.ink, fontSize: 24, fontWeight: 800 }}>
          work loop
        </div>
        <div style={{ color: palette.muted, fontSize: 18, marginTop: 6 }}>
          beginWork() then completeWork()
        </div>
      </Panel>
    </SceneLayer>
  );
};

const FiberGraph: React.FC<{
  local: number;
  offsetX: number;
  offsetY: number;
  activeIndex: number;
  dim?: boolean;
}> = ({ local, offsetX, offsetY, activeIndex, dim = false }) => (
  <>
    {fiberLinks.map(([fromIndex, toIndex, label], index) => {
      const from = fiberNodes[fromIndex];
      const to = fiberNodes[toIndex];
      return (
        <ConnectorLine
          key={`${from.id}-${to.id}`}
          from={{ x: offsetX + from.x + 78, y: offsetY + from.y + 54 }}
          to={{ x: offsetX + to.x + 78, y: offsetY + to.y + 54 }}
          color={label === "child" ? palette.cyan : palette.violet}
          opacity={(dim ? 0.3 : 0.68) * appear(local, 56 + index * 10, 18)}
          width={3}
        />
      );
    })}
    {fiberNodes.map((node, index) => {
      const active = index === activeIndex && !dim;
      return (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            width: 150,
            height: 76,
            borderRadius: 18,
            border: `2px solid ${active ? palette.yellow : node.color}88`,
            background: active
              ? "linear-gradient(145deg, rgba(255,209,102,0.28), rgba(16,20,36,0.94))"
              : `linear-gradient(145deg, ${node.color}22, rgba(13,19,35,0.92))`,
            boxShadow: active
              ? "0 0 42px rgba(255,209,102,0.6)"
              : `0 0 24px ${node.color}22`,
            opacity: appear(local, 46 + index * 12, 20) * (dim ? 0.58 : 1),
            transform: `scale(${active ? 1.07 : 1})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.ink,
            fontWeight: 850,
            fontSize: 23,
          }}
        >
          {node.id}
        </div>
      );
    })}
    {!dim ? (
      <div
        style={{
          ...mono,
          position: "absolute",
          left: 40,
          bottom: 28,
          color: palette.muted,
          fontSize: 17,
          display: "flex",
          gap: 12,
        }}
      >
        <Chip color={palette.cyan}>child</Chip>
        <Chip color={palette.violet}>sibling</Chip>
        <Chip color={palette.yellow}>return</Chip>
      </div>
    ) : null}
  </>
);

const SchedulerScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const sweep = interpolate(local, [90, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 03"
        title="Updates enter lanes before work starts"
        body="React labels work by urgency. High-priority lanes can interrupt lower-priority rendering before anything becomes visible."
        local={local}
      />

      <Panel
        label="event"
        style={{
          left: 118,
          top: 420,
          width: 360,
          height: 264,
          padding: 28,
          opacity: appear(local, 28),
          transform: `translateY(${rise(local, 28)}px)`,
        }}
      >
        <div style={{ color: palette.ink, fontSize: 38, fontWeight: 850 }}>
          onClick()
        </div>
        <div
          style={{
            ...mono,
            color: palette.cyan,
            fontSize: 24,
            marginTop: 24,
            lineHeight: 1.55,
          }}
        >
          setCount(1)
          <br />
          scheduleUpdate()
        </div>
      </Panel>

      <Panel
        label="lanes"
        style={{
          left: 560,
          top: 330,
          width: 760,
          height: 468,
          opacity: appear(local, 66),
        }}
      >
        <div style={{ padding: "58px 42px 30px" }}>
          {lanes.map((lane, index) => {
            const rowY = index * 72;
            const dotX = ((local - 88 - index * 12) * (1.9 + index * 0.2)) % 530;
            const lit = sweep > index / lanes.length;
            return (
              <div
                key={lane.label}
                style={{
                  position: "relative",
                  height: 56,
                  marginBottom: 16,
                  opacity: appear(local, 82 + index * 10, 18),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 150,
                    color: lane.color,
                    fontWeight: 850,
                    fontSize: 24,
                  }}
                >
                  {lane.label}
                </div>
                <div
                  style={{
                    ...mono,
                    position: "absolute",
                    left: 0,
                    top: 30,
                    color: palette.muted,
                    fontSize: 15,
                  }}
                >
                  {lane.detail}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 175,
                    right: 0,
                    top: 18,
                    height: 10,
                    borderRadius: 999,
                    background: lit ? `${lane.color}33` : "rgba(255,255,255,0.08)",
                  }}
                />
                {local > 88 + index * 12 ? (
                  <Dot
                    color={lane.color}
                    size={18}
                    style={{
                      position: "absolute",
                      left: 172 + dotX,
                      top: rowY * 0 + 14,
                      opacity: 0.92,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        label="main thread chunks"
        style={{
          right: 100,
          top: 412,
          width: 430,
          height: 300,
          padding: 26,
          opacity: appear(local, 130),
        }}
      >
        <div style={{ position: "relative", height: 206, marginTop: 34 }}>
          {Array.from({ length: 7 }, (_, index) => {
            const x = 8 + index * 56;
            const h = 54 + ((index * 23) % 96);
            const color =
              index === 2 || index === 5 ? palette.yellow : palette.cyan;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: x,
                  bottom: 0,
                  width: 40,
                  height: h * appear(local, 146 + index * 10, 18),
                  borderRadius: 10,
                  background: `${color}44`,
                  border: `1px solid ${color}99`,
                  boxShadow: `0 0 24px ${color}33`,
                }}
              />
            );
          })}
          {[2, 5].map((index) => (
            <div
              key={index}
              style={{
                ...mono,
                position: "absolute",
                left: 8 + index * 56 - 18,
                top: 16,
                color: palette.yellow,
                fontSize: 15,
                opacity: appear(local, 178 + index * 8, 18),
              }}
            >
              yield
            </div>
          ))}
        </div>
      </Panel>

      <ConnectorLine
        from={{ x: 478, y: 552 }}
        to={{ x: 558, y: 552 }}
        color={palette.coral}
        opacity={appear(local, 58) * 0.82}
        width={5}
      />
      <ConnectorLine
        from={{ x: 1320, y: 552 }}
        to={{ x: 1420, y: 552 }}
        color={palette.mint}
        opacity={appear(local, 130) * 0.82}
        width={5}
      />
    </SceneLayer>
  );
};

const ReconcileScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const compare = interpolate(local, [92, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 04"
        title="Reconciliation compares old fibers to new elements"
        body="React reuses work when type and key match. Differences become effect flags: placement, update, deletion, or move."
        local={local}
      />

      <Panel
        label="old child set"
        style={{
          left: 118,
          top: 382,
          width: 650,
          height: 365,
          opacity: appear(local, 30),
        }}
      >
        <ChildList items={reconcileOld} local={local} delay={52} />
      </Panel>
      <Panel
        label="new child set"
        style={{
          right: 118,
          top: 382,
          width: 650,
          height: 365,
          opacity: appear(local, 70),
        }}
      >
        <ChildList items={reconcileNew} local={local} delay={94} />
      </Panel>

      <ReconcileLinks local={local} compare={compare} />

      <Panel
        label="effect list"
        style={{
          left: 320,
          right: 320,
          bottom: 118,
          height: 160,
          opacity: appear(local, 182),
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            alignItems: "center",
            height: 74,
            marginTop: 18,
          }}
        >
          <Chip color={palette.mint}>B: update</Chip>
          <Chip color={palette.cyan}>A: move</Chip>
          <Chip color={palette.violet}>D: placement</Chip>
          <Chip color={palette.coral}>C: deletion</Chip>
        </div>
      </Panel>
    </SceneLayer>
  );
};

const ChildList: React.FC<{
  items: { key: string; label: string; color: string }[];
  local: number;
  delay: number;
}> = ({ items, local, delay }) => (
  <div
    style={{
      padding: "62px 44px",
      display: "flex",
      flexDirection: "column",
      gap: 22,
    }}
  >
    {items.map((item, index) => (
      <div
        key={item.key}
        style={{
          height: 68,
          borderRadius: 18,
          border: `2px solid ${item.color}88`,
          background: `${item.color}18`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 24px",
          opacity: appear(local, delay + index * 16, 20),
          transform: `translateX(${rise(local, delay + index * 16, 24)}px)`,
          boxShadow: `0 0 30px ${item.color}22`,
        }}
      >
        <Chip color={item.color}>key {item.key}</Chip>
        <div style={{ color: palette.ink, fontSize: 28, fontWeight: 800 }}>
          {item.label}
        </div>
      </div>
    ))}
  </div>
);

const ReconcileLinks: React.FC<{ local: number; compare: number }> = ({
  local,
  compare,
}) => {
  const leftX = 760;
  const rightX = 1160;
  const oldYs = [478, 568, 658];
  const newYs = [478, 568, 658];
  const lines = [
    { from: 1, to: 0, color: palette.mint, label: "reuse" },
    { from: 0, to: 1, color: palette.cyan, label: "move" },
    { from: 2, to: 2, color: palette.coral, label: "delete/insert" },
  ];

  return (
    <>
      {lines.map((line, index) => {
        const x2 = mix(leftX, rightX, compare);
        const y2 = mix(oldYs[line.from], newYs[line.to], compare);
        return (
          <ConnectorLine
            key={`${line.from}-${line.to}`}
            from={{ x: leftX, y: oldYs[line.from] }}
            to={{ x: x2, y: y2 }}
            color={line.color}
            opacity={appear(local, 132 + index * 20, 20) * 0.82}
            width={5}
            dashed={index === 2}
          />
        );
      })}
      {lines.map((line, index) => (
        <Chip
          key={line.label}
          color={line.color}
          style={{
            position: "absolute",
            left: 885,
            top: 454 + index * 82,
            opacity: appear(local, 160 + index * 18, 20),
          }}
        >
          {line.label}
        </Chip>
      ))}
    </>
  );
};

const HooksScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const count = Math.round(
    interpolate(local, [150, 250], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 05"
        title="Hooks are stored as an ordered list on the fiber"
        body="During render, React walks hook cells in the same order every time, applies queued updates, and produces new memoized state."
        local={local}
      />

      <Panel
        label="rendering Counter fiber"
        style={{
          left: 112,
          top: 392,
          width: 565,
          height: 380,
          opacity: appear(local, 28),
        }}
      >
        <CodeLines
          lines={[
            "const [count, setCount] = useState(0);",
            "const doubled = useMemo(...);",
            "useEffect(() => sync(count));",
            "return <Button>{count}</Button>;",
          ]}
          local={local}
          delay={58}
          accent
        />
      </Panel>

      <Panel
        style={{
          left: 748,
          top: 420,
          width: 300,
          height: 260,
          padding: 30,
          opacity: appear(local, 78),
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            margin: "14px auto 0",
            borderRadius: 34,
            border: `2px solid ${palette.cyan}`,
            background:
              "linear-gradient(145deg, rgba(57,216,255,0.22), rgba(12,18,32,0.96))",
            boxShadow: "0 0 48px rgba(57,216,255,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.ink,
            fontWeight: 900,
            fontSize: 33,
          }}
        >
          Fiber
        </div>
        <div
          style={{
            ...mono,
            color: palette.muted,
            textAlign: "center",
            marginTop: 14,
            fontSize: 17,
          }}
        >
          memoizedState points to hooks
        </div>
      </Panel>

      <Panel
        label="hook list"
        style={{
          right: 108,
          top: 324,
          width: 676,
          height: 502,
          opacity: appear(local, 108),
          padding: 32,
        }}
      >
        <div style={{ marginTop: 40 }}>
          {hookRows.map((row, index) => (
            <HookCell
              key={row.label}
              label={row.label}
              value={row.value}
              color={row.color}
              local={local}
              delay={128 + index * 34}
              index={index}
            />
          ))}
        </div>
      </Panel>

      <ConnectorLine
        from={{ x: 1048, y: 550 }}
        to={{ x: 1242, y: 440 }}
        color={palette.cyan}
        opacity={appear(local, 110) * 0.7}
        width={4}
      />

      <UpdateQueue local={local} count={count} />
    </SceneLayer>
  );
};

const HookCell: React.FC<{
  label: string;
  value: string;
  color: string;
  local: number;
  delay: number;
  index: number;
}> = ({ label, value, color, local, delay, index }) => (
  <div
    style={{
      position: "relative",
      height: 92,
      marginBottom: 26,
      borderRadius: 20,
      border: `2px solid ${color}88`,
      background: `${color}16`,
      padding: "17px 26px",
      opacity: appear(local, delay, 22),
      transform: `translateX(${rise(local, delay, 34)}px)`,
      boxShadow: `0 0 30px ${color}22`,
    }}
  >
    <div style={{ color: palette.ink, fontSize: 27, fontWeight: 850 }}>
      {label}
    </div>
    <div style={{ ...mono, color: palette.muted, fontSize: 18, marginTop: 8 }}>
      {value}
    </div>
    {index < hookRows.length - 1 ? (
      <div
        style={{
          position: "absolute",
          left: 314,
          bottom: -30,
          width: 3,
          height: 30,
          background: color,
          boxShadow: `0 0 18px ${color}`,
        }}
      />
    ) : null}
  </div>
);

const UpdateQueue: React.FC<{ local: number; count: number }> = ({
  local,
  count,
}) => {
  const angle = local * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: 418,
        bottom: 106,
        width: 524,
        height: 152,
        opacity: appear(local, 174),
      }}
    >
      <Panel
        label="update queue"
        style={{
          left: 0,
          top: 0,
          width: 524,
          height: 152,
          padding: 24,
          position: "absolute",
        }}
      >
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 36,
            top: 68,
            color: palette.yellow,
            fontSize: 26,
          }}
        >
          action: n =&gt; n + 1
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 42,
            width: 72,
            height: 72,
            borderRadius: 72,
            border: `2px solid ${palette.mint}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.ink,
            fontWeight: 900,
            fontSize: 30,
            transform: `rotate(${angle}deg)`,
            boxShadow: `0 0 30px ${palette.mint}55`,
          }}
        >
          {count}
        </div>
      </Panel>
    </div>
  );
};

const CommitScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const sweep = interpolate(local, [110, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 06"
        title="Commit is where the plan becomes visible"
        body="The render phase can be paused or thrown away. The commit phase is synchronous: React applies effect flags to the host environment."
        local={local}
      />

      <Panel
        label="effect flags"
        style={{
          left: 112,
          top: 384,
          width: 414,
          height: 422,
          padding: 30,
          opacity: appear(local, 32),
        }}
      >
        {[
          ["Placement", palette.violet],
          ["Update props", palette.cyan],
          ["Delete child", palette.coral],
          ["Passive effect", palette.mint],
        ].map(([label, color], index) => (
          <Chip
            key={label}
            color={color}
            style={{
              display: "flex",
              width: "100%",
              height: 54,
              marginTop: index === 0 ? 48 : 18,
              opacity: appear(local, 60 + index * 18, 20),
            }}
          >
            {label}
          </Chip>
        ))}
      </Panel>

      <div
        style={{
          position: "absolute",
          left: 610,
          top: 405,
          width: 720,
          height: 330,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          opacity: appear(local, 78),
        }}
      >
        {commitSteps.map((step, index) => {
          const active = sweep > index / commitSteps.length;
          return (
            <div
              key={step.label}
              style={{
                ...panelBase,
                position: "relative",
                padding: 24,
                background: active
                  ? `linear-gradient(145deg, ${step.color}28, rgba(13,19,35,0.92))`
                  : palette.panel,
                borderColor: active ? `${step.color}aa` : palette.stroke,
                boxShadow: active
                  ? `0 0 42px ${step.color}35`
                  : "0 18px 50px rgba(0,0,0,0.32)",
                opacity: appear(local, 100 + index * 20, 22),
                transform: `translateY(${active ? -10 : 0}px)`,
              }}
            >
              <div
                style={{
                  color: step.color,
                  fontWeight: 900,
                  fontSize: 26,
                  lineHeight: 1.05,
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  color: palette.muted,
                  fontSize: 18,
                  marginTop: 18,
                  lineHeight: 1.35,
                }}
              >
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>

      <Panel
        label="host tree"
        style={{
          right: 112,
          top: 344,
          width: 402,
          height: 500,
          opacity: appear(local, 128),
          padding: 28,
        }}
      >
        <DomPreview local={local} />
      </Panel>

      <ConnectorLine
        from={{ x: 526, y: 590 }}
        to={{ x: 610, y: 590 }}
        color={palette.yellow}
        opacity={appear(local, 84) * 0.85}
        width={5}
      />
      <ConnectorLine
        from={{ x: 1330, y: 590 }}
        to={{ x: 1406, y: 590 }}
        color={palette.mint}
        opacity={appear(local, 156) * 0.85}
        width={5}
      />
    </SceneLayer>
  );
};

const DomPreview: React.FC<{ local: number }> = ({ local }) => (
  <div
    style={{
      position: "relative",
      marginTop: 36,
      height: 374,
      borderRadius: 22,
      background: "linear-gradient(180deg, #f7fbff 0%, #dce8f8 100%)",
      padding: 22,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 48,
        borderRadius: 14,
        background: "#16213d",
        marginBottom: 20,
      }}
    />
    <div
      style={{
        height: 160,
        borderRadius: 18,
        background: "#ffffff",
        boxShadow: "0 10px 26px rgba(20,40,80,0.16)",
        padding: 22,
      }}
    >
      <div
        style={{
          color: "#16213d",
          fontWeight: 900,
          fontSize: 28,
          marginBottom: 16,
        }}
      >
        Count
      </div>
      <div
        style={{
          width: 120,
          height: 52,
          borderRadius: 16,
          background:
            local > 192
              ? "linear-gradient(90deg, #42f5b0, #39d8ff)"
              : "linear-gradient(90deg, #5f8cff, #39d8ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#07101f",
          fontWeight: 900,
          fontSize: 30,
          transform: `scale(${1 + appear(local, 192, 12) * 0.08})`,
        }}
      >
        {local > 192 ? 1 : 0}
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 6,
        background:
          "linear-gradient(90deg, transparent, rgba(57,216,255,0.9), transparent)",
        transform: `translateY(${interpolate(
          local,
          [150, 230],
          [0, 370],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )}px)`,
        opacity: appear(local, 150, 16),
      }}
    />
  </div>
);

const BrowserScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const pulse = Math.sin(local / 18) * 0.5 + 0.5;

  return (
    <SceneLayer start={start} end={end}>
      <StageTitle
        eyebrow="Step 07"
        title="After React commits, the browser finishes the frame"
        body="React mutates host nodes. The browser then calculates layout, paints pixels, and composites layers onto the screen."
        local={local}
      />

      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 408,
          height: 250,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          opacity: appear(local, 44),
        }}
      >
        {browserPipe.map((step, index) => {
          const active = local > 78 + index * 42;
          return (
            <div
              key={step.label}
              style={{
                ...panelBase,
                padding: 26,
                borderColor: active ? `${step.color}aa` : palette.stroke,
                background: active
                  ? `linear-gradient(145deg, ${step.color}24, rgba(13,19,35,0.92))`
                  : palette.panel,
                boxShadow: active
                  ? `0 0 ${28 + pulse * 28}px ${step.color}33`
                  : "0 22px 58px rgba(0,0,0,0.34)",
                transform: `translateY(${active ? -12 : 0}px)`,
              }}
            >
              <div
                style={{
                  color: step.color,
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  ...mono,
                  color: palette.muted,
                  fontSize: 19,
                  marginTop: 16,
                }}
              >
                {step.detail}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  bottom: 26,
                  right: 26,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${active ? 100 : 8}%`,
                    height: "100%",
                    background: step.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Panel
        label="visible result"
        style={{
          left: 548,
          bottom: 100,
          width: 824,
          height: 238,
          opacity: appear(local, 238),
          padding: 28,
        }}
      >
        <div
          style={{
            height: 132,
            marginTop: 42,
            borderRadius: 24,
            background:
              "linear-gradient(90deg, rgba(57,216,255,0.16), rgba(66,245,176,0.16))",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.ink,
            fontSize: 36,
            fontWeight: 850,
          }}
        >
          React plans the change. The browser draws the frame.
        </div>
      </Panel>
    </SceneLayer>
  );
};

const RecapScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const center = { x: 960, y: 532 };
  const radius = 310;
  const activeIndex = Math.floor((local / 32) % cycleNodes.length);

  return (
    <SceneLayer start={start} end={end}>
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 112,
          width: 640,
          opacity: appear(local, 0),
          transform: `translateY(${rise(local, 0, 34)}px)`,
        }}
      >
        <div
          style={{
            ...mono,
            color: palette.mint,
            fontSize: 26,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Mental model
        </div>
        <div
          style={{
            color: palette.ink,
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 900,
            textShadow,
          }}
        >
          React is a planner, a scheduler, and a committer.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: center.x - radius - 120,
          top: center.y - radius - 120,
          width: (radius + 120) * 2,
          height: (radius + 120) * 2,
          opacity: appear(local, 42),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 120,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius * 2,
            border: "2px solid rgba(57,216,255,0.22)",
            boxShadow: "0 0 70px rgba(57,216,255,0.16)",
            transform: `rotate(${local * 0.18}deg)`,
          }}
        />
        {cycleNodes.map((node, index) => {
          const angle =
            (index / cycleNodes.length) * Math.PI * 2 - Math.PI / 2 + local / 220;
          const x = radius + 120 + Math.cos(angle) * radius;
          const y = radius + 120 + Math.sin(angle) * radius;
          const active = index === activeIndex;
          return (
            <div
              key={node.label}
              style={{
                position: "absolute",
                left: x - 75,
                top: y - 38,
                width: 150,
                height: 76,
                borderRadius: 22,
                border: `2px solid ${active ? palette.yellow : node.color}aa`,
                background: active
                  ? "linear-gradient(145deg, rgba(255,209,102,0.34), rgba(13,19,35,0.95))"
                  : `linear-gradient(145deg, ${node.color}20, rgba(13,19,35,0.92))`,
                color: palette.ink,
                fontWeight: 850,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: active
                  ? "0 0 44px rgba(255,209,102,0.58)"
                  : `0 0 26px ${node.color}22`,
                transform: `scale(${active ? 1.12 : 1})`,
              }}
            >
              {node.label}
            </div>
          );
        })}
      </div>

      <Panel
        style={{
          right: 150,
          bottom: 130,
          width: 650,
          height: 270,
          padding: 34,
          opacity: appear(local, 104),
        }}
      >
        <div
          style={{
            color: palette.ink,
            fontSize: 38,
            lineHeight: 1.18,
            fontWeight: 850,
          }}
        >
          Every update runs the same story:
        </div>
        <div
          style={{
            color: palette.muted,
            fontSize: 27,
            lineHeight: 1.36,
            marginTop: 20,
          }}
        >
          collect updates, choose lanes, render a work-in-progress fiber tree,
          diff it, commit the smallest visible changes, then flush effects.
        </div>
      </Panel>
    </SceneLayer>
  );
};

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <Background />
      {inRange(frame, sceneDefs[0].start, sceneDefs[0].end) ? (
        <IntroScene start={sceneDefs[0].start} end={sceneDefs[0].end} />
      ) : null}
      {inRange(frame, sceneDefs[1].start, sceneDefs[1].end) ? (
        <ElementsScene start={sceneDefs[1].start} end={sceneDefs[1].end} />
      ) : null}
      {inRange(frame, sceneDefs[2].start, sceneDefs[2].end) ? (
        <FiberScene start={sceneDefs[2].start} end={sceneDefs[2].end} />
      ) : null}
      {inRange(frame, sceneDefs[3].start, sceneDefs[3].end) ? (
        <SchedulerScene start={sceneDefs[3].start} end={sceneDefs[3].end} />
      ) : null}
      {inRange(frame, sceneDefs[4].start, sceneDefs[4].end) ? (
        <ReconcileScene start={sceneDefs[4].start} end={sceneDefs[4].end} />
      ) : null}
      {inRange(frame, sceneDefs[5].start, sceneDefs[5].end) ? (
        <HooksScene start={sceneDefs[5].start} end={sceneDefs[5].end} />
      ) : null}
      {inRange(frame, sceneDefs[6].start, sceneDefs[6].end) ? (
        <CommitScene start={sceneDefs[6].start} end={sceneDefs[6].end} />
      ) : null}
      {inRange(frame, sceneDefs[7].start, sceneDefs[7].end) ? (
        <BrowserScene start={sceneDefs[7].start} end={sceneDefs[7].end} />
      ) : null}
      {inRange(frame, sceneDefs[8].start, sceneDefs[8].end) ? (
        <RecapScene start={sceneDefs[8].start} end={sceneDefs[8].end} />
      ) : null}
      <GlobalHud />
    </AbsoluteFill>
  );
};
