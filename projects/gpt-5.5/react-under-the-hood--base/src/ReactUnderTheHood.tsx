import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 3035;

const colors = {
  ink: "#071018",
  panel: "rgba(8, 18, 30, 0.82)",
  panelStrong: "rgba(11, 25, 39, 0.96)",
  line: "rgba(171, 219, 255, 0.23)",
  lineStrong: "rgba(155, 211, 255, 0.58)",
  cyan: "#54D8FF",
  teal: "#55F0C5",
  lime: "#B6F06A",
  yellow: "#FFD86E",
  orange: "#FF9F5F",
  red: "#FF6A7A",
  purple: "#AD8CFF",
  blue: "#78A7FF",
  white: "#F5FBFF",
  muted: "#8FA8B8",
};

type SceneProps = {
  duration: number;
};

type SceneComponent = (props: SceneProps) => ReactElement;

type SceneDefinition = {
  component: SceneComponent;
  duration: number;
  eyebrow: string;
  name: string;
  start: number;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const appear = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

const exit = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

const sceneOpacity = (frame: number, duration: number) =>
  Math.min(appear(frame, 0, 36), exit(frame, duration - 95, duration - 12));

const localLoop = (frame: number, period: number) =>
  ((frame % period) + period) / period;

const pulse = (frame: number, period: number, low = 0, high = 1) => {
  const wave = (Math.sin((frame / period) * Math.PI * 2) + 1) / 2;
  return low + (high - low) * wave;
};

const readable = (progress: number) =>
  Math.round(progress * 1000) / 1000;

const panelStyle = (accent = colors.cyan): CSSProperties => ({
  background: colors.panel,
  border: `1px solid ${accent}55`,
  borderRadius: 18,
  boxShadow: `0 0 38px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.08)`,
});

const codeLines = [
  "function ProductPage({ user }) {",
  "  const [cart, setCart] = useState([]);",
  "",
  "  return <Shell>",
  "    <Header user={user} />",
  "    <ProductGrid onAdd={setCart} />",
  "    <MiniCart items={cart} />",
  "  </Shell>;",
  "}",
];

const fiberNodes = [
  { id: "root", label: "Root", x: 960, y: 205, type: "host" },
  { id: "app", label: "App", x: 960, y: 345, type: "function" },
  { id: "shell", label: "Shell", x: 725, y: 510, type: "function" },
  { id: "header", label: "Header", x: 1195, y: 510, type: "function" },
  { id: "main", label: "main", x: 610, y: 690, type: "host" },
  { id: "grid", label: "ProductGrid", x: 850, y: 690, type: "function" },
  { id: "cart", label: "MiniCart", x: 1195, y: 690, type: "function" },
  { id: "button", label: "button", x: 1035, y: 850, type: "host" },
  { id: "text", label: "text", x: 1345, y: 850, type: "host" },
];

const fiberLinks = [
  ["root", "app"],
  ["app", "shell"],
  ["app", "header"],
  ["shell", "main"],
  ["shell", "grid"],
  ["header", "cart"],
  ["grid", "button"],
  ["cart", "text"],
];

const reconcileRows = [
  {
    before: "Card key=A",
    after: "Card key=A",
    color: colors.teal,
    result: "reuse fiber + DOM",
  },
  {
    before: "Card key=B",
    after: "Card key=C",
    color: colors.yellow,
    result: "move existing C",
  },
  {
    before: "Card key=C",
    after: "Card key=D",
    color: colors.orange,
    result: "insert D",
  },
  {
    before: "Promo key=X",
    after: "removed",
    color: colors.red,
    result: "delete X",
  },
];

const schedulerLanes = [
  { name: "Sync", detail: "click, input", color: colors.red, y: 285, speed: 65 },
  {
    name: "Input",
    detail: "typing feedback",
    color: colors.orange,
    y: 405,
    speed: 82,
  },
  {
    name: "Default",
    detail: "data update",
    color: colors.cyan,
    y: 525,
    speed: 100,
  },
  {
    name: "Transition",
    detail: "non-urgent UI",
    color: colors.purple,
    y: 645,
    speed: 124,
  },
  { name: "Idle", detail: "cleanup", color: colors.lime, y: 765, speed: 150 },
];

const commitSteps = [
  {
    name: "Before mutation",
    detail: "read snapshots",
    color: colors.purple,
    x: 380,
  },
  {
    name: "Mutation",
    detail: "apply DOM changes",
    color: colors.orange,
    x: 770,
  },
  {
    name: "Layout effects",
    detail: "synchronous effects",
    color: colors.cyan,
    x: 1160,
  },
  {
    name: "Passive effects",
    detail: "after paint",
    color: colors.teal,
    x: 1550,
  },
];

const recapSteps = [
  "Event",
  "Update",
  "Lane",
  "Render",
  "Diff",
  "Commit",
  "Paint",
];

function getNode(id: string) {
  const node = fiberNodes.find((candidate) => candidate.id === id);
  if (!node) {
    throw new Error(`Missing fiber node ${id}`);
  }

  return node;
}

const SCENES: SceneDefinition[] = [
  {
    start: 0,
    duration: 330,
    eyebrow: "mental model",
    name: "React turns intent into UI",
    component: IntroScene,
  },
  {
    start: 330,
    duration: 360,
    eyebrow: "step 1",
    name: "JSX becomes plain objects",
    component: ElementScene,
  },
  {
    start: 690,
    duration: 420,
    eyebrow: "step 2",
    name: "Fiber splits rendering into work",
    component: FiberScene,
  },
  {
    start: 1110,
    duration: 360,
    eyebrow: "step 3",
    name: "The scheduler assigns priority lanes",
    component: SchedulerScene,
  },
  {
    start: 1470,
    duration: 390,
    eyebrow: "step 4",
    name: "Reconciliation decides reuse, move, insert, delete",
    component: ReconcileScene,
  },
  {
    start: 1860,
    duration: 360,
    eyebrow: "step 5",
    name: "Hooks replay queued updates",
    component: HooksScene,
  },
  {
    start: 2220,
    duration: 405,
    eyebrow: "step 6",
    name: "Commit writes the finished work",
    component: CommitScene,
  },
  {
    start: 2625,
    duration: 410,
    eyebrow: "recap",
    name: "One loop, many safeguards",
    component: RecapScene,
  },
];

export const ReactUnderTheHood = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        color: colors.white,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <BlueprintBackground frame={frame} />
      <HeaderRail frame={frame} />
      {SCENES.map((scene, index) => {
        const Scene = scene.component;
        return (
          <Sequence
            key={scene.name}
            from={scene.start}
            durationInFrames={scene.duration}
            premountFor={FPS}
          >
            <SceneLayer duration={scene.duration} zIndex={index + 2}>
              <Scene duration={scene.duration} />
            </SceneLayer>
          </Sequence>
        );
      })}
      <FooterClock frame={frame} />
    </AbsoluteFill>
  );
};

