import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { SceneHeading } from "../components/ui";
import { ReactLogo } from "../components/ReactLogo";
import { ramp, springIn } from "../components/anim";
import { hexA } from "../components/Background";

const STAGES = [
  { k: "Trigger", d: "state / props change", c: COLORS.change, ang: -90 },
  { k: "Render", d: "re-run components", c: COLORS.jsx, ang: 0 },
  { k: "Reconcile", d: "diff old vs new tree", c: COLORS.add, ang: 90 },
  { k: "Commit", d: "patch the real DOM", c: COLORS.commit, ang: 180 },
];

export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const CX = 960;
  const CY = 600;
  const R = 230;

  const toXY = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    return { x: CX + R * Math.cos(r), y: CY + R * Math.sin(r) };
  };

  // orbiting highlight (one full lap every ~120 frames after intro)
  const loopT = Math.max(0, frame - 40) / 120;
  const orbitDeg = -90 + loopT * 360;
  const orbit = toXY(orbitDeg);

  // which stage is "active"
  const activeIdx = Math.floor(((loopT % 1) * 4 + 0.5)) % 4;

  // outro fade — diagram out, wordmark in
  const outroStart = durationInFrames - 90;
  const diagramOut = interpolate(frame, [outroStart, outroStart + 25], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordmark = ramp(frame, outroStart + 18, outroStart + 45);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 70, left: 80, opacity: diagramOut }}>
        <SceneHeading
          kicker="The whole cycle"
          title="React, in one loop"
          accent={COLORS.react}
        />
      </div>

      {/* diagram */}
      <AbsoluteFill style={{ opacity: diagramOut }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {/* ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={hexA(COLORS.react, 0.25)}
            strokeWidth={3}
            strokeDasharray="2 12"
          />
          {/* progress arc up to orbit */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={hexA(COLORS.react, 0.6)}
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * R}`}
            strokeDashoffset={`${2 * Math.PI * R * (1 - (loopT % 1))}`}
            transform={`rotate(-90 ${CX} ${CY})`}
            strokeLinecap="round"
          />
          {/* orbiting dot */}
          <circle
            cx={orbit.x}
            cy={orbit.y}
            r={10}
            fill={COLORS.react}
            style={{ filter: `drop-shadow(0 0 14px ${COLORS.react})` }}
          />
          {/* arrows between stages (chevrons mid-arc) */}
          {STAGES.map((s, i) => {
            const mid = toXY(s.ang + 45);
            return (
              <text
                key={i}
                x={mid.x}
                y={mid.y + 8}
                fill={hexA(COLORS.react, 0.7)}
                fontSize={30}
                textAnchor="middle"
                transform={`rotate(${s.ang + 135} ${mid.x} ${mid.y})`}
              >
                ▶
              </text>
            );
          })}
        </svg>

        {/* center label */}
        <div
          style={{
            position: "absolute",
            left: CX - 140,
            top: CY - 60,
            width: 280,
            textAlign: "center",
          }}
        >
          <ReactLogo size={110} speed={1.2} />
        </div>

        {/* stage cards */}
        {STAGES.map((s, i) => {
          const pos = toXY(s.ang);
          const p = springIn(frame, fps, 10 + i * 8, 14);
          const active = i === activeIdx && loopT > 0;
          return (
            <div
              key={s.k}
              style={{
                position: "absolute",
                left: pos.x - 130,
                top: pos.y - 55,
                width: 260,
                opacity: p,
                transform: `scale(${interpolate(p, [0, 1], [0.6, active ? 1.06 : 1])})`,
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: active ? hexA(s.c, 0.2) : COLORS.panelSolid,
                  border: `2px solid ${s.c}`,
                  boxShadow: active
                    ? `0 0 36px ${hexA(s.c, 0.7)}`
                    : `0 8px 24px rgba(0,0,0,0.4)`,
                  textAlign: "center",
                }}
              >
                <div style={{ color: s.c, fontWeight: 800, fontSize: 30, fontFamily: FONT.sans }}>
                  {s.k}
                </div>
                <div style={{ color: COLORS.textDim, fontSize: 17, fontFamily: FONT.mono, marginTop: 4 }}>
                  {s.d}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* outro wordmark */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: wordmark,
          transform: `scale(${interpolate(wordmark, [0, 1], [0.9, 1])})`,
          flexDirection: "column",
          gap: 24,
        }}
      >
        <ReactLogo size={200} speed={1.3} />
        <div
          style={{
            fontFamily: FONT.sans,
            fontSize: 76,
            fontWeight: 900,
            color: COLORS.text,
            letterSpacing: -1,
          }}
        >
          That's React, under the hood.
        </div>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 26,
            color: COLORS.react,
            letterSpacing: 4,
          }}
        >
          elements → fiber → diff → commit → repeat
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
