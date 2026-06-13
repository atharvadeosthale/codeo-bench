import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { Caption, CodePanel, Kicker, Line, SceneShell, tk } from "../ui";

const JSX_CODE: Line[] = [
  [tk("<"), tk("button", "tag"), tk(" "), tk("className", "attr"), tk("=", "punct"), tk('"btn"', "string"), tk(">")],
  [tk("  Hello")],
  [tk("</"), tk("button", "tag"), tk(">")],
];

const CALL_CODE: Line[] = [
  [tk("React", "fn"), tk("."), tk("createElement", "fn"), tk("(")],
  [tk("  "), tk('"button"', "string"), tk(",")],
  [tk("  { "), tk("className", "prop"), tk(": "), tk('"btn"', "string"), tk(" },")],
  [tk("  "), tk('"Hello"', "string")],
  [tk(")")],
];

const OBJ_CODE: Line[] = [
  [tk("{")],
  [tk("  type", "attr"), tk(": "), tk('"button"', "string"), tk(",")],
  [tk("  props", "attr"), tk(": {")],
  [tk("    className", "prop"), tk(": "), tk('"btn"', "string"), tk(",")],
  [tk("    children", "prop"), tk(": "), tk('"Hello"', "string")],
  [tk("  },")],
  [tk("  $$typeof", "attr"), tk(": "), tk("Symbol(react.element)", "comment")],
  [tk("}")],
];

const Arrow: React.FC<{ p: number; label: string }> = ({ p, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      opacity: p,
      transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
    }}
  >
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 15,
        color: COLORS.violet,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
    <svg width={70} height={26}>
      <defs>
        <linearGradient id="arr" x1="0" x2="1">
          <stop offset="0%" stopColor={COLORS.react} stopOpacity={0.2} />
          <stop offset="100%" stopColor={COLORS.react} />
        </linearGradient>
      </defs>
      <line x1={2} y1={13} x2={58} y2={13} stroke="url(#arr)" strokeWidth={3} />
      <path d={`M52 6 L66 13 L52 20`} fill="none" stroke={COLORS.react} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  </div>
);

export const CreateElementScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const a1 = interpolate(frame, [40, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const a2 = interpolate(frame, [78, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const panel = (delay: number) =>
    interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const Wrap: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
    const p = panel(d);
    return (
      <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)` }}>
        {children}
      </div>
    );
  };

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "80px 90px", justifyContent: "center" }}>
        <Kicker delay={2}>Step 02 — The compiler rewrites it</Kicker>
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 26, justifyContent: "center" }}>
          <Wrap d={6}>
            <CodePanel title="JSX" lines={JSX_CODE} width={360} fontSize={22} accent={COLORS.react} />
          </Wrap>
          <Arrow p={a1} label="Babel / SWC" />
          <Wrap d={40}>
            <CodePanel title="createElement()" lines={CALL_CODE} width={420} fontSize={22} accent={COLORS.violet} />
          </Wrap>
          <Arrow p={a2} label="evaluates to" />
          <Wrap d={78}>
            <CodePanel title="React element (a plain object)" lines={OBJ_CODE} width={520} fontSize={22} accent={COLORS.green} />
          </Wrap>
        </div>
        <Caption delay={120} accent={COLORS.green}>
          Every tag becomes a lightweight JavaScript object describing the UI.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