function SceneLayer({
  children,
  duration,
  zIndex,
}: {
  children: ReactNode;
  duration: number;
  zIndex: number;
}) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration);
  const y = interpolate(opacity, [0, 1], [22, 0], clamp);
  const scale = interpolate(opacity, [0, 1], [0.985, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        zIndex,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

function BlueprintBackground({ frame }: { frame: number }) {
  const offset = -((frame * 0.55) % 96);
  const diagonalOffset = -((frame * 0.32) % 160);
  const signal = pulse(frame, 140, 0.25, 0.72);

  return (
    <AbsoluteFill>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="bg-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06121E" />
            <stop offset="44%" stopColor="#0A1824" />
            <stop offset="100%" stopColor="#0A111A" />
          </linearGradient>
          <linearGradient id="trace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.cyan} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.teal} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="amber-trace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.yellow} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.yellow} stopOpacity="0.62" />
            <stop offset="100%" stopColor={colors.orange} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#bg-fade)" />
        {Array.from({ length: 24 }, (_, index) => {
          const x = index * 96 + offset;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              x2={x}
              y1="0"
              y2={HEIGHT}
              stroke={index % 4 === 0 ? colors.lineStrong : colors.line}
              strokeWidth={index % 4 === 0 ? 1.4 : 0.8}
            />
          );
        })}
        {Array.from({ length: 15 }, (_, index) => {
          const y = index * 96 + offset;
          return (
            <line
              key={`h-${index}`}
              x1="0"
              x2={WIDTH}
              y1={y}
              y2={y}
              stroke={index % 3 === 0 ? colors.lineStrong : colors.line}
              strokeWidth={index % 3 === 0 ? 1.2 : 0.7}
            />
          );
        })}
        {Array.from({ length: 14 }, (_, index) => {
          const x = -200 + index * 170 + diagonalOffset;
          return (
            <line
              key={`d-${index}`}
              x1={x}
              y1="0"
              x2={x + 620}
              y2={HEIGHT}
              stroke="rgba(84,216,255,0.06)"
              strokeWidth="2"
            />
          );
        })}
        <path
          d="M70 165 C 380 65, 520 315, 860 205 S 1340 95, 1850 210"
          fill="none"
          stroke="url(#trace)"
          strokeWidth="5"
          strokeDasharray="380 1220"
          strokeDashoffset={-frame * 10}
          opacity={0.22 + signal * 0.18}
        />
        <path
          d="M40 900 C 420 760, 610 930, 920 815 S 1360 690, 1880 815"
          fill="none"
          stroke="url(#amber-trace)"
          strokeWidth="4"
          strokeDasharray="240 1100"
          strokeDashoffset={-frame * 8}
          opacity={0.18 + signal * 0.18}
        />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(7,16,24,0.62) 0%, rgba(7,16,24,0) 22%, rgba(7,16,24,0) 78%, rgba(7,16,24,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,16,24,0.92) 0%, rgba(7,16,24,0) 18%, rgba(7,16,24,0) 74%, rgba(7,16,24,0.88) 100%)",
        }}
      />
    </AbsoluteFill>
  );
}

