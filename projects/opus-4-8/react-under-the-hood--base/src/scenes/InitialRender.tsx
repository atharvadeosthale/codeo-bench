import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, SceneHeading } from "../components/ui";
import { AppUI } from "../components/AppUI";
import { ramp, springIn } from "../components/anim";
import { hexA } from "../components/Background";

const STAGES = [
  { k: "Elements", d: "the tree you built", c: COLORS.react },
  { k: "Render", d: "call components → diff", c: COLORS.jsx },
  { k: "Commit", d: "apply to real DOM", c: COLORS.commit },
  { k: "Browser", d: "paint pixels", c: COLORS.add },
];

export const InitialRender: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const build = ramp(frame, 120, 180);
  const pktT = (frame % 60) / 60;

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 03"
        title="The first render mounts the DOM"
        accent={COLORS.commit}
      />

      {/* pipeline */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          width: 520,
        }}
      >
        {STAGES.map((s, i) => {
          const p = springIn(frame, fps, 20 + i * 16, 14);
          return (
            <div
              key={s.k}
              style={{
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  border: `2px solid ${s.c}`,
                  background: hexA(s.c, 0.14),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.c,
                  fontFamily: FONT.mono,
                  fontWeight: 800,
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 800, fontSize: 30, fontFamily: FONT.sans }}>
                  {s.k}
                </div>
                <div style={{ color: COLORS.textDim, fontSize: 19, fontFamily: FONT.mono }}>
                  {s.d}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* connecting flow line */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line
          x1={600}
          y1={500}
          x2={1080}
          y2={500}
          stroke={hexA(COLORS.commit, 0.4)}
          strokeWidth={3}
          strokeDasharray="4 10"
          opacity={ramp(frame, 90, 110)}
        />
        {ramp(frame, 90, 110) > 0.5 &&
          [0, 0.33, 0.66].map((off) => {
            const t = (pktT + off) % 1;
            return (
              <circle
                key={off}
                cx={interpolate(t, [0, 1], [600, 1080])}
                cy={500}
                r={6}
                fill={COLORS.commit}
                style={{ filter: `drop-shadow(0 0 8px ${COLORS.commit})` }}
              />
            );
          })}
      </svg>

      {/* browser */}
      <div
        style={{
          position: "absolute",
          top: 280,
          right: 90,
          opacity: ramp(frame, 100, 120),
          transform: `scale(${interpolate(ramp(frame, 100, 130), [0, 1], [0.9, 1])})`,
        }}
      >
        <AppUI count={42} build={build} width={560} />
      </div>

      <div style={{ position: "absolute", bottom: 60, left: 80, right: 80 }}>
        <Caption accent={COLORS.commit} delay={150}>
          On mount, React walks the tree, creates every real DOM node once, and the
          browser paints. After this, React's job is only to keep the screen in sync
          when <b style={{ color: COLORS.text }}>data changes</b>.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};
