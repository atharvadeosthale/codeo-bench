import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, glow } from "../theme";
import { ramp } from "../helpers";
import { Chip } from "../components/ui";

const CX = 960;
const CY = 450;
const R = 235;

const NODES = [
  { angle: -90, label: "Trigger", sub: "setState · new props", color: C.pink, delay: 16 },
  { angle: 30, label: "Render", sub: "build fibers · diff", color: C.cyan, delay: 32 },
  { angle: 150, label: "Commit", sub: "mutate DOM · effects", color: C.orange, delay: 48 },
];

const RECAP = [
  "JSX → plain objects",
  "fiber = unit of work",
  "lanes = priority",
  "diff by type & key",
  "commit is sync",
];

const pos = (angleDeg: number, r = R): [number, number] => {
  const a = (angleDeg * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};

const arcPath = (a1: number, a2: number): string => {
  const [x1, y1] = pos(a1);
  const [x2, y2] = pos(a2);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arcs = [
    { d: arcPath(-66, 6), color: C.pink, delay: 60 },
    { d: arcPath(54, 126), color: C.cyan, delay: 74 },
    { d: arcPath(174, 246), color: C.orange, delay: 88 },
  ];

  // traveling pulse around the loop
  const pulseAngle = -90 + ((frame - 100) * 2.2) % 360;
  const [px, py] = pos(pulseAngle);
  const pulseOn = frame > 110;

  const finalS = spring({ frame, fps, delay: 162, config: { damping: 200 }, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="outroGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {arcs.map((a, i) => {
          const p = ramp(frame, a.delay, 26);
          const [ex, ey] = pos([6, 126, 246][i]);
          const tangent = (([6, 126, 246][i] + 90) * Math.PI) / 180;
          return (
            <g key={i}>
              <path
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeWidth={5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
                filter="url(#outroGlow)"
                opacity={0.85}
              />
              {p > 0.9 ? (
                <polygon
                  points={`${ex + Math.cos(tangent) * 4},${ey + Math.sin(tangent) * 4} ${
                    ex + Math.cos(tangent + Math.PI - 0.5) * 16
                  },${ey + Math.sin(tangent + Math.PI - 0.5) * 16} ${
                    ex + Math.cos(tangent + Math.PI + 0.5) * 16
                  },${ey + Math.sin(tangent + Math.PI + 0.5) * 16}`}
                  fill={a.color}
                  opacity={(p - 0.9) * 10}
                />
              ) : null}
            </g>
          );
        })}
        {pulseOn ? (
          <circle cx={px} cy={py} r={9} fill="#fff" filter="url(#outroGlow)" />
        ) : null}
      </svg>

      {NODES.map((n) => {
        const s = spring({
          frame,
          fps,
          delay: n.delay,
          config: { damping: 12, mass: 0.7 },
          durationInFrames: 34,
        });
        const [x, y] = pos(n.angle);
        const near =
          pulseOn &&
          Math.abs(((pulseAngle - n.angle + 540) % 360) - 180) > 180 - 22;
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: x - 105,
              top: y - 66,
              width: 210,
              textAlign: "center",
              opacity: s,
              transform: `scale(${0.7 + 0.3 * s})`,
            }}
          >
            <div
              style={{
                margin: "0 auto",
                width: 210,
                borderRadius: 18,
                padding: "20px 0 16px",
                backgroundColor: C.panel,
                border: `2px solid ${n.color}`,
                boxShadow: near ? `0 0 36px ${n.color}88` : `0 0 22px ${n.color}22`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 35,
                  fontWeight: 800,
                  color: n.color,
                  textShadow: glow(n.color, 8),
                }}
              >
                {n.label}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 17, color: C.dim, marginTop: 6 }}>
                {n.sub}
              </div>
            </div>
          </div>
        );
      })}

      {/* center label */}
      <div
        style={{
          position: "absolute",
          left: CX - 200,
          top: CY - 36,
          width: 400,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 25,
          color: C.dim,
          opacity: ramp(frame, 100, 22),
          lineHeight: 1.5,
        }}
      >
        the React loop
        <br />
        <span style={{ color: C.faint, fontSize: 20 }}>every frame of your UI</span>
      </div>

      {/* recap chips */}
      <div
        style={{
          position: "absolute",
          top: 808,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        {RECAP.map((r, i) => {
          const s = spring({
            frame,
            fps,
            delay: 112 + i * 9,
            config: { damping: 13, mass: 0.6 },
            durationInFrames: 26,
          });
          return (
            <Chip key={r} color={[C.green, C.yellow, C.orange, C.cyan, C.purple][i]} enter={s} size={21}>
              {r}
            </Chip>
          );
        })}
      </div>

      {/* final line */}
      <div
        style={{
          position: "absolute",
          top: 905,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 700,
          color: C.text,
          opacity: finalS,
          transform: `translateY(${(1 - finalS) * 26}px)`,
        }}
      >
        It’s just JavaScript — <span style={{ color: C.cyan }}>all the way down.</span>
      </div>

      {/* end fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [218, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