function HeaderRail({ frame }: { frame: number }) {
  let activeIndex = 0;
  for (let index = 0; index < SCENES.length; index++) {
    if (frame >= SCENES[index].start) {
      activeIndex = index;
    }
  }
  const active = SCENES[activeIndex];
  const sceneProgress = readable(
    interpolate(
      frame,
      [active.start, active.start + active.duration],
      [0, 1],
      clamp,
    ),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 70,
          right: 70,
          height: 78,
          display: "grid",
          gridTemplateColumns: "320px 1fr 260px",
          gap: 28,
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              border: `1px solid ${colors.cyan}88`,
              background:
                "linear-gradient(135deg, rgba(84,216,255,0.24), rgba(85,240,197,0.08))",
              display: "grid",
              placeItems: "center",
              boxShadow: `0 0 28px ${colors.cyan}33`,
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 24 }}>R</span>
          </div>
          <div>
            <div
              style={{
                color: colors.muted,
                fontSize: 16,
                letterSpacing: 2.6,
                textTransform: "uppercase",
              }}
            >
              under the hood
            </div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>React runtime</div>
          </div>
        </div>

        <div
          style={{
            height: 18,
            borderRadius: 999,
            border: `1px solid ${colors.lineStrong}`,
            background: "rgba(255,255,255,0.035)",
            display: "grid",
            gridTemplateColumns: `repeat(${SCENES.length}, 1fr)`,
            gap: 4,
            padding: 3,
          }}
        >
          {SCENES.map((scene, index) => {
            const start = scene.start;
            const end = scene.start + scene.duration;
            const progress = interpolate(frame, [start, end], [0, 1], clamp);
            const isActive = index === activeIndex;
            return (
              <div
                key={scene.name}
                style={{
                  borderRadius: 999,
                  overflow: "hidden",
                  background: isActive
                    ? "rgba(84,216,255,0.16)"
                    : "rgba(255,255,255,0.045)",
                }}
              >
                <div
                  style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: isActive
                      ? `linear-gradient(90deg, ${colors.cyan}, ${colors.teal})`
                      : "rgba(143,168,184,0.45)",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            justifySelf: "end",
            textAlign: "right",
            color: colors.muted,
            fontSize: 18,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <div
            style={{
              color: colors.white,
              fontWeight: 800,
              fontSize: 24,
              whiteSpace: "nowrap",
            }}
          >
            {active.eyebrow}
          </div>
          {Math.round(sceneProgress * 100)}% through this layer
        </div>
      </div>
    </AbsoluteFill>
  );
}

function FooterClock({ frame }: { frame: number }) {
  const seconds = Math.floor(frame / FPS);
  const frames = frame % FPS;

  return (
    <div
      style={{
        position: "absolute",
        right: 72,
        bottom: 40,
        zIndex: 50,
        color: "rgba(245,251,255,0.52)",
        fontSize: 18,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {String(seconds).padStart(2, "0")}:{String(frames).padStart(2, "0")} /{" "}
      {Math.round(DURATION_IN_FRAMES / FPS)}s
    </div>
  );
}

function SceneTitle({
  accent,
  align = "left",
  children,
  eyebrow,
  maxWidth = 820,
  subtitle,
}: {
  accent: string;
  align?: "left" | "center";
  children: ReactNode;
  eyebrow: string;
  maxWidth?: number;
  subtitle: string;
}) {
  return (
    <div
      style={{
        maxWidth,
        textAlign: align,
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: align === "center" ? "50%" : -24,
          top: -18,
          width: align === "center" ? maxWidth + 80 : maxWidth + 48,
          height: 236,
          borderRadius: 28,
          transform: align === "center" ? "translateX(-50%)" : undefined,
          background:
            "linear-gradient(90deg, rgba(7,16,24,1) 0%, rgba(7,16,24,1) 72%, rgba(7,16,24,0) 100%)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          color: accent,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 2.8,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: 42,
            height: 2,
            background: accent,
            display: align === "center" ? "none" : "block",
          }}
        />
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 64,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <div
        style={{
          marginTop: 20,
          color: "#B8CAD6",
          fontSize: 25,
          lineHeight: 1.42,
          fontWeight: 500,
          position: "relative",
          zIndex: 1,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function IntroScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const typed = Math.floor(
    interpolate(frame, [24, 182], [0, codeLines.join("\n").length], clamp),
  );
  const titleIn = appear(frame, 0, 50);
  const mapIn = appear(frame, 92, 156);
  const uiIn = appear(frame, 150, 220);
  const scanX = interpolate(frame, [118, duration - 60], [0, 1], clamp);
  const code = codeLines.join("\n").slice(0, typed);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 154,
          transform: `translateY(${interpolate(titleIn, [0, 1], [28, 0], clamp)}px)`,
          opacity: titleIn,
        }}
      >
        <SceneTitle
          accent={colors.cyan}
          eyebrow="React is a UI compiler and coordinator"
          subtitle="Your component function describes the next interface. React turns that description into work it can pause, resume, diff, and finally commit."
        >
          From component code to pixels
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 120,
          width: 555,
          opacity: appear(frame, 50, 98),
          transform: `translateX(${interpolate(appear(frame, 50, 98), [0, 1], [-48, 0], clamp)}px)`,
        }}
      >
        <CodeWindow code={code} title="ProductPage.tsx" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 728,
          top: 430,
          width: 470,
          height: 318,
          opacity: mapIn,
          transform: `scale(${interpolate(mapIn, [0, 1], [0.88, 1], clamp)})`,
          ...panelStyle(colors.purple),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 30,
            color: colors.purple,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          React creates work
        </div>
        <PipelineNode
          color={colors.cyan}
          label="element"
          style={{ left: 44, top: 96 }}
        />
        <PipelineNode
          color={colors.teal}
          label="fiber"
          style={{ left: 194, top: 96 }}
        />
        <PipelineNode
          color={colors.orange}
          label="effect"
          style={{ left: 344, top: 96 }}
        />
        <MiniArrow
          color={colors.lineStrong}
          from={{ x: 134, y: 151 }}
          progress={appear(frame, 110, 145)}
          to={{ x: 194, y: 151 }}
        />
        <MiniArrow
          color={colors.lineStrong}
          from={{ x: 284, y: 151 }}
          progress={appear(frame, 140, 175)}
          to={{ x: 344, y: 151 }}
        />
        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            bottom: 34,
            color: "#C7D6E0",
            fontSize: 23,
            lineHeight: 1.35,
          }}
        >
          The render phase builds a candidate tree. The commit phase touches the
          real host environment.
        </div>
        <div
          style={{
            position: "absolute",
            left: `${42 + scanX * 330}px`,
            top: 89,
            width: 120,
            height: 126,
            borderRadius: 20,
            border: `2px solid ${colors.white}`,
            boxShadow: `0 0 32px ${colors.white}44`,
            opacity: 0.25,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 100,
          top: 260,
          width: 540,
          height: 520,
          opacity: uiIn,
          transform: `translateX(${interpolate(uiIn, [0, 1], [62, 0], clamp)}px)`,
        }}
      >
        <BrowserPreview frame={frame} />
      </div>

      <MovingArrow
        color={colors.cyan}
        delay={65}
        duration={140}
        frame={frame}
        path="M650 750 C 720 690, 705 585, 735 560"
      />
      <MovingArrow
        color={colors.teal}
        delay={136}
        duration={155}
        frame={frame}
        path="M1198 565 C 1295 535, 1322 425, 1375 410"
      />
    </AbsoluteFill>
  );
}

function ElementScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const spread = appear(frame, 28, 92);
  const explode = appear(frame, 120, 210);
  const objectIn = appear(frame, 78, 142);
  const tokenPulse = pulse(frame, 54, 0.2, 1);
  const cursor = interpolate(frame, [155, duration - 80], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 152 }}>
        <SceneTitle
          accent={colors.teal}
          eyebrow="JSX is syntax, not runtime magic"
          maxWidth={760}
          subtitle="After compilation, React receives immutable element descriptions: type, props, key, ref, and children."
        >
          JSX becomes JavaScript objects
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 500,
          width: 600,
          height: 360,
          ...panelStyle(colors.teal),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 24,
            fontSize: 22,
            fontWeight: 900,
            color: colors.teal,
          }}
        >
          JSX source
        </div>
        <Token text="<Shell>" x={52} y={92} color={colors.cyan} delay={0} />
        <Token text="<Header />" x={198} y={92} color={colors.purple} delay={9} />
        <Token text="<ProductGrid />" x={62} y={168} color={colors.yellow} delay={18} />
        <Token text="<MiniCart />" x={294} y={168} color={colors.orange} delay={27} />
        <Token text="props" x={110} y={246} color={colors.teal} delay={36} />
        <Token text="children" x={246} y={246} color={colors.cyan} delay={45} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 782,
          top: 530,
          width: 260,
          height: 260,
          borderRadius: 38,
          border: `1px solid ${colors.purple}88`,
          background:
            "linear-gradient(145deg, rgba(173,140,255,0.22), rgba(84,216,255,0.08))",
          boxShadow: `0 0 60px ${colors.purple}33`,
          display: "grid",
          placeItems: "center",
          transform: `scale(${interpolate(spread, [0, 1], [0.72, 1], clamp)}) rotate(${interpolate(frame, [0, duration], [-8, 6], clamp)}deg)`,
          opacity: spread,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: colors.purple,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 2.6,
              textTransform: "uppercase",
            }}
          >
            compiler output
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 10 }}>
            jsx()
          </div>
          <div style={{ color: colors.muted, fontSize: 18, marginTop: 10 }}>
            pure description
          </div>
        </div>
      </div>

      <ElementObject
        color={colors.cyan}
        delay={0}
        frame={frame}
        lines={['type: "Shell"', "props: { children }", "key: null"]}
        title="Element"
        x={1160}
        y={260}
      />
      <ElementObject
        color={colors.yellow}
        delay={26}
        frame={frame}
        lines={['type: "ProductGrid"', "props: { onAdd }", 'key: "grid"']}
        title="Child"
        x={1280}
        y={530}
      />
      <ElementObject
        color={colors.orange}
        delay={52}
        frame={frame}
        lines={['type: "MiniCart"', "props: { items }", 'key: "cart"']}
        title="Sibling"
        x={1465}
        y={735}
      />

      {Array.from({ length: 18 }, (_, index) => {
        const p = (explode + localLoop(frame + index * 11, 72)) % 1;
        const x = 710 + p * 420 + Math.sin(index * 2.1) * 24;
        const y = 650 + Math.sin(p * Math.PI * 2 + index) * 126;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 12,
              height: 12,
              borderRadius: 999,
              background: index % 2 === 0 ? colors.teal : colors.purple,
              opacity: objectIn * (0.25 + tokenPulse * 0.55),
              boxShadow: `0 0 18px ${index % 2 === 0 ? colors.teal : colors.purple}`,
            }}
          />
        );
      })}

      <MovingArrow
        color={colors.teal}
        delay={56}
        duration={118}
        frame={frame}
        path="M690 675 C 730 620, 750 590, 782 620"
      />
      <MovingArrow
        color={colors.purple}
        delay={132}
        duration={150}
        frame={frame}
        path="M1042 650 C 1140 530, 1115 380, 1160 380"
      />
      <div
        style={{
          position: "absolute",
          left: 1030 + cursor * 520,
          top: 903,
          width: 150,
          height: 4,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent, ${colors.teal}, transparent)`,
          opacity: appear(frame, 150, 190) * exit(frame, duration - 100, duration - 50),
        }}
      />
    </AbsoluteFill>
  );
}

function FiberScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const treeIn = appear(frame, 38, 110);
  const activeIndex = Math.floor(frame / 28) % fiberNodes.length;
  const sweep = interpolate(frame, [92, duration - 70], [0, 1], clamp);
  const stackItems = ["beginWork()", "read props", "call component", "completeWork()"];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 92, top: 146 }}>
        <SceneTitle
          accent={colors.cyan}
          eyebrow="Fiber is React's work unit"
          subtitle="Every element becomes a fiber. Each fiber stores identity, pending props, memoized state, lanes, effects, and links to parent, child, sibling, and alternate."
        >
          Rendering is a tree walk React can interrupt
        </SceneTitle>
      </div>

      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0, opacity: treeIn }}
      >
        {fiberLinks.map(([fromId, toId], index) => {
          const from = getNode(fromId);
          const to = getNode(toId);
          const progress = appear(frame, 78 + index * 8, 130 + index * 8);
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={from.x + (to.x - from.x) * progress}
              y2={from.y + (to.y - from.y) * progress}
              stroke={colors.lineStrong}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {fiberNodes.map((node, index) => {
        const active = index === activeIndex;
        const scale = active ? 1.08 + pulse(frame, 24, 0, 0.08) : 1;
        const p = appear(frame, 64 + index * 7, 120 + index * 7);
        return (
          <FiberNode
            key={node.id}
            active={active}
            color={node.type === "host" ? colors.orange : colors.cyan}
            label={node.label}
            style={{
              left: node.x,
              top: node.y,
              opacity: p,
              transform: `translate(-50%, -50%) scale(${scale * interpolate(p, [0, 1], [0.7, 1], clamp)})`,
            }}
            type={node.type}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 105,
          width: 390,
          padding: "28px 30px",
          ...panelStyle(colors.purple),
          opacity: appear(frame, 110, 170),
        }}
      >
        <div
          style={{
            color: colors.purple,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          work loop
        </div>
        {stackItems.map((item, index) => {
          const isActive = Math.floor(frame / 22) % stackItems.length === index;
          return (
            <div
              key={item}
              style={{
                marginTop: 18,
                padding: "14px 16px",
                borderRadius: 12,
                background: isActive
                  ? "rgba(173,140,255,0.22)"
                  : "rgba(255,255,255,0.045)",
                border: `1px solid ${isActive ? colors.purple : "rgba(255,255,255,0.06)"}`,
                color: isActive ? colors.white : "#A9BBC8",
                fontSize: 24,
                fontWeight: isActive ? 900 : 600,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 110,
          width: 440,
          padding: 28,
          ...panelStyle(colors.teal),
          opacity: appear(frame, 158, 220),
        }}
      >
        <div
          style={{
            color: colors.teal,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          double buffering
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 14 }}>
          current tree ↔ work-in-progress tree
        </div>
        <div style={{ color: "#B8CAD6", fontSize: 22, lineHeight: 1.35, marginTop: 14 }}>
          Users keep seeing the committed tree while React prepares a candidate
          tree off to the side.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 510 + sweep * 900,
          top: 176 + Math.sin(sweep * Math.PI * 4) * 22,
          width: 140,
          height: 140,
          borderRadius: 999,
          border: `2px solid ${colors.cyan}`,
          boxShadow: `0 0 50px ${colors.cyan}44`,
          opacity: appear(frame, 100, 140) * exit(frame, duration - 90, duration - 45),
          transform: "translate(-50%, -50%)",
        }}
      />
    </AbsoluteFill>
  );
}

function SchedulerScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meter = pulse(frame, fps * 2.2, 0.25, 1);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 92, top: 148 }}>
        <SceneTitle
          accent={colors.yellow}
          eyebrow="Updates are prioritized before work starts"
          subtitle="React tags updates with lanes. Urgent work can cut ahead; non-urgent transitions can be split into chunks and resumed later."
        >
          The scheduler decides what deserves this frame
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 270,
          width: 1160,
          height: 620,
          ...panelStyle(colors.yellow),
          opacity: appear(frame, 30, 90),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 30,
            color: colors.yellow,
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          lane map
        </div>
        {schedulerLanes.map((lane, index) => {
          const laneIn = appear(frame, 50 + index * 14, 95 + index * 14);
          const packet = localLoop(frame + index * 19, lane.speed);
          const barProgress = Math.min(1, laneIn * (0.36 + packet * 0.64));
          return (
            <div
              key={lane.name}
              style={{
                position: "absolute",
                left: 42,
                right: 42,
                top: lane.y - 230,
                height: 82,
                opacity: laneIn,
                transform: `translateX(${interpolate(laneIn, [0, 1], [-40, 0], clamp)}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 175,
                  height: 82,
                  borderRadius: 14,
                  border: `1px solid ${lane.color}88`,
                  background: `${lane.color}18`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: 20,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 900 }}>{lane.name}</div>
                <div style={{ color: "#AEC2CF", fontSize: 16, marginTop: 3 }}>
                  {lane.detail}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 212,
                  right: 0,
                  top: 31,
                  height: 20,
                  borderRadius: 999,
                  border: `1px solid ${lane.color}55`,
                  background: "rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${barProgress * 100}%`,
                    background: `linear-gradient(90deg, ${lane.color}, rgba(255,255,255,0.7))`,
                    boxShadow: `0 0 28px ${lane.color}`,
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 212 + packet * 840,
                  top: 17,
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: lane.color,
                  boxShadow: `0 0 30px ${lane.color}`,
                  opacity: 0.95,
                  transform: `rotate(${frame * 3 + index * 20}deg)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          right: 96,
          top: 295,
          width: 480,
          height: 585,
          padding: 34,
          ...panelStyle(colors.cyan),
          opacity: appear(frame, 100, 165),
        }}
      >
        <div
          style={{
            color: colors.cyan,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          frame budget
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 78,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          16.7ms
        </div>
        <div style={{ color: "#B8CAD6", fontSize: 22, lineHeight: 1.35 }}>
          React yields so the browser can handle input and paint.
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 38,
            height: 205,
            borderRadius: 20,
            background: "rgba(255,255,255,0.055)",
            border: `1px solid ${colors.lineStrong}`,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 12 }, (_, index) => {
            const height = 36 + Math.sin(frame / 18 + index * 1.4) * 30 + meter * 80;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: 22 + index * 34,
                  bottom: 22,
                  width: 18,
                  height,
                  borderRadius: 999,
                  background:
                    index % 3 === 0
                      ? colors.red
                      : index % 3 === 1
                        ? colors.yellow
                        : colors.cyan,
                  boxShadow: "0 0 18px rgba(84,216,255,0.34)",
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 76,
              borderTop: `2px dashed ${colors.white}55`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 142,
          bottom: 82,
          display: "flex",
          gap: 16,
          opacity: appear(frame, 170, 230) * exit(frame, duration - 92, duration - 48),
        }}
      >
        <Badge color={colors.red}>urgent: run now</Badge>
        <Badge color={colors.purple}>transition: interruptible</Badge>
      </div>
    </AbsoluteFill>
  );
}

function ReconcileScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const rowIn = appear(frame, 52, 110);
  const compareSweep = interpolate(frame, [118, duration - 72], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 92, top: 145 }}>
        <SceneTitle
          accent={colors.orange}
          eyebrow="The diff is local and key-driven"
          subtitle="React compares old fibers to the new element children. Matching type and key lets it preserve state. Different identity creates placement or deletion effects."
        >
          Reconciliation turns descriptions into operations
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          top: 380,
          width: 810,
          height: 560,
          ...panelStyle(colors.orange),
          opacity: appear(frame, 36, 78),
        }}
      >
        <ColumnHeader color={colors.cyan} label="current children" x={42} />
        <ColumnHeader color={colors.teal} label="next children" x={442} />
        {reconcileRows.map((row, index) => {
          const y = 104 + index * 104;
          const active = Math.floor(frame / 45) % reconcileRows.length === index;
          return (
            <div key={row.before}>
              <ChildCard
                color={row.color}
                label={row.before}
                style={{
                  left: 42,
                  top: y,
                  opacity: rowIn,
                  transform: `translateX(${interpolate(rowIn, [0, 1], [-45, 0], clamp)}px)`,
                }}
              />
              <ChildCard
                color={row.after === "removed" ? colors.red : row.color}
                label={row.after}
                style={{
                  left: 442,
                  top: y,
                  opacity: rowIn,
                  transform: `translateX(${interpolate(rowIn, [0, 1], [45, 0], clamp)}px)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 304,
                  top: y + 35,
                  width: 124,
                  height: 4,
                  borderRadius: 999,
                  background: active ? row.color : "rgba(255,255,255,0.2)",
                  boxShadow: active ? `0 0 18px ${row.color}` : "none",
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 40 + compareSweep * 630,
            top: 88,
            width: 96,
            height: 430,
            borderRadius: 22,
            border: `2px solid ${colors.white}`,
            opacity: 0.25,
            boxShadow: "0 0 35px rgba(255,255,255,0.25)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 95,
          top: 382,
          width: 740,
          height: 560,
          ...panelStyle(colors.teal),
          opacity: appear(frame, 112, 172),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 28,
            color: colors.teal,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          generated effect list
        </div>
        {reconcileRows.map((row, index) => {
          const active = Math.floor((frame - 105) / 46) % reconcileRows.length === index;
          const p = appear(frame, 138 + index * 22, 190 + index * 22);
          return (
            <div
              key={row.result}
              style={{
                position: "absolute",
                left: 34,
                right: 34,
                top: 100 + index * 98,
                height: 76,
                borderRadius: 16,
                border: `1px solid ${active ? row.color : "rgba(255,255,255,0.08)"}`,
                background: active ? `${row.color}18` : "rgba(255,255,255,0.045)",
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                alignItems: "center",
                padding: "0 24px",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [28, 0], clamp)}px)`,
              }}
            >
              <div
                style={{
                  color: row.color,
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                effect
              </div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{row.result}</div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            bottom: 28,
            color: "#B8CAD6",
            fontSize: 23,
            lineHeight: 1.36,
          }}
        >
          The DOM is not touched here. Reconciliation only records what must
          happen once the render is accepted.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function HooksScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const dispatch = appear(frame, 68, 122);
  const replay = appear(frame, 144, 240);
  const queueRotation = frame * 1.35;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 92, top: 145 }}>
        <SceneTitle
          accent={colors.purple}
          eyebrow="Hooks live on the current fiber"
          subtitle="State is stored as a linked list of hook cells. Dispatching state appends an update to a queue, then the next render replays the queue in order."
        >
          `useState` is a queue, not a variable
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 438,
          width: 500,
          height: 410,
          padding: 34,
          ...panelStyle(colors.purple),
          opacity: appear(frame, 38, 88),
          transform: `scale(${1 + dispatch * 0.012})`,
        }}
      >
        <div
          style={{
            color: colors.purple,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          component call
        </div>
        <CodeBlock
          lines={[
            "const [count, setCount] = useState(0);",
            "setCount(c => c + 1);",
            "setCount(c => c + 1);",
            "return <Badge count={count} />;",
          ]}
          revealFrame={frame}
          start={70}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 720,
          top: 352,
          width: 480,
          height: 480,
          borderRadius: 999,
          border: `1px solid ${colors.purple}66`,
          boxShadow: `0 0 70px ${colors.purple}24`,
          opacity: appear(frame, 86, 142),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 88,
            borderRadius: 999,
            border: `1px dashed ${colors.lineStrong}`,
          }}
        />
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2 + (queueRotation * Math.PI) / 180;
          const x = 240 + Math.cos(angle) * 160;
          const y = 240 + Math.sin(angle) * 160;
          const active = index < Math.floor(interpolate(frame, [108, 210], [1, 6], clamp));
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 92,
                height: 92,
                borderRadius: 26,
                transform: "translate(-50%, -50%)",
                border: `1px solid ${active ? colors.teal : "rgba(255,255,255,0.16)"}`,
                background: active ? "rgba(85,240,197,0.16)" : "rgba(255,255,255,0.045)",
                display: "grid",
                placeItems: "center",
                color: active ? colors.white : colors.muted,
                fontSize: 24,
                fontWeight: 900,
                boxShadow: active ? `0 0 24px ${colors.teal}44` : "none",
              }}
            >
              +{index % 3 === 0 ? 1 : index % 3 === 1 ? 2 : 0}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 152,
            top: 197,
            width: 176,
            height: 86,
            borderRadius: 24,
            background: "rgba(8,18,30,0.96)",
            border: `1px solid ${colors.purple}`,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            boxShadow: `0 0 38px ${colors.purple}33`,
          }}
        >
          <div>
            <div style={{ color: colors.purple, fontSize: 16, fontWeight: 900 }}>
              update queue
            </div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>
              circular list
            </div>
          </div>
        </div>
      </div>

      <MovingArrow
        color={colors.purple}
        delay={82}
        duration={94}
        frame={frame}
        path="M600 645 C 650 575, 680 540, 735 540"
      />
      <MovingArrow
        color={colors.teal}
        delay={148}
        duration={118}
        frame={frame}
        path="M1180 595 C 1275 615, 1300 700, 1340 700"
      />

      <div
        style={{
          position: "absolute",
          right: 110,
          top: 395,
          width: 490,
          height: 480,
          padding: 34,
          ...panelStyle(colors.teal),
          opacity: appear(frame, 166, 220),
        }}
      >
        <div
          style={{
            color: colors.teal,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          render replay
        </div>
        <NumberStack frame={frame} replay={replay} />
        <div
          style={{
            marginTop: 28,
            color: "#B8CAD6",
            fontSize: 23,
            lineHeight: 1.36,
          }}
        >
          The next render calculates the final state from the previous committed
          state plus every queued update.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 730,
          bottom: 102,
          display: "flex",
          gap: 14,
          opacity: appear(frame, 235, 285) * exit(frame, duration - 70, duration - 28),
        }}
      >
        <Badge color={colors.purple}>same call order</Badge>
        <Badge color={colors.teal}>stable state slots</Badge>
        <Badge color={colors.yellow}>batched updates</Badge>
      </div>
    </AbsoluteFill>
  );
}

function CommitScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const stepIndex = Math.floor((frame - 80) / 58) % commitSteps.length;
  const writeProgress = appear(frame, 138, 250);
  const paintProgress = appear(frame, 230, 325);
  const finalNoteOpacity =
    appear(frame, 250, 315) * exit(frame, duration - 72, duration - 24);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 92, top: 146 }}>
        <SceneTitle
          accent={colors.teal}
          eyebrow="Commit is the point of no return"
          subtitle="After render finishes, React walks the effect list and performs host mutations. Effects are split so reads, writes, and passive work happen in a predictable order."
        >
          The finished fiber tree becomes real UI
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 85,
          top: 392,
          right: 85,
          height: 232,
          ...panelStyle(colors.teal),
          opacity: appear(frame, 38, 90),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 35,
            top: 28,
            color: colors.teal,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          commit phases
        </div>
        {commitSteps.map((step, index) => {
          const active = index === stepIndex;
          const p = appear(frame, 70 + index * 18, 120 + index * 18);
          return (
            <div
              key={step.name}
              style={{
                position: "absolute",
                left: step.x - 170,
                top: 88,
                width: 330,
                height: 92,
                borderRadius: 18,
                border: `1px solid ${active ? step.color : "rgba(255,255,255,0.1)"}`,
                background: active ? `${step.color}1F` : "rgba(255,255,255,0.045)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 24px",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [30, 0], clamp)}px)`,
                boxShadow: active ? `0 0 32px ${step.color}33` : "none",
              }}
            >
              <div style={{ fontSize: 27, fontWeight: 900 }}>{step.name}</div>
              <div style={{ color: "#B8CAD6", fontSize: 18, marginTop: 3 }}>
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 110,
          top: 705,
          width: 720,
          height: 230,
          ...panelStyle(colors.orange),
          opacity: appear(frame, 120, 178),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 28,
            color: colors.orange,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          host operations
        </div>
        <DomOperation frame={frame} index={0} text="append child" x={36} />
        <DomOperation frame={frame} index={1} text="set textContent" x={258} />
        <DomOperation frame={frame} index={2} text="remove node" x={480} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 106,
          top: 680,
          width: 820,
          height: 282,
          opacity: appear(frame, 178, 232),
        }}
      >
        <BrowserPipeline progress={paintProgress} writeProgress={writeProgress} />
      </div>

      <MovingArrow
        color={colors.orange}
        delay={138}
        duration={132}
        frame={frame}
        path="M830 820 C 930 740, 960 730, 1035 782"
      />
      <MovingArrow
        color={colors.teal}
        delay={218}
        duration={126}
        frame={frame}
        path="M1380 730 C 1490 680, 1540 645, 1620 610"
      />
      <div
        style={{
          position: "absolute",
          right: 116,
          top: 174,
          padding: "14px 20px",
          borderRadius: 999,
          border: `1px solid ${colors.teal}88`,
          background: "rgba(85,240,197,0.12)",
          color: colors.teal,
          fontSize: 20,
          fontWeight: 900,
          opacity: finalNoteOpacity,
          boxShadow: `0 0 28px ${colors.teal}22`,
        }}
      >
        committed tree is now current
      </div>
    </AbsoluteFill>
  );
}

