import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, glow } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption, ClickRipple, Chip } from "../components/ui";
import { Svg, Curve } from "../components/graphics";

const CLICK_AT = 46;
const FLY_START = 62;
const FLY_DUR = 34;
const LANE_AT = 130;
const FLUSH_AT = 196;
const FLIP_AT = 244;

const LANES = [
  { name: "SyncLane", mask: "0b0000001", note: "click, input", color: C.red },
  { name: "InputContinuousLane", mask: "0b0000100", note: "hover, scroll", color: C.orange },
  { name: "DefaultLane", mask: "0b0010000", note: "this update ←", color: C.cyan, target: true },
  { name: "TransitionLane1", mask: "0b1000000", note: "startTransition", color: C.purple },
  { name: "IdleLane", mask: "0b1…0000000", note: "offscreen work", color: C.faint },
];

export const Scheduling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({ frame, fps, delay: 14, config: { damping: 200 }, durationInFrames: 24 });
  const midEnter = spring({ frame, fps, delay: 30, config: { damping: 200 }, durationInFrames: 24 });
  const rightEnter = spring({ frame, fps, delay: 46, config: { damping: 200 }, durationInFrames: 24 });

  // flying setState chip
  const flyP = spring({
    frame,
    fps,
    delay: FLY_START,
    config: { damping: 16, mass: 0.8 },
    durationInFrames: FLY_DUR,
  });
  const flyX = interpolate(flyP, [0, 1], [330, 700]);
  const flyY = interpolate(flyP, [0, 1], [610, 420]);
  const flyVisible = frame >= FLY_START && frame < FLY_START + FLY_DUR + 20;

  const queueCardS = spring({
    frame,
    fps,
    delay: FLY_START + FLY_DUR - 4,
    config: { damping: 13, mass: 0.6 },
    durationInFrames: 28,
  });

  const laneGlow = spring({ frame, fps, delay: LANE_AT, config: { damping: 12 }, durationInFrames: 30 });
  const flushP = ramp(frame, FLUSH_AT, 34);

  // count flip
  const flipP = ramp(frame, FLIP_AT, 16);
  const showNew = flipP > 0.5;
  const flipRot = interpolate(flipP, [0, 0.5, 1], [0, 90, 0]);

  const stale = frame > CLICK_AT + 14 && frame < FLIP_AT;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="04 · SCHEDULE" title="setState doesn’t render — it schedules" accent={C.orange} />

      {/* Counter app */}
      <Panel title="Counter — on screen" x={110} y={262} w={470} h={430} enter={leftEnter} accent={C.pink}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>count</div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 120,
              fontWeight: 800,
              color: C.text,
              transform: `rotateX(${flipRot}deg)`,
              textShadow: showNew ? glow(C.green, 16) : undefined,
            }}
          >
            {showNew ? 4 : 3}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 28,
              color: "#0B1220",
              backgroundColor: C.cyan,
              borderRadius: 12,
              padding: "12px 42px",
              fontWeight: 700,
              boxShadow:
                frame >= CLICK_AT && frame < CLICK_AT + 16
                  ? `0 0 30px ${C.cyan}`
                  : `0 6px 20px rgba(0,0,0,0.4)`,
              transform: frame >= CLICK_AT && frame < CLICK_AT + 8 ? "scale(0.93)" : "scale(1)",
            }}
          >
            +1
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 20,
              color: stale ? C.orange : C.faint,
              opacity: frame > CLICK_AT + 20 ? 1 : 0,
            }}
          >
            {stale ? "still shows 3 — nothing re-rendered yet" : "re-rendered ✓"}
          </div>
        </div>
      </Panel>
      <ClickRipple x={345} y={610} at={CLICK_AT} />

      {/* flying setState */}
      {flyVisible ? (
        <div
          style={{
            position: "absolute",
            left: flyX,
            top: flyY,
            zIndex: 20,
            opacity: interpolate(frame, [FLY_START + FLY_DUR + 6, FLY_START + FLY_DUR + 18], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Chip color={C.yellow} size={24}>
            setCount(c =&gt; c + 1)
          </Chip>
        </div>
      ) : null}

      {/* update queue */}
      <Panel title="useState hook · updateQueue" x={650} y={330} w={480} h={330} enter={midEnter} accent={C.yellow}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim, marginBottom: 16 }}>
          queued on the fiber:
        </div>
        <div
          style={{
            backgroundColor: "rgba(5, 9, 18, 0.7)",
            border: `1.5px solid ${C.yellow}55`,
            borderRadius: 12,
            padding: "20px 22px",
            opacity: queueCardS,
            transform: `scale(${0.85 + 0.15 * queueCardS})`,
            boxShadow: queueCardS > 0.5 ? `0 0 24px ${C.yellow}22` : undefined,
            fontFamily: MONO,
            fontSize: 22,
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: C.dim }}>{"{"}</span>
          <br />
          <span style={{ color: C.cyan }}>&nbsp;&nbsp;action</span>
          <span style={{ color: C.dim }}>: </span>
          <span style={{ color: C.yellow }}>c =&gt; c + 1</span>
          <span style={{ color: C.dim }}>,</span>
          <br />
          <span style={{ color: C.cyan }}>&nbsp;&nbsp;lane</span>
          <span style={{ color: C.dim }}>: </span>
          <span style={{ color: C.green }}>DefaultLane</span>
          <br />
          <span style={{ color: C.dim }}>{"}"}</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT,
            fontSize: 20,
            color: C.dim,
            opacity: ramp(frame, LANE_AT - 14, 18),
          }}
        >
          …then React assigns it a priority lane →
        </div>
      </Panel>

      {/* lanes */}
      <Panel title="lanes — a 31-bit priority bitmask" x={1200} y={262} w={630} h={500} enter={rightEnter} accent={C.cyan}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {LANES.map((lane) => {
            const isTarget = Boolean(lane.target);
            const g = isTarget ? laneGlow : 0;
            return (
              <div
                key={lane.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: `1.5px solid ${isTarget && g > 0.2 ? lane.color : C.stroke}`,
                  backgroundColor: isTarget && g > 0.2 ? `${lane.color}14` : "rgba(5,9,18,0.5)",
                  boxShadow: isTarget && g > 0.2 ? `0 0 ${20 * g}px ${lane.color}44` : undefined,
                  transform: `scale(${1 + (isTarget ? g * 0.03 : 0)})`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 21, color: lane.color, width: 250 }}>
                  {lane.name}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 19, color: C.faint, width: 130 }}>
                  {lane.mask}
                </span>
                <span style={{ fontFamily: FONT, fontSize: 19, color: isTarget && g > 0.2 ? C.text : C.dim }}>
                  {lane.note}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: FONT,
            fontSize: 21,
            color: C.text,
            lineHeight: 1.5,
            opacity: ramp(frame, LANE_AT + 30, 20),
          }}
        >
          Lower bit = more urgent. A <span style={{ color: C.red }}>SyncLane</span> click can
          interrupt a half-finished <span style={{ color: C.purple }}>Transition</span> render.
        </div>
      </Panel>

      {/* flush arrow back to the counter */}
      <Svg z={5}>
        <Curve
          x1={1200}
          y1={790}
          cx={870}
          cy={880}
          x2={420}
          y2={720}
          p={flushP}
          color={C.green}
          width={4}
          arrow
        />
      </Svg>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 845,
          fontFamily: MONO,
          fontSize: 22,
          color: C.green,
          opacity: interpolate(flushP, [0.3, 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        flush the lane → render → commit
      </div>

      <Caption at={282}>
        Many setStates, one render: React batches everything in the same lane.
      </Caption>
    </AbsoluteFill>
  );
};
