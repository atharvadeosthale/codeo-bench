import React from "react";
import { useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, FlowArrow, ez, POP } from "../ui";
import { CodeBlock, K, F, S, N, TAG, A, P, X, CM, CodeLine } from "../code";

const jsxLines: CodeLine[] = [
  [K("function "), F("Counter"), P("() {")],
  [X("  "), K("const "), P("["), X("count"), P(", "), X("setCount"), P("] = "), F("useState"), P("("), N("0"), P(");")],
  [X("  "), K("return "), P("(")],
  [X("    "), P("<"), TAG("button"), X(" "), A("onClick"), P("={() => "), F("setCount"), P("("), X("count"), P(" + "), N("1"), P(")}>")],
  [X("      Count: "), P("{"), X("count"), P("}")],
  [X("    "), P("</"), TAG("button"), P(">")],
  [X("  );")],
  [P("}")],
];

const compiledLines: CodeLine[] = [
  [CM("// what the browser actually gets")],
  [K("function "), F("Counter"), P("() {")],
  [X("  "), K("const "), P("["), X("count"), P(", "), X("setCount"), P("] = "), F("useState"), P("("), N("0"), P(");")],
  [X("  "), K("return "), F("jsx"), P("("), S('"button"'), P(", {")],
  [X("    "), A("onClick"), P(": () => "), F("setCount"), P("("), X("count"), P(" + "), N("1"), P("),")],
  [X("    "), A("children"), P(": ["), S('"Count: "'), P(", "), X("count"), P("],")],
  [X("  });")],
  [P("}")],
];

export const S2Jsx: React.FC = () => {
  const frame = useCurrentFrame();
  const badgeP = ez(frame, 160, 22, POP);

  return (
    <SceneShell index="01" kicker="COMPILATION" title="It starts with JSX" seed={2}>
      <CodeBlock
        lines={jsxLines}
        at={30}
        typeAt={42}
        mode="type"
        cps={2.4}
        x={86}
        y={300}
        width={790}
        fontSize={23}
        title="Counter.jsx"
      />

      <FlowArrow x={905} y={560} length={110} at={150} />
      <div
        style={{
          position: "absolute",
          left: 958,
          top: 472,
          transform: `translate(-50%, 0) scale(${0.7 + badgeP * 0.3})`,
          opacity: ez(frame, 160, 14),
          fontFamily: fonts.mono,
          fontSize: 17,
          fontWeight: 700,
          color: C.yellow,
          border: `1.5px solid ${C.yellow}`,
          borderRadius: 10,
          padding: "6px 13px",
          background: "rgba(7,11,22,0.9)",
          boxShadow: `0 0 24px ${C.yellow}2a`,
        }}
      >
        BABEL / SWC
      </div>

      <CodeBlock
        lines={compiledLines}
        at={180}
        typeAt={190}
        mode="stagger"
        x={1044}
        y={300}
        width={790}
        fontSize={23}
        title="Counter.js — compiled"
      />

      <Caption at={262}>
        JSX never reaches the browser — it compiles down to plain function calls.
      </Caption>
    </SceneShell>
  );
};