function RecapScene({ duration }: SceneProps) {
  const frame = useCurrentFrame();
  const reveal = appear(frame, 25, 90);
  const pipelineIn = appear(frame, 92, 180);
  const loopProgress = localLoop(frame, 126);
  const outro = exit(frame, duration - 60, duration - 10);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 155,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [34, 0], clamp)}px)`,
        }}
      >
        <SceneTitle
          accent={colors.cyan}
          align="center"
          eyebrow="the full loop"
          maxWidth={1050}
          subtitle="React's internal trick is separation: describe UI, prioritize work, build a candidate tree, commit only the accepted changes, then let the browser paint."
        >
          React is not a renderer. It is a coordinator.
        </SceneTitle>
      </div>

      <div
        style={{
          position: "absolute",
          left: 118,
          right: 118,
          top: 535,
          height: 190,
          opacity: pipelineIn * outro,
        }}
      >
        <svg
          width="100%"
          height="190"
          viewBox="0 0 1684 190"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M70 95 H1614"
            stroke={colors.lineStrong}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="26 24"
          />
          <circle
            cx={70 + loopProgress * 1544}
            cy="95"
            r="22"
            fill={colors.cyan}
            opacity="0.95"
          />
          <circle
            cx={70 + loopProgress * 1544}
            cy="95"
            r="42"
            fill="none"
            stroke={colors.cyan}
            strokeWidth="2"
            opacity="0.45"
          />
        </svg>
        {recapSteps.map((step, index) => {
          const p = appear(frame, 108 + index * 16, 158 + index * 16);
          const x = 70 + index * (1544 / (recapSteps.length - 1));
          const active =
            Math.abs(loopProgress - index / (recapSteps.length - 1)) < 0.08;
          return (
            <div
              key={step}
              style={{
                position: "absolute",
                left: x,
                top: 95,
                width: 156,
                height: 92,
                borderRadius: 20,
                transform: `translate(-50%, -50%) scale(${active ? 1.08 : 1})`,
                border: `1px solid ${active ? colors.cyan : "rgba(255,255,255,0.12)"}`,
                background: active
                  ? "rgba(84,216,255,0.18)"
                  : "rgba(8,18,30,0.92)",
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                fontWeight: 900,
                opacity: p,
                boxShadow: active ? `0 0 35px ${colors.cyan}44` : "none",
              }}
            >
              {step}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 278,
          right: 278,
          bottom: 135,
          padding: "34px 48px",
          borderRadius: 28,
          border: `1px solid ${colors.teal}88`,
          background: "rgba(8,18,30,0.86)",
          boxShadow: `0 0 60px ${colors.teal}18`,
          opacity: appear(frame, 210, 285) * outro,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: colors.teal,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 2.6,
            textTransform: "uppercase",
          }}
        >
          learner takeaway
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 40,
            lineHeight: 1.18,
            fontWeight: 900,
          }}
        >
          Components return descriptions. Fiber schedules the calculation.
          Reconciliation records effects. Commit mutates the world.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CodeWindow({ code, title }: { code: string; title: string }) {
  return (
    <div
      style={{
        ...panelStyle(colors.cyan),
        height: 360,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 48,
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 9,
        }}
      >
        {[colors.red, colors.yellow, colors.teal].map((color) => (
          <span
            key={color}
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        ))}
        <span style={{ marginLeft: 12, color: colors.muted, fontSize: 16 }}>
          {title}
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "24px 26px",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize: 22,
          lineHeight: 1.46,
          color: "#DFF6FF",
          whiteSpace: "pre-wrap",
        }}
      >
        {code}
        <span style={{ color: colors.cyan }}>|</span>
      </pre>
    </div>
  );
}

function CodeBlock({
  lines,
  revealFrame,
  start,
}: {
  lines: string[];
  revealFrame: number;
  start: number;
}) {
  return (
    <div
      style={{
        marginTop: 26,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontSize: 20,
        lineHeight: 1.62,
      }}
    >
      {lines.map((line, index) => {
        const p = appear(revealFrame, start + index * 18, start + 44 + index * 18);
        return (
          <div
            key={line}
            style={{
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-22, 0], clamp)}px)`,
              color: index === 1 || index === 2 ? colors.teal : "#DFF6FF",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

