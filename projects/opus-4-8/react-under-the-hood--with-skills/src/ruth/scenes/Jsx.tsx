import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Caption, CodePanel, Kicker, Line, SceneShell, tk, totalChars } from "../ui";

const CODE: Line[] = [
  [tk("function", "keyword"), tk(" "), tk("Counter", "fn"), tk("() {")],
  [tk("  "), tk("const", "keyword"), tk(" [count, setCount] = "), tk("useState", "fn"), tk("("), tk("0", "number"), tk(");")],
  [tk("  "), tk("return", "keyword"), tk(" (")],
  [tk("    <"), tk("button", "tag"), tk(" "), tk("onClick", "attr"), tk("={() => "), tk("setCount", "fn"), tk("(count + "), tk("1", "number"), tk(")}>")],
  [tk("      Clicked "), tk("{count}", "prop"), tk(" times")],
  [tk("    </"), tk("button", "tag"), tk(">")],
  [tk("  );")],
  [tk("}")],
];

export const JsxScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const total = totalChars(CODE);
  const reveal = Math.floor(
    interpolate(frame, [22, 22 + 90], [0, total], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          flexDirection: "column",
          padding: "92px 120px",
          justifyContent: "center",
        }}
      >
        <Kicker delay={2}>Step 01 — You write this</Kicker>
        <div style={{ height: 26 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
          <CodePanel title="Counter.jsx" lines={CODE} reveal={reveal} width={820} />
          <div style={{ maxWidth: 460 }}>
            <div
              style={{
                fontFamily: "inherit",
                fontSize: 44,
                fontWeight: 700,
                color: COLORS.white,
                lineHeight: 1.15,
              }}
            >
              It all begins with{" "}
              <span style={{ color: COLORS.react }}>JSX</span>.
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 27,
                color: COLORS.muted,
                lineHeight: 1.5,
              }}
            >
              Familiar, HTML-like syntax describing what the UI should look like —
              but the browser has never heard of it.
            </div>
          </div>
        </div>
        <Caption delay={118}>JSX is not HTML. So what is it really?</Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
