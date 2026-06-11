import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, Chip, TreeNode, Edge, ez, EASE_INOUT, POP } from "../ui";

const LEVELS = [380, 500, 620];
const SCAN_START = 110;
const SCAN_END = 205;

const Badge: React.FC<{
  x: number;
  y: number;
  at: number;
  ok: boolean;
}> = ({ x, y, at, ok }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 18, POP);
  const color = ok ? C.green : C.orange;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${p})`,
        opacity: p,
        width: 38,
        height: 38,
        borderRadius: 19,
        background: "rgba(7,11,22,0.95)",
        border: `2px solid ${color}`,
        boxShadow: `0 0 18px ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontSize: 22,
        fontWeight: 700,
        color,
      }}
    >
      {ok ? "✓" : "≠"}
    </div>
  );
};

const TreeLabel: React.FC<{ x: number; text: string; color: string; at: number }> = ({
  x,
  text,
  color,
  at,
}) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 22);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 290,
        transform: "translateX(-50%)",
        opacity: p,
        fontFamily: fonts.mono,
        fontSize: 23,
        fontWeight: 700,
        letterSpacing: 4,
        color,
      }}
    >
      {text}
    </div>
  );
};

export const S6Diff: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, [SCAN_START, SCAN_END], [340, 660], {
    easing: EASE_INOUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanO =
    ez(frame, SCAN_START - 8, 10) - ez(frame, SCAN_END, 12);
  const mismatchFlash =
    frame > 190 ? 0.4 + 0.3 * Math.sin((frame - 190) / 4) ** 2 : 0;

  // Keyed list: left A B C → right C A B, matched by key.
  const leftKeys = ["a", "b", "c"];
  const rightKeys = ["c", "a", "b"];
  const itemX = (i: number, side: "l" | "r") =>
    side === "l" ? 430 + i * 130 : 1230 + i * 130;
  const LIST_Y = 880;

  return (
    <SceneShell
      index="05"
      kicker="RECONCILIATION"
      title="Diff the old tree against the new"
      seed={6}
    >
      <TreeLabel x={560} text="CURRENT" color={C.accent} at={20} />
      <TreeLabel x={1360} text="WORK-IN-PROGRESS" color={C.violet} at={35} />

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={960}
          y1={330}
          x2={960}
          y2={670}
          stroke={C.line}
          strokeWidth={1}
          strokeDasharray="6 10"
          opacity={ez(frame, 30, 30) * 0.5}
        />
        <Edge from={[560, 410]} to={[560, 470]} at={45} frame={frame} />
        <Edge from={[560, 530]} to={[560, 590]} at={55} frame={frame} />
        <Edge from={[1360, 410]} to={[1360, 470]} at={65} frame={frame} />
        <Edge from={[1360, 530]} to={[1360, 590]} at={75} frame={frame} />
        {/* scanline */}
        {scanO > 0.01 ? (
          <g opacity={scanO}>
            <line
              x1={180}
              y1={scanY}
              x2={1740}
              y2={scanY}
              stroke={C.accent}
              strokeWidth={2}
            />
            <rect
              x={180}
              y={scanY - 26}
              width={1560}
              height={26}
              fill="url(#scanGrad)"
            />
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(97,218,251,0)" />
                <stop offset="100%" stopColor="rgba(97,218,251,0.18)" />
              </linearGradient>
            </defs>
          </g>
        ) : null}
        {/* keyed-list connectors */}
        {leftKeys.map((k, i) => {
          const j = rightKeys.indexOf(k);
          return (
            <Edge
              key={k}
              from={[itemX(i, "l") + 44, LIST_Y]}
              to={[itemX(j, "r") - 44, LIST_Y]}
              at={285 + i * 12}
              frame={frame}
              color={C.green}
              width={2}
              dur={24}
            />
          );
        })}
      </svg>

      {/* left tree */}
      <TreeNode x={560} y={LEVELS[0]} label="<App />" at={40} frame={frame} color={C.accent} />
      <TreeNode x={560} y={LEVELS[1]} label="<button>" at={52} frame={frame} color={C.accent} />
      <TreeNode x={560} y={LEVELS[2]} label='"Count: 0"' at={64} frame={frame} color={C.accent} fontSize={24} flash={mismatchFlash} />
      {/* right tree */}
      <TreeNode x={1360} y={LEVELS[0]} label="<App />" at={60} frame={frame} color={C.violet} />
      <TreeNode x={1360} y={LEVELS[1]} label="<button>" at={72} frame={frame} color={C.violet} />
      <TreeNode x={1360} y={LEVELS[2]} label='"Count: 1"' at={84} frame={frame} color={C.violet} fontSize={24} flash={mismatchFlash} />

      {/* comparison verdicts as the scanline passes each level */}
      <Badge x={960} y={LEVELS[0]} at={128} ok />
      <Badge x={960} y={LEVELS[1]} at={162} ok />
      <Badge x={960} y={LEVELS[2]} at={196} ok={false} />

      <Chip at={216} x={960} y={710} color={C.orange} fontSize={25}>
        patch: textContent “0” → “1”
      </Chip>

      {/* keyed list demo */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 800,
          transform: "translateX(-50%)",
          opacity: ez(frame, 255, 24),
          fontFamily: fonts.mono,
          fontSize: 21,
          letterSpacing: 4,
          color: C.muted,
        }}
      >
        KEYS MATCH BY IDENTITY, NOT POSITION
      </div>
      {leftKeys.map((k, i) => (
        <TreeNode
          key={`l-${k}`}
          x={itemX(i, "l")}
          y={LIST_Y}
          label={`<li key="${k}">`}
          at={262 + i * 8}
          frame={frame}
          color={C.blue}
          fontSize={20}
        />
      ))}
      {rightKeys.map((k, i) => (
        <TreeNode
          key={`r-${k}`}
          x={itemX(i, "r")}
          y={LIST_Y}
          label={`<li key="${k}">`}
          at={262 + i * 8}
          frame={frame}
          color={C.violet}
          fontSize={20}
        />
      ))}

      <Caption at={342}>
        Same type? Update in place. Different? Rebuild. Keys keep reordered lists stable.
      </Caption>
    </SceneShell>
  );
};
