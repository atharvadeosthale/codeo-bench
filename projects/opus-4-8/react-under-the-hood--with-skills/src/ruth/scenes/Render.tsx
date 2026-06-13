import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { Caption, Chip, Kicker, SceneShell } from "../ui";

const FlowDot: React.FC<{ from: number; to: number; x0: number; x1: number; y: number; color: string }> = ({ from, to, x0, x1, y, color }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const vis = frame >= from && frame <= to + 4 ? 1 : 0;
  const x = interpolate(p, [0, 1], [x0, x1]);
  return (
    <div style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 99, background: color, boxShadow: `0 0 16px ${color}`, opacity: vis }} />
  );
};

export const RenderScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const boxP = interpolate(frame, [16, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outP = interpolate(frame, [70, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const exec = 0.5 + 0.5 * Math.sin(frame / 5);

  const elements = ["<div>", "<h1>", "<button>", '"text"'];

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "78px 110px", justifyContent: "center" }}>
        <Kicker delay={2}>Step 04 — Where the tree comes from</Kicker>
        <h2 style={{ margin: "16px 0 50px", fontSize: 56, fontWeight: 800, color: COLORS.white, letterSpacing: -1 }}>
          Rendering is just <span style={{ color: COLORS.violet }}>calling your functions</span>
        </h2>

        <div style={{ position: "relative", height: 360, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
          {/* props in */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: boxP }}>
            <div style={{ fontFamily: FONT_MONO, color: COLORS.muted, fontSize: 20, marginBottom: 4 }}>props · state</div>
            <Chip label="{ count: 3 }" color={COLORS.green} />
            <Chip label="{ theme: 'dark' }" color={COLORS.green} />
          </div>

          {/* function machine */}
          <div
            style={{
              width: 440,
              borderRadius: 20,
              padding: "26px 30px",
              background: "linear-gradient(180deg, #131d33, #0c1322)",
              border: `2px solid ${COLORS.violet}`,
              boxShadow: `0 0 ${30 + exec * 30}px ${COLORS.violet}55, 0 30px 70px rgba(0,0,0,0.5)`,
              opacity: boxP,
              transform: `scale(${interpolate(boxP, [0, 1], [0.8, 1])})`,
              fontFamily: FONT_MONO,
            }}
          >
            <div style={{ color: COLORS.violet, fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>⚛ COMPONENT</div>
            <div style={{ color: COLORS.white, fontSize: 26, lineHeight: 1.5 }}>
              <span style={{ color: COLORS.pink }}>function</span> <span style={{ color: COLORS.yellow }}>Counter</span>(props) {"{"}
              <br />
              &nbsp;&nbsp;<span style={{ color: COLORS.pink }}>return</span> <span style={{ color: COLORS.react }}>{"<UI/>"}</span>;
              <br />
              {"}"}
            </div>
            <div style={{ marginTop: 16, height: 6, borderRadius: 99, background: "#0a0f1c", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${exec * 100}%`, background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.react})` }} />
            </div>
          </div>

          {/* elements out */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: outP }}>
            <div style={{ fontFamily: FONT_MONO, color: COLORS.muted, fontSize: 20, marginBottom: 4 }}>returns elements</div>
            {elements.map((e, i) => {
              const ep = interpolate(frame, [70 + i * 8, 70 + i * 8 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <div key={e} style={{ opacity: ep, transform: `translateX(${interpolate(ep, [0, 1], [-20, 0])}px)`, fontFamily: FONT_MONO, fontSize: 24, color: COLORS.react, padding: "8px 16px", borderRadius: 10, background: "#0f1c2e", border: `1px solid ${COLORS.panelEdge}` }}>
                  {e}
                </div>
              );
            })}
          </div>

          {/* flow dots */}
          <FlowDot from={42} to={68} x0={340} x1={560} y={180} color={COLORS.green} />
          <FlowDot from={48} to={74} x0={340} x1={560} y={180} color={COLORS.green} />
          <FlowDot from={64} to={90} x0={1080} x1={1300} y={180} color={COLORS.react} />
        </div>

        <Caption delay={108} accent={COLORS.violet}>
          React calls components top-down, building the whole element tree in memory.
        </Caption>
      </AbsoluteFill>
    </SceneShell>
  );
};