function BrowserPreview({ frame }: { frame: number }) {
  const addProgress = appear(frame, 186, 242);
  const shimmer = pulse(frame, 64, 0.35, 1);

  return (
    <div
      style={{
        height: "100%",
        borderRadius: 26,
        background: "rgba(246,250,253,0.96)",
        color: "#10202E",
        overflow: "hidden",
        boxShadow: "0 26px 90px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          height: 64,
          background: "#E9F1F5",
          borderBottom: "1px solid rgba(8,18,30,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 8,
        }}
      >
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            style={{
              width: 13,
              height: 13,
              borderRadius: 999,
              background: item === 0 ? "#FF6A7A" : item === 1 ? "#FFD86E" : "#55F0C5",
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 16,
            height: 28,
            flex: 1,
            borderRadius: 999,
            background: "#FFFFFF",
          }}
        />
      </div>
      <div style={{ padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Shop</div>
            <div style={{ marginTop: 4, color: "#647684", fontSize: 15 }}>
              UI generated by committed host nodes
            </div>
          </div>
          <div
            style={{
              width: 92,
              height: 38,
              borderRadius: 999,
              background: "#10202E",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            Cart {Math.floor(addProgress * 3)}
          </div>
        </div>
        <div style={{ marginTop: 26, display: "grid", gap: 16 }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                height: 94,
                borderRadius: 18,
                background: "#FFFFFF",
                border: "1px solid rgba(8,18,30,0.1)",
                display: "grid",
                gridTemplateColumns: "92px 1fr 96px",
                alignItems: "center",
                gap: 18,
                padding: 16,
                boxShadow: "0 12px 28px rgba(11,25,39,0.08)",
                transform:
                  index === 1
                    ? `translateX(${interpolate(addProgress, [0, 1], [0, -8], clamp)}px)`
                    : "none",
              }}
            >
              <div
                style={{
                  height: 62,
                  borderRadius: 14,
                  background:
                    index === 0
                      ? "#54D8FF"
                      : index === 1
                        ? "#FFD86E"
                        : "#AD8CFF",
                  opacity: 0.86,
                }}
              />
              <div>
                <div style={{ height: 16, width: "82%", borderRadius: 99, background: "#DCE8EF" }} />
                <div
                  style={{
                    marginTop: 12,
                    height: 12,
                    width: `${52 + shimmer * 24}%`,
                    borderRadius: 99,
                    background: "#ECF2F5",
                  }}
                />
              </div>
              <div
                style={{
                  height: 38,
                  borderRadius: 999,
                  background: index === 1 ? "#55F0C5" : "#EDF4F7",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineNode({
  color,
  label,
  style,
}: {
  color: string;
  label: string;
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 84,
        height: 112,
        borderRadius: 20,
        border: `1px solid ${color}88`,
        background: `${color}16`,
        display: "grid",
        placeItems: "center",
        color,
        fontWeight: 900,
        fontSize: 18,
        boxShadow: `0 0 24px ${color}22`,
        ...style,
      }}
    >
      {label}
    </div>
  );
}

function MiniArrow({
  color,
  from,
  progress,
  to,
}: {
  color: string;
  from: { x: number; y: number };
  progress: number;
  to: { x: number; y: number };
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 470 318"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={from.x + (to.x - from.x) * progress}
        y2={from.y + (to.y - from.y) * progress}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MovingArrow({
  color,
  delay,
  duration,
  frame,
  path,
}: {
  color: string;
  delay: number;
  duration: number;
  frame: number;
  path: string;
}) {
  const draw = appear(frame, delay, delay + duration * 0.55);
  const fadeOut = exit(frame, delay + duration * 0.72, delay + duration);
  const dash = interpolate(draw, [0, 1], [700, 0], clamp);

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{
        position: "absolute",
        inset: 0,
        opacity: draw * fadeOut,
        pointerEvents: "none",
      }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="700"
        strokeDashoffset={dash}
        filter="drop-shadow(0 0 10px rgba(84,216,255,0.45))"
      />
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        strokeDasharray="24 28"
        strokeDashoffset={-frame * 6}
      />
    </svg>
  );
}

function Token({
  color,
  delay,
  text,
  x,
  y,
}: {
  color: string;
  delay: number;
  text: string;
  x: number;
  y: number;
}) {
  const frame = useCurrentFrame();
  const p = appear(frame, 56 + delay, 102 + delay);
  const float = Math.sin((frame + delay) / 18) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        padding: "12px 16px",
        borderRadius: 13,
        border: `1px solid ${color}88`,
        background: `${color}18`,
        color,
        fontSize: 22,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontWeight: 900,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1], clamp)})`,
        boxShadow: `0 0 20px ${color}22`,
      }}
    >
      {text}
    </div>
  );
}

function ElementObject({
  color,
  delay,
  frame,
  lines,
  title,
  x,
  y,
}: {
  color: string;
  delay: number;
  frame: number;
  lines: string[];
  title: string;
  x: number;
  y: number;
}) {
  const p = appear(frame, 92 + delay, 154 + delay);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360,
        padding: "24px 26px",
        ...panelStyle(color),
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [42, 0], clamp)}px)`,
      }}
    >
      <div
        style={{
          color,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 2.3,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize: 21,
          lineHeight: 1.56,
          color: "#DFF6FF",
        }}
      >
        {"{"}
        {lines.map((line) => (
          <div key={line} style={{ paddingLeft: 20 }}>
            {line},
          </div>
        ))}
        {"}"}
      </div>
    </div>
  );
}

