import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, glow } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption, NodeCard, Chip } from "../components/ui";
import { Svg, Line as SLine, Curve } from "../components/graphics";

const F = {
  root: { x: 470, y: 285, label: "HostRoot" },
  app: { x: 470, y: 420, label: "App" },
  div: { x: 470, y: 555, label: "div" },
  h1: { x: 310, y: 690, label: "h1" },
  counter: { x: 640, y: 690, label: "Counter" },
  button: { x: 640, y: 815, label: "button" },
} as const;

type StepKind = "begin" | "complete";
const STEPS: { kind: StepKind; node: keyof typeof F }[] = [
  { kind: "begin", node: "root" },
  { kind: "begin", node: "app" },
  { kind: "begin", node: "div" },
  { kind: "begin", node: "h1" },
  { kind: "complete", node: "h1" },
  { kind: "begin", node: "counter" },
  { kind: "begin", node: "button" },
  { kind: "complete", node: "button" },
  { kind: "complete", node: "counter" },
  { kind: "complete", node: "div" },
];

const STEP_START = 118;
const STEP_LEN = 17;
const YIELD_AFTER = 5; // yield to the browser after 5 units of work

export const Fiber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ptrDraw = ramp(frame, 56, 34);
  const retDraw = ramp(frame, 80, 34);

  // current step index (-1 before traversal starts)
  const rawStep = Math.floor((frame - STEP_START) / STEP_LEN);
  const stepIdx = Math.min(STEPS.length - 1, rawStep);
  const active = rawStep >= 0 && rawStep < STEPS.length + 2 ? STEPS[stepIdx] : null;

  const nodeEnter = (i: number) =>
    spring({ frame, fps, delay: 16 + i * 8, config: { damping: 13, mass: 0.6 }, durationInFrames: 30 });

  const keys = Object.keys(F) as (keyof typeof F)[];

  const panelEnter = spring({ frame, fps, delay: 40, config: { damping: 200 }, durationInFrames: 24 });
  const tlEnter = spring({ frame, fps, delay: 95, config: { damping: 200 }, durationInFrames: 24 });

  const clickChipS = spring({
    frame,
    fps,
    delay: STEP_START + YIELD_AFTER * STEP_LEN - 4,
    config: { damping: 12, mass: 0.6 },
    durationInFrames: 28,
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="03 · FIBER" title="A linked list of tiny units of work" accent={C.yellow} />

      <Svg>
        {/* child pointers (down) */}
        {(
          [
            ["root", "app"],
            ["app", "div"],
            ["div", "h1"],
            ["counter", "button"],
          ] as const
        ).map(([a, b]) => (
          <SLine
            key={`${a}-${b}`}
            x1={F[a].x}
            y1={F[a].y + 34}
            x2={F[b].x}
            y2={F[b].y - 36}
            p={ptrDraw}
            color={C.cyan}
            width={3.5}
            arrow
          />
        ))}
        {/* sibling pointer (right) */}
        <SLine
          x1={F.h1.x + 80}
          y1={F.h1.y}
          x2={F.counter.x - 88}
          y2={F.counter.y}
          p={ptrDraw}
          color={C.yellow}
          width={3.5}
          arrow
        />
        {/* return pointers (dashed curves back up) */}
        <Curve
          x1={F.h1.x - 80}
          y1={F.h1.y - 10}
          cx={F.h1.x - 190}
          cy={(F.h1.y + F.div.y) / 2}
          x2={F.div.x - 82}
          y2={F.div.y + 10}
          p={retDraw}
          color={C.dim}
          width={2.5}
          dashed
          arrow
        />
        <Curve
          x1={F.button.x + 80}
          y1={F.button.y - 10}
          cx={F.button.x + 180}
          cy={(F.button.y + F.counter.y) / 2}
          x2={F.counter.x + 88}
          y2={F.counter.y + 12}
          p={retDraw}
          color={C.dim}
          width={2.5}
          dashed
          arrow
        />
      </Svg>

      {keys.map((k, i) => {
        const isActive = active?.node === k;
        const hColor = active?.kind === "complete" ? C.green : C.cyan;
        return (
          <NodeCard
            key={k}
            x={F[k].x}
            y={F[k].y}
            w={k === "root" || k === "counter" ? 180 : 150}
            h={68}
            label={F[k].label}
            color={k === "app" || k === "counter" ? C.purple : C.cyan}
            enter={nodeEnter(i)}
            highlight={isActive ? 1 : 0}
            highlightColor={hColor}
          />
        );
      })}

      {/* legend */}
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 250,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: ramp(frame, 70, 18),
        }}
      >
        {(
          [
            [C.cyan, "child"],
            [C.yellow, "sibling"],
            [C.dim, "return"],
          ] as const
        ).map(([color, name]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 3, backgroundColor: color }} />
            <span style={{ fontFamily: MONO, fontSize: 19, color: C.dim }}>{name}</span>
          </div>
        ))}
      </div>

      {/* work loop panel */}
      <Panel title="workLoop()" x={1080} y={250} w={750} h={470} enter={panelEnter} accent={C.yellow}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginBottom: 18 }}>
          while (work && !shouldYield())
        </div>
        <div
          style={{
            backgroundColor: "rgba(5, 9, 18, 0.7)",
            borderRadius: 12,
            border: `1px solid ${C.stroke}`,
            padding: "22px 26px",
            minHeight: 90,
            display: "flex",
            alignItems: "center",
          }}
        >
          {active ? (
            <span
              style={{
                fontFamily: MONO,
                fontSize: 34,
                fontWeight: 700,
                color: active.kind === "begin" ? C.cyan : C.green,
                textShadow: glow(active.kind === "begin" ? C.cyan : C.green, 10),
              }}
            >
              {active.kind === "begin" ? "beginWork(" : "completeWork("}
              <span style={{ color: C.text }}>{F[active.node].label}</span>)
            </span>
          ) : (
            <span style={{ fontFamily: MONO, fontSize: 30, color: C.faint }}>
              {frame < STEP_START ? "waiting for work…" : "render pass complete ✓"}
            </span>
          )}
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 21, color: C.dim }}>
          unit of work{" "}
          <span style={{ color: C.text }}>
            {Math.max(0, Math.min(STEPS.length, rawStep + 1))}
          </span>{" "}
          / {STEPS.length}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONT,
            fontSize: 23,
            lineHeight: 1.55,
            color: C.text,
            borderTop: `1px solid ${C.stroke}`,
            paddingTop: 20,
            opacity: ramp(frame, 150, 20),
          }}
        >
          Fibers replaced the old recursive renderer. A loop over a linked list can{" "}
          <span style={{ color: C.yellow }}>pause, resume, and abandon</span> work —
          recursion can’t.
        </div>
      </Panel>

      {/* main-thread timeline */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 882,
          width: 1680,
          opacity: tlEnter,
          transform: `translateY(${(1 - tlEnter) * 24}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim, marginBottom: 10 }}>
          main thread
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 58,
            backgroundColor: "rgba(8, 13, 25, 0.8)",
            border: `1px solid ${C.stroke}`,
            borderRadius: 12,
            padding: "0 14px",
          }}
        >
          {STEPS.map((s, i) => {
            const fill = ramp(frame, STEP_START + i * STEP_LEN, STEP_LEN * 0.8);
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    width: 118,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: "rgba(97, 218, 251, 0.08)",
                    border: `1px solid ${C.cyan}33`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${fill * 100}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${C.cyan}cc, ${C.cyan})`,
                      boxShadow: fill > 0 ? `0 0 12px ${C.cyan}66` : undefined,
                    }}
                  />
                </div>
                {i === YIELD_AFTER - 1 ? (
                  <div
                    style={{
                      width: 168,
                      display: "flex",
                      justifyContent: "center",
                      opacity: clickChipS,
                      transform: `translateY(${(1 - clickChipS) * -26}px)`,
                    }}
                  >
                    <Chip color={C.pink} size={18}>
                      click handled ✓
                    </Chip>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 20,
            color: C.dim,
            marginTop: 10,
            opacity: interpolate(clickChipS, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          ↑ between units, React yields — urgent events run before rendering continues
        </div>
      </div>

      <Caption at={330} y={1002}>
        Rendering became interruptible. That single idea unlocked concurrent React.
      </Caption>
    </AbsoluteFill>
  );
};
