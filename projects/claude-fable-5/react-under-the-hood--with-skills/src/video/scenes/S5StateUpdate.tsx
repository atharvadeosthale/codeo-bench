import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, FlowArrow, ez, EASE_OUT, POP } from "../ui";

const CARD_Y = 540;
const CARD_W = 360;
const CARD_H = 240;

const StepCard: React.FC<{
  cx: number;
  at: number;
  step: string;
  label: string;
  color: string;
  children: React.ReactNode;
}> = ({ cx, at, step, label, color, children }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 26, POP);
  const o = ez(frame, at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - CARD_W / 2,
        top: CARD_Y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        opacity: o,
        transform: `translateY(${(1 - p) * 36}px) scale(${0.85 + p * 0.15})`,
        background: "rgba(10, 15, 30, 0.92)",
        border: `1px solid ${color}55`,
        borderTop: `4px solid ${color}`,
        borderRadius: 16,
        boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 30px ${color}14`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 18,
          fontFamily: fonts.mono,
          fontSize: 17,
          color: C.faint,
        }}
      >
        {step}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 25,
          fontWeight: 700,
          color,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};

export const S5StateUpdate: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor flies in toward the button, clicks at f=62.
  const cursorP = ez(frame, 28, 34, EASE_OUT);
  const cursorX = interpolate(cursorP, [0, 1], [420, 286]);
  const cursorY = interpolate(cursorP, [0, 1], [700, 575]);
  const clickDip = ez(frame, 62, 6) - ez(frame, 68, 8);
  const ripple = ez(frame, 62, 26);
  const cursorO = ez(frame, 28, 12) - ez(frame, 100, 20);

  return (
    <SceneShell
      index="04"
      kicker="STATE UPDATE"
      title="setState schedules — it doesn't paint"
      seed={5}
    >
      <StepCard cx={300} at={20} step="1" label="EVENT" color={C.accent}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            color: "#06121f",
            background: C.accent,
            borderRadius: 12,
            padding: "14px 30px",
            transform: `scale(${1 - clickDip * 0.12})`,
            boxShadow: `0 0 ${20 + ripple * 10}px ${C.accent}66`,
          }}
        >
          Count: 0
        </div>
      </StepCard>

      {/* click ripple + cursor */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        {ripple > 0 && ripple < 1 ? (
          <circle
            cx={296}
            cy={566}
            r={10 + ripple * 70}
            fill="none"
            stroke={C.accent}
            strokeWidth={3 * (1 - ripple)}
            opacity={1 - ripple}
          />
        ) : null}
        <g
          transform={`translate(${cursorX}, ${cursorY}) scale(${1 - clickDip * 0.15})`}
          opacity={cursorO}
        >
          <path
            d="M 0 0 L 0 30 L 8 23 L 14 36 L 19 33 L 13 21 L 23 20 Z"
            fill="#fff"
            stroke="#0a0f1e"
            strokeWidth={1.5}
          />
        </g>
      </svg>

      <FlowArrow x={492} y={CARD_Y} length={110} at={78} />

      <StepCard cx={740} at={92} step="2" label="SET STATE" color={C.yellow}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 25,
            color: C.text,
            background: "rgba(255,203,107,0.08)",
            border: `1px solid ${C.yellow}44`,
            borderRadius: 10,
            padding: "12px 20px",
          }}
        >
          setCount(<span style={{ color: "#F78C6C" }}>1</span>)
        </div>
      </StepCard>

      <FlowArrow x={932} y={CARD_Y} length={110} at={140} color={C.yellow} />

      <StepCard cx={1180} at={152} step="3" label="QUEUE UPDATE" color={C.violet}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 22,
            color: C.text,
            background: "rgba(167,139,250,0.08)",
            border: `1px solid ${C.violet}44`,
            borderRadius: 10,
            padding: "12px 18px",
            lineHeight: 1.5,
          }}
        >
          {"{ action: 1,"}
          <br />
          {"  lane: Sync }"}
        </div>
      </StepCard>

      <FlowArrow x={1372} y={CARD_Y} length={110} at={200} color={C.violet} />

      <StepCard cx={1620} at={212} step="4" label="RE-RENDER" color={C.green}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 23,
            color: C.green,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Counter()
          <br />
          <span style={{ color: C.muted, fontSize: 20 }}>runs again, soon</span>
        </div>
      </StepCard>

      <Caption at={250}>
        Nothing on screen has changed yet — React just remembers there's work to do.
      </Caption>
    </SceneShell>
  );
};