function FiberNode({
  active,
  color,
  label,
  style,
  type,
}: {
  active: boolean;
  color: string;
  label: string;
  style: CSSProperties;
  type: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: type === "host" ? 132 : 174,
        height: type === "host" ? 74 : 88,
        borderRadius: type === "host" ? 18 : 999,
        border: `2px solid ${active ? colors.white : color}`,
        background: active ? `${color}2B` : "rgba(8,18,30,0.9)",
        boxShadow: active ? `0 0 44px ${color}` : `0 0 22px ${color}22`,
        display: "grid",
        placeItems: "center",
        color: colors.white,
        fontSize: type === "host" ? 20 : 21,
        fontWeight: 900,
        textAlign: "center",
        ...style,
      }}
    >
      <div>
        <div>{label}</div>
        <div
          style={{
            marginTop: 4,
            color,
            fontSize: 12,
            letterSpacing: 1.8,
            textTransform: "uppercase",
          }}
        >
          {type} fiber
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: 999,
        border: `1px solid ${color}88`,
        background: `${color}18`,
        color,
        fontSize: 19,
        fontWeight: 900,
        letterSpacing: 0.3,
        boxShadow: `0 0 22px ${color}1F`,
      }}
    >
      {children}
    </div>
  );
}

function ColumnHeader({ color, label, x }: { color: string; label: string; x: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 48,
        color,
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: 2.2,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

function ChildCard({
  color,
  label,
  style,
}: {
  color: string;
  label: string;
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 240,
        height: 74,
        borderRadius: 16,
        border: `1px solid ${color}88`,
        background: label === "removed" ? "rgba(255,106,122,0.12)" : `${color}16`,
        display: "grid",
        placeItems: "center",
        color: colors.white,
        fontSize: 22,
        fontWeight: 900,
        boxShadow: `0 0 20px ${color}20`,
        ...style,
      }}
    >
      {label}
    </div>
  );
}

