import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, Code, Panel, SceneHeading, Tok } from "../components/ui";
import { springIn } from "../components/anim";
import { hexA } from "../components/Background";

const fiberFields: Tok[][] = [
  [{ t: "fiber", c: "cyan" }, { t: " = {", c: "punct" }],
  [{ t: "  type", c: "attr" }, { t: ":        Post,", c: "comment" }],
  [{ t: "  child", c: "attr" }, { t: ":       ↓ fiber,", c: "comment" }],
  [{ t: "  sibling", c: "attr" }, { t: ":     → fiber,", c: "comment" }],
  [{ t: "  return", c: "attr" }, { t: ":      ↑ parent,", c: "comment" }],
  [{ t: "  alternate", c: "attr" }, { t: ":   old fiber,", c: "comment" }],
  [{ t: "  pendingProps", c: "attr" }, { t: ", memoizedState", c: "comment" }],
  [{ t: "}", c: "punct" }],
];

// units of work processed in the loop
const UNITS = ["App", "Post", "h2", "button", "text"];

export const Fiber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // work loop: process one unit every 18 frames, starting at 70
  const START = 70;
  const STEP = 16;
  const processed = Math.floor(Math.max(0, frame - START) / STEP);
  const activeIdx = Math.min(processed, UNITS.length - 1);

  // a yield event: at frame ~150 browser needs to handle input → pause
  const yieldAt = 150;
  const yielding = frame >= yieldAt && frame < yieldAt + 30;

  // time-slice budget bar (sawtooth, refilled each "frame" of work)
  const budget = 1 - ((frame - START) % STEP) / STEP;

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 06"
        title="Fiber — work split into units"
        accent={COLORS.fiber}
      />

      {/* fiber node anatomy */}
      <Panel
        accent={COLORS.fiber}
        glow={0.5}
        style={{
          position: "absolute",
          top: 300,
          left: 80,
          width: 560,
          padding: "24px 18px",
          opacity: springIn(frame, fps, 10, 16),
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: 2, color: COLORS.fiber, marginBottom: 10, paddingLeft: 12, fontWeight: 700 }}>
          ONE FIBER = ONE UNIT OF WORK
        </div>
        <Code lines={fiberFields} fontSize={23} revealStart={14} />
      </Panel>

      {/* work loop */}
      <div style={{ position: "absolute", top: 300, right: 90, width: 700 }}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 16,
            letterSpacing: 2,
            color: COLORS.fiber,
            fontWeight: 700,
            opacity: springIn(frame, fps, 50),
            marginBottom: 18,
          }}
        >
          THE WORK LOOP — performUnitOfWork()
        </div>

        {/* units queue */}
        <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
          {UNITS.map((u, i) => {
            const appear = springIn(frame, fps, 54 + i * 5, 14);
            const isActive = i === activeIdx && !yielding && frame >= START;
            const isDone = i < activeIdx || (i === activeIdx && processed >= UNITS.length);
            const col = isActive ? COLORS.fiber : isDone ? COLORS.add : COLORS.reactDim;
            return (
              <div
                key={u}
                style={{
                  opacity: appear,
                  flex: 1,
                  padding: "14px 6px",
                  textAlign: "center",
                  borderRadius: 10,
                  border: `2px solid ${col}`,
                  background: isActive ? hexA(COLORS.fiber, 0.22) : isDone ? hexA(COLORS.add, 0.12) : COLORS.panelSolid,
                  color: col,
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 19,
                  transform: `translateY(${isActive ? -8 : 0}px) scale(${isActive ? 1.06 : 1})`,
                  boxShadow: isActive ? `0 0 26px ${hexA(COLORS.fiber, 0.7)}` : "none",
                }}
              >
                {isDone ? "✓ " : ""}
                {u}
              </div>
            );
          })}
        </div>

        {/* time budget bar */}
        <div style={{ opacity: springIn(frame, fps, 80) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 18, color: COLORS.textDim, marginBottom: 8 }}>
            <span>frame time budget</span>
            <span style={{ color: yielding ? COLORS.change : COLORS.fiber }}>
              {yielding ? "yield to browser →" : "~16ms / slice"}
            </span>
          </div>
          <div
            style={{
              height: 22,
              borderRadius: 11,
              background: hexA(COLORS.textDim, 0.15),
              overflow: "hidden",
              border: `1px solid ${hexA(COLORS.fiber, 0.3)}`,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(yielding ? 0.08 : budget) * 100}%`,
                background: yielding
                  ? `linear-gradient(90deg, ${COLORS.change}, ${COLORS.remove})`
                  : `linear-gradient(90deg, ${COLORS.fiber}, ${COLORS.add})`,
                borderRadius: 11,
              }}
            />
          </div>
        </div>

        {/* phase badges */}
        <div style={{ display: "flex", gap: 16, marginTop: 30, opacity: springIn(frame, fps, 100) }}>
          <Phase
            title="Render phase"
            desc="interruptible · can pause, resume, restart"
            color={COLORS.fiber}
            active={!yielding}
          />
          <Phase
            title="Commit phase"
            desc="synchronous · DOM updated in one pass"
            color={COLORS.commit}
            active={false}
          />
        </div>

        {/* yield callout */}
        {yielding && (
          <div
            style={{
              marginTop: 22,
              padding: "12px 18px",
              borderRadius: 12,
              border: `2px solid ${COLORS.change}`,
              background: hexA(COLORS.change, 0.16),
              color: COLORS.change,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 20,
              opacity: interpolate(frame, [yieldAt, yieldAt + 6], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            ⚡ user typed — pause low-priority work, handle input, resume
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 56, left: 80, right: 80 }}>
        <Caption accent={COLORS.fiber} delay={120}>
          Pre-Fiber, rendering was one blocking recursion. Fiber turns it into a{" "}
          <b style={{ color: COLORS.text }}>linked list of units</b> React can pause
          between — so urgent updates never wait behind a big render.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};

const Phase: React.FC<{ title: string; desc: string; color: string; active: boolean }> = ({
  title,
  desc,
  color,
  active,
}) => (
  <div
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 12,
      border: `2px solid ${active ? color : hexA(color, 0.4)}`,
      background: active ? hexA(color, 0.14) : "transparent",
      boxShadow: active ? `0 0 22px ${hexA(color, 0.4)}` : "none",
    }}
  >
    <div style={{ color, fontWeight: 800, fontSize: 22, fontFamily: FONT.sans }}>{title}</div>
    <div style={{ color: COLORS.textDim, fontSize: 16, fontFamily: FONT.mono, marginTop: 4 }}>{desc}</div>
  </div>
);
