import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, TreeNode, ez, EASE_INOUT, POP } from "../ui";
import { CodeBlock, K, F, P, X, CM, N, CodeLine } from "../code";

const loopLines: CodeLine[] = [
  [CM("// the work loop, simplified")],
  [K("let "), X("next"), P(" = "), X("fiberRoot"), P(";")],
  [],
  [K("while "), P("("), X("next"), P(" !== "), N("null"), P(" && !"), F("shouldYield"), P("()) {")],
  [X("  next"), P(" = "), F("performUnitOfWork"), P("("), X("next"), P(");")],
  [P("}")],
  [],
  [CM("// out of time? pause — pick it up later")],
];

const PointerLabel: React.FC<{ x: number; y: number; at: number; text: string; color: string }> = ({
  x,
  y,
  at,
  text,
  color,
}) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: p,
        fontFamily: fonts.mono,
        fontSize: 19,
        fontWeight: 700,
        color,
        background: "rgba(5,7,13,0.85)",
        padding: "2px 10px",
        borderRadius: 6,
      }}
    >
      .{text}
    </div>
  );
};

// Main-thread timeline chunks
const CHUNKS = [
  { w: 150, label: "render", color: C.accent },
  { w: 150, label: "render", color: C.accent },
  { w: 150, label: "render", color: C.accent },
  { w: 190, label: "click handler", color: C.orange },
  { w: 150, label: "render", color: C.accent },
  { w: 150, label: "render", color: C.accent },
  { w: 170, label: "commit", color: C.green },
];
const GAP = 16;
const TL_X = 150;
const TL_Y = 818;
const TL_LEN = CHUNKS.reduce((a, c) => a + c.w + GAP, -GAP);

export const S7Fiber: React.FC = () => {
  const frame = useCurrentFrame();
  const arrowP = (at: number) => ez(frame, at, 20, EASE_INOUT);
  const playhead = interpolate(frame, [185, 345], [TL_X, TL_X + TL_LEN], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tlEnter = ez(frame, 160, 26);

  // x where the orange chunk starts (for the "yield" callout)
  let acc = TL_X;
  const chunkXs = CHUNKS.map((c) => {
    const x = acc;
    acc += c.w + GAP;
    return x;
  });
  const yieldCalloutP = ez(frame, 245, 20, POP) - ez(frame, 330, 18);

  return (
    <SceneShell index="06" kicker="FIBER" title="Work, one small unit at a time" seed={7}>
      {/* fiber pointer graph */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* child pointers */}
        <line x1={300} y1={372} x2={300} y2={438} stroke={C.accent} strokeWidth={2.5}
          strokeDasharray={66} strokeDashoffset={66 * (1 - arrowP(55))} />
        <line x1={300} y1={512} x2={300} y2={578} stroke={C.accent} strokeWidth={2.5}
          strokeDasharray={66} strokeDashoffset={66 * (1 - arrowP(75))} />
        {/* sibling pointer */}
        <line x1={400} y1={610} x2={540} y2={610} stroke={C.yellow} strokeWidth={2.5}
          strokeDasharray={140} strokeDashoffset={140 * (1 - arrowP(95))} />
        {/* return pointer (curved, dashed) */}
        <path
          d="M 700 580 C 760 460, 600 420, 400 475"
          fill="none"
          stroke={C.violet}
          strokeWidth={2}
          strokeDasharray="8 8"
          opacity={arrowP(115)}
        />
        <path d="M 412 466 L 396 477 L 414 484" fill="none" stroke={C.violet} strokeWidth={2}
          opacity={arrowP(125)} />
      </svg>

      <TreeNode x={300} y={340} label="FiberRoot" at={28} frame={frame} color={C.muted} fontSize={24} />
      <TreeNode x={300} y={475} label="App" sub="fiber" at={42} frame={frame} color={C.accent} fontSize={24} />
      <TreeNode x={300} y={612} label="button" sub="fiber" at={62} frame={frame} color={C.accent} fontSize={24} />
      <TreeNode x={640} y={612} label="ul" sub="fiber" at={85} frame={frame} color={C.yellow} fontSize={24} />

      <PointerLabel x={355} y={405} at={60} text="child" color={C.accent} />
      <PointerLabel x={355} y={545} at={80} text="child" color={C.accent} />
      <PointerLabel x={470} y={585} at={100} text="sibling" color={C.yellow} />
      <PointerLabel x={685} y={445} at={120} text="return" color={C.violet} />

      <CodeBlock
        lines={loopLines}
        at={60}
        typeAt={72}
        mode="type"
        cps={2.0}
        x={950}
        y={300}
        width={870}
        title="ReactFiberWorkLoop.js"
        flash={[{ line: 3, at: 230, color: C.orange }]}
      />

      {/* main thread timeline */}
      <div
        style={{
          position: "absolute",
          left: TL_X,
          top: TL_Y - 60,
          opacity: tlEnter,
          fontFamily: fonts.mono,
          fontSize: 21,
          letterSpacing: 5,
          color: C.muted,
        }}
      >
        MAIN THREAD
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: tlEnter }}>
        {CHUNKS.map((c, i) => {
          const lit = playhead > chunkXs[i] + 8;
          const fill = lit ? c.color : "rgba(139,151,172,0.15)";
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: chunkXs[i],
                  top: TL_Y,
                  width: c.w,
                  height: 54,
                  borderRadius: 10,
                  background: lit ? `${c.color}26` : "rgba(139,151,172,0.08)",
                  border: `1.5px solid ${fill}`,
                  boxShadow: lit ? `0 0 18px ${c.color}33` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: lit ? c.color : C.faint,
                }}
              >
                {c.label}
              </div>
            </div>
          );
        })}
        {/* playhead */}
        {frame > 180 ? (
          <div
            style={{
              position: "absolute",
              left: playhead,
              top: TL_Y - 14,
              width: 3,
              height: 82,
              background: "#fff",
              boxShadow: "0 0 14px rgba(255,255,255,0.7)",
              borderRadius: 2,
            }}
          />
        ) : null}
      </div>

      {/* yield callout above the orange chunk */}
      <div
        style={{
          position: "absolute",
          left: chunkXs[3] + CHUNKS[3].w / 2,
          top: TL_Y - 64,
          transform: `translate(-50%, ${(1 - Math.max(0, yieldCalloutP)) * 14}px)`,
          opacity: Math.max(0, yieldCalloutP),
          fontFamily: fonts.mono,
          fontSize: 20,
          fontWeight: 700,
          color: C.orange,
          background: "rgba(7,11,22,0.92)",
          border: `1.5px solid ${C.orange}`,
          borderRadius: 10,
          padding: "8px 16px",
          whiteSpace: "nowrap",
        }}
      >
        shouldYield() → React pauses, browser responds
      </div>

      <Caption at={350}>
        One fiber, one unit of work — pause anytime, and the page never freezes.
      </Caption>
    </SceneShell>
  );
};
