import React from "react";
import { useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, ez, EASE_INOUT } from "../ui";
import { CodeBlock, S, N, A, P, X, CodeLine } from "../code";

const objectLines: CodeLine[] = [
  [P("{")],
  [X("  "), A("type"), P(": "), S('"button"'), P(",")],
  [X("  "), A("props"), P(": {")],
  [X("    "), A("onClick"), P(": "), X("ƒ () => setCount(…)"), P(",")],
  [X("    "), A("children"), P(": ["), S('"Count: "'), P(", "), N("0"), P("],")],
  [X("  },")],
  [X("  "), A("key"), P(": "), N("null"), P(",")],
  [P("}")],
];

const Callout: React.FC<{
  at: number;
  x: number;
  y: number;
  width: number;
  title: string;
  body: string;
  color: string;
  lineTo: [number, number];
  lineFrom: [number, number];
}> = ({ at, x, y, width, title, body, color, lineTo, lineFrom }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 26);
  const lp = ez(frame, at - 8, 20, EASE_INOUT);
  const len = Math.hypot(lineTo[0] - lineFrom[0], lineTo[1] - lineFrom[1]) * 1.3;
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <path
          d={`M ${lineFrom[0]} ${lineFrom[1]} Q ${(lineFrom[0] + lineTo[0]) / 2} ${lineFrom[1]}, ${lineTo[0]} ${lineTo[1]}`}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - lp)}
          opacity={0.65}
        />
        <circle cx={lineFrom[0]} cy={lineFrom[1]} r={5} fill={color} opacity={lp} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          opacity: p,
          transform: `translateY(${(1 - p) * 22}px)`,
          background: "rgba(10, 15, 30, 0.9)",
          border: `1px solid ${color}55`,
          borderLeft: `4px solid ${color}`,
          borderRadius: 12,
          padding: "16px 22px",
        }}
      >
        <div style={{ fontFamily: fonts.display, fontSize: 27, fontWeight: 700, color }}>
          {title}
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            color: C.muted,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {body}
        </div>
      </div>
    </>
  );
};

export const S3Elements: React.FC = () => {
  return (
    <SceneShell index="02" kicker="REACT ELEMENTS" title="Elements are just objects" seed={3}>
      <CodeBlock
        lines={objectLines}
        at={20}
        typeAt={32}
        mode="type"
        cps={2.6}
        x={620}
        y={290}
        width={680}
        fontSize={29}
        title="what jsx(…) returns"
      />

      <Callout
        at={120}
        x={96}
        y={360}
        width={420}
        title="Plain JavaScript"
        body="No classes, no magic — a literal object you could write by hand."
        color={C.accent}
        lineFrom={[620, 430]}
        lineTo={[520, 420]}
      />
      <Callout
        at={150}
        x={1404}
        y={320}
        width={420}
        title="Cheap by design"
        body="Created fresh on every render, discarded just as fast."
        color={C.violet}
        lineFrom={[1300, 400]}
        lineTo={[1400, 380]}
      />
      <Callout
        at={180}
        x={1404}
        y={560}
        width={420}
        title="A description, not the DOM"
        body="It says what the UI should be — it isn't the real <button>."
        color={C.green}
        lineFrom={[1300, 560]}
        lineTo={[1400, 620]}
      />

      <Caption at={232}>
        Every render produces a fresh tree of these descriptions. That's the whole trick.
      </Caption>
    </SceneShell>
  );
};
