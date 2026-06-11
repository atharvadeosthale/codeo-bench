import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption, Chip } from "../components/ui";
import { Svg, Curve } from "../components/graphics";

type Row = { label: string; key?: string; y: number; color: string };

const OLD_ROWS: Row[] = [
  { label: "<div>", y: 332, color: C.cyan },
  { label: '<h1> "Hello"', y: 416, color: C.cyan },
  { label: "<ul>", y: 500, color: C.cyan },
  { label: '<li key="a"> Apples', key: "a", y: 584, color: C.green },
  { label: '<li key="b"> Bread', key: "b", y: 668, color: C.yellow },
  { label: '<li key="c"> Coffee', key: "c", y: 752, color: C.pink },
];

const NEW_ROWS: Row[] = [
  { label: "<div>", y: 332, color: C.cyan },
  { label: '<h1> "Hello!"', y: 416, color: C.cyan },
  { label: "<ul>", y: 500, color: C.cyan },
  { label: '<li key="b"> Bread', key: "b", y: 584, color: C.yellow },
  { label: '<li key="a"> Apples', key: "a", y: 668, color: C.green },
  { label: '<li key="c"> Coffee', key: "c", y: 752, color: C.pink },
  { label: '<li key="d"> Dates', key: "d", y: 836, color: C.cyan },
];

const H1_AT = 74;
const MATCH_AT = 132;
const INSERT_AT = 226;
const NOKEYS_AT = 270;

const RowBox: React.FC<{
  x: number;
  row: Row;
  enter: number;
  highlight?: number;
  hColor?: string;
  badge?: { text: string; color: string; p: number };
}> = ({ x, row, enter, highlight = 0, hColor = C.cyan, badge }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: row.y - 31,
      width: 560,
      height: 62,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      borderRadius: 11,
      backgroundColor: highlight > 0.1 ? `${hColor}12` : "rgba(5, 9, 18, 0.65)",
      border: `1.5px solid ${highlight > 0.1 ? hColor : C.stroke}`,
      boxShadow: highlight > 0.1 ? `0 0 ${16 * highlight}px ${hColor}55` : undefined,
      opacity: enter,
      transform: `translateY(${(1 - enter) * 16}px)`,
    }}
  >
    <span style={{ fontFamily: MONO, fontSize: 23, color: row.color }}>{row.label}</span>
    {badge && badge.p > 0.02 ? (
      <span
        style={{
          fontFamily: MONO,
          fontSize: 17,
          fontWeight: 700,
          color: badge.color,
          border: `1px solid ${badge.color}88`,
          backgroundColor: `${badge.color}18`,
          borderRadius: 7,
          padding: "4px 10px",
          opacity: badge.p,
          transform: `scale(${0.7 + 0.3 * badge.p})`,
        }}
      >
        {badge.text}
      </span>
    ) : null}
  </div>
);