function NumberStack({ frame, replay }: { frame: number; replay: number }) {
  const numbers = [0, 1, 2, 3, 5, 7];
  const active = Math.floor(interpolate(frame, [150, 255], [0, numbers.length - 1], clamp));

  return (
    <div style={{ marginTop: 34 }}>
      <div
        style={{
          height: 90,
          borderRadius: 20,
          background: "rgba(255,255,255,0.055)",
          border: `1px solid ${colors.lineStrong}`,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 12,
          overflow: "hidden",
        }}
      >
        {numbers.map((value, index) => (
          <div
            key={value}
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              background: index <= active ? "rgba(85,240,197,0.22)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${index <= active ? colors.teal : "rgba(255,255,255,0.1)"}`,
              color: index <= active ? colors.white : colors.muted,
              fontSize: 25,
              fontWeight: 900,
              opacity: replay,
              transform: `translateY(${interpolate(replay, [0, 1], [24, 0], clamp)}px)`,
            }}
          >
            {value}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          height: 94,
          borderRadius: 20,
          background: "rgba(85,240,197,0.12)",
          border: `1px solid ${colors.teal}`,
          display: "grid",
          placeItems: "center",
          fontSize: 44,
          fontWeight: 900,
          color: colors.teal,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        count = {numbers[active]}
      </div>
    </div>
  );
}

function DomOperation({
  frame,
  index,
  text,
  x,
}: {
  frame: number;
  index: number;
  text: string;
  x: number;
}) {
  const p = appear(frame, 150 + index * 26, 202 + index * 26);
  const active = Math.floor(frame / 42) % 3 === index;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 98,
        width: 186,
        height: 84,
        borderRadius: 18,
        border: `1px solid ${active ? colors.orange : "rgba(255,255,255,0.1)"}`,
        background: active ? "rgba(255,159,95,0.19)" : "rgba(255,255,255,0.05)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        fontSize: 22,
        fontWeight: 900,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0], clamp)}px)`,
        boxShadow: active ? `0 0 24px ${colors.orange}33` : "none",
      }}
    >
      {text}
    </div>
  );
}

function BrowserPipeline({
  progress,
  writeProgress,
}: {
  progress: number;
  writeProgress: number;
}) {
  const stages = [
    { label: "style", color: colors.purple },
    { label: "layout", color: colors.cyan },
    { label: "paint", color: colors.yellow },
    { label: "composite", color: colors.teal },
  ];

  return (
    <div
      style={{
        height: "100%",
        borderRadius: 26,
        background: "rgba(246,250,253,0.95)",
        color: "#10202E",
        overflow: "hidden",
        boxShadow: "0 26px 80px rgba(0,0,0,0.28)",
        display: "grid",
        gridTemplateColumns: "1fr 260px",
      }}
    >
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {stages.map((stage, index) => {
            const active = progress > index / stages.length;
            return (
              <div
                key={stage.label}
                style={{
                  flex: 1,
                  height: 72,
                  borderRadius: 18,
                  background: active ? stage.color : "#E6EEF2",
                  color: active ? "#071018" : "#657987",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 21,
                  fontWeight: 900,
                  boxShadow: active ? `0 12px 28px ${stage.color}55` : "none",
                }}
              >
                {stage.label}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 122,
            borderRadius: 20,
            background: "#FFFFFF",
            border: "1px solid rgba(8,18,30,0.1)",
            padding: 22,
          }}
        >
          <div
            style={{
              width: `${36 + progress * 50}%`,
              height: 20,
              borderRadius: 999,
              background: "#D6E4EB",
            }}
          />
          <div
            style={{
              marginTop: 18,
              width: `${46 + writeProgress * 36}%`,
              height: 20,
              borderRadius: 999,
              background: "#54D8FF",
            }}
          />
        </div>
      </div>
      <div
        style={{
          background: "#10202E",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 34,
          lineHeight: 1.08,
          textAlign: "center",
          padding: 26,
        }}
      >
        Browser
        <br />
        paints
        <br />
        pixels
      </div>
    </div>
  );
}
