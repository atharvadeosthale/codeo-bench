import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption } from "../components/ui";
import {
  CodeBlock,
  totalChars,
  kw,
  fn,
  cmp,
  tag,
  att,
  str,
  num,
  pl,
  pun,
  type Line,
} from "../components/CodeBlock";
import { Svg, Line as SLine } from "../components/graphics";

const JSX_LINES: Line[] = [
  [kw("function "), fn("App"), pun("() {")],
  [pl("  "), kw("return"), pun(" (")],
  [pl("    "), pun("<"), tag("div"), pl(" "), att("className"), pun("="), str('"app"'), pun(">")],
  [pl("      "), pun("<"), tag("h1"), pun(">"), pl("Hello, React"), pun("</"), tag("h1"), pun(">")],
  [pl("      "), pun("<"), cmp("Counter"), pl(" "), att("initial"), pun("={"), num("3"), pun("} />")],
  [pl("    "), pun("</"), tag("div"), pun(">")],
  [pl("  "), pun(");")],
  [pun("}")],
];

const COMPILED_LINES: Line[] = [
  [kw("function "), fn("App"), pun("() {")],
  [pl("  "), kw("return "), fn("jsx"), pun("("), str('"div"'), pun(", {")],
  [pl("    "), att("className"), pun(": "), str('"app"'), pun(",")],
  [pl("    "), att("children"), pun(": [")],
  [pl("      "), fn("jsx"), pun("("), str('"h1"'), pun(", { "), att("children"), pun(": "), str('"Hello, React"'), pun(" }),")],
  [pl("      "), fn("jsx"), pun("("), cmp("Counter"), pun(", { "), att("initial"), pun(": "), num("3"), pun(" }),")],
  [pl("    "), pun("],")],
  [pl("  "), pun("});")],
  [pun("}")],
];

const ELEMENT_LINE: Line[] = [
  [
    pun("{ "),
    att("type"),
    pun(": "),
    str('"div"'),
    pun(", "),
    att("props"),
    pun(": { "),
    att("className"),
    pun(": "),
    str('"app"'),
    pun(", "),
    att("children"),
    pun(": ["),
    pl("…"),
    pun("] }, "),
    att("key"),
    pun(": "),
    kw("null"),
    pun(" }"),
  ],
];

export const Jsx: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({ frame, fps, delay: 18, config: { damping: 200 }, durationInFrames: 24 });
  const typeP = ramp(frame, 32, 120);
  const jsxChars = Math.floor(typeP * totalChars(JSX_LINES));

  const arrowP = ramp(frame, 162, 26);
  const rightEnter = spring({ frame, fps, delay: 182, config: { damping: 200 }, durationInFrames: 24 });
  const compiledChars = Math.floor(ramp(frame, 195, 70) * totalChars(COMPILED_LINES));

  const cardS = spring({ frame, fps, delay: 278, config: { damping: 14, mass: 0.7 }, durationInFrames: 34 });
  const dropP = ramp(frame, 268, 18);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="01 · COMPILE" title="JSX is just function calls" />

      <Panel title="App.jsx" x={90} y={228} w={790} h={460} enter={leftEnter} accent={C.pink}>
        <CodeBlock lines={JSX_LINES} visibleChars={jsxChars} showCursor fontSize={26} />
      </Panel>

      <Panel
        title="App.js — compiled"
        x={1040}
        y={228}
        w={790}
        h={460}
        enter={rightEnter}
        accent={C.cyan}
      >
        <CodeBlock lines={COMPILED_LINES} visibleChars={compiledChars} fontSize={23} />
      </Panel>

      <Svg>
        <SLine x1={900} y1={458} x2={1020} y2={458} p={arrowP} color={C.cyan} width={4} arrow />
        {/* drop line from compiled panel to element card */}
        <SLine x1={960} y1={700} x2={960} y2={742} p={dropP} color={C.green} width={3} arrow />
      </Svg>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 394,
          width: 220,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 21,
          color: C.cyan,
          opacity: interpolate(arrowP, [0.4, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Babel / SWC
      </div>

      {/* element object card */}
      <div
        style={{
          position: "absolute",
          left: 960 - 720,
          top: 758,
          width: 1440,
          backgroundColor: C.panel,
          border: `1.5px solid ${C.green}66`,
          borderRadius: 16,
          padding: "26px 36px",
          opacity: cardS,
          transform: `translateY(${(1 - cardS) * 40}px)`,
          boxShadow: `0 0 40px ${C.green}18, 0 20px 50px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 24,
            color: C.green,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          jsx() returns a React element — a plain JavaScript object
        </div>
        <div style={{ fontFamily: MONO, fontSize: 24.5 }}>
          <CodeBlock lines={ELEMENT_LINE} fontSize={24.5} />
        </div>
      </div>

      <Caption at={315}>
        No magic so far — your entire UI is described by cheap, throwaway objects.
      </Caption>
    </AbsoluteFill>
  );
};