export const Reconciliation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({ frame, fps, delay: 12, config: { damping: 200 }, durationInFrames: 24 });
  const rightEnter = spring({ frame, fps, delay: 26, config: { damping: 200 }, durationInFrames: 24 });

  const rowEnter = (i: number, base: number) =>
    spring({ frame, fps, delay: base + i * 7, config: { damping: 200 }, durationInFrames: 20 });

  const h1Glow = spring({ frame, fps, delay: H1_AT, config: { damping: 12 }, durationInFrames: 26 });
  const h1BadgeS = spring({ frame, fps, delay: H1_AT + 8, config: { damping: 13, mass: 0.6 }, durationInFrames: 24 });

  // key match arrows: b, a, c
  const matches: { key: string; fromY: number; toY: number; color: string; delay: number }[] = [
    { key: "b", fromY: 668, toY: 584, color: C.yellow, delay: MATCH_AT },
    { key: "a", fromY: 584, toY: 668, color: C.green, delay: MATCH_AT + 26 },
    { key: "c", fromY: 752, toY: 752, color: C.pink, delay: MATCH_AT + 52 },
  ];

  const insertS = spring({ frame, fps, delay: INSERT_AT, config: { damping: 12, mass: 0.6 }, durationInFrames: 26 });
  const noKeysP = ramp(frame, NOKEYS_AT, 22);

  const oldX = 130;
  const newX = 1230;
  const arrowFromX = oldX + 560 + 8;
  const arrowToX = newX - 8;

  const badgeFor = (key?: string) => {
    if (key === "d") return { text: "+ insert", color: C.green, p: insertS };
    const m = matches.find((mm) => mm.key === key);
    if (m) return { text: "reuse ✓", color: m.color, p: ramp(frame, m.delay + 18, 14) };
    return undefined;
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="05 · DIFF" title="Reconcile: compare by type and key" accent={C.green} />

      <Panel title="current — what's on screen" x={oldX - 30} y={252} w={650} h={600} enter={leftEnter} accent={C.dim} />
      <Panel title="work-in-progress — new render" x={newX - 30} y={252} w={650} h={684} enter={rightEnter} accent={C.green} />

      {OLD_ROWS.map((r, i) => (
        <RowBox
          key={`o${i}`}
          x={oldX}
          row={r}
          enter={rowEnter(i, 22)}
          highlight={i === 1 ? h1Glow : 0}
          hColor={C.yellow}
        />
      ))}
      {NEW_ROWS.map((r, i) => (
        <RowBox
          key={`n${i}`}
          x={newX}
          row={r}
          enter={rowEnter(i, 36)}
          highlight={i === 1 ? h1Glow : r.key === "d" ? insertS : 0}
          hColor={i === 1 ? C.yellow : C.green}
          badge={i === 1 ? { text: "update props", color: C.yellow, p: h1BadgeS } : badgeFor(r.key)}
        />
      ))}

      {/* center annotation for h1 */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 388,
          width: 400,
          textAlign: "center",
          opacity: h1BadgeS,
          transform: `translateY(${(1 - h1BadgeS) * 14}px)`,
          zIndex: 6,
        }}
      >
        <Chip color={C.yellow} size={20}>
          same type → reuse the DOM node
        </Chip>
      </div>

      {/* key matching arrows */}
      <Svg z={4}>
        {matches.map((m) => (
          <Curve
            key={m.key}
            x1={arrowFromX}
            y1={m.fromY}
            cx={(arrowFromX + arrowToX) / 2}
            cy={(m.fromY + m.toY) / 2 + (m.fromY === m.toY ? 26 : 0)}
            x2={arrowToX}
            y2={m.toY}
            p={ramp(frame, m.delay, 22)}
            color={m.color}
            width={3.5}
            arrow
          />
        ))}
      </Svg>
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 688,
          width: 340,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 20,
          color: C.green,
          opacity: ramp(frame, MATCH_AT + 30, 18),
          zIndex: 6,
          backgroundColor: "rgba(8, 13, 25, 0.92)",
          border: `1px solid ${C.green}44`,
          borderRadius: 10,
          padding: "10px 14px",
          lineHeight: 1.4,
        }}
      >
        matched by key — moved, not rebuilt
      </div>

      {/* no-keys warning */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 866,
          width: 400,
          opacity: noKeysP,
          transform: `translateY(${(1 - noKeysP) * 16}px)`,
          zIndex: 6,
        }}
      >
        <div
          style={{
            border: `1.5px solid ${C.red}66`,
            backgroundColor: `${C.red}10`,
            borderRadius: 12,
            padding: "16px 20px",
            fontFamily: FONT,
            fontSize: 20,
            color: C.text,
            textAlign: "center",
            lineHeight: 1.45,
          }}
        >
          <span style={{ color: C.red, fontFamily: MONO, fontWeight: 700 }}>
            without keys:
          </span>{" "}
          React matches by index — a reorder becomes a rewrite of every row.
        </div>
      </div>

      <Caption at={316} y={1000}>
        One O(n) pass: same type → update · different type → replace · lists → match by key.
      </Caption>
    </AbsoluteFill>
  );
};
