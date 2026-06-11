import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, ez } from "../ui";

const PANEL_Y = 290;
const PANEL_H = 540;

const PhasePanel: React.FC<{
  x: number;
  w: number;
  at: number;
  title: string;
  tag: string;
  color: string;
  bullets: string[];
  bulletsAt: number;
  barProgress: number;
  barNote?: { x: number; text: string }[];
}> = ({ x, w, at, title, tag, color, bullets, bulletsAt, barProgress, barNote = [] }) => {
  const frame = useCurrentFrame();
  const p = ez(frame, at, 26);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: PANEL_Y,
        width: w,
        height: PANEL_H,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        background: "rgba(10, 15, 30, 0.88)",
        border: `1px solid ${color}40`,
        borderTop: `5px solid ${color}`,
        borderRadius: 20,
        padding: "34px 44px",
        boxShadow: `0 24px 60px rgba(0,0,0,0.4)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: 700, color }}>
          {title}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 19,
            color: C.muted,
            border: `1px solid ${C.line}`,
            borderRadius: 8,
            padding: "3px 12px",
          }}
        >
          {tag}
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        {bullets.map((b, i) => {
          const bp = ez(frame, bulletsAt + i * 16, 20);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 18,
                opacity: bp,
                transform: `translateX(${(1 - bp) * 24}px)`,
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 5, background: color, flexShrink: 0 }} />
              <div style={{ fontFamily: fonts.display, fontSize: 27, color: C.text }}>{b}</div>
            </div>
          );
        })}
      </div>
      {/* progress bar */}
      <div style={{ position: "absolute", left: 44, right: 44, bottom: 44 }}>
        <div
          style={{
            height: 18,
            borderRadius: 9,
            background: "rgba(139,151,172,0.12)",
            border: `1px solid rgba(139,151,172,0.2)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${barProgress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              boxShadow: `0 0 16px ${color}66`,
            }}
          />
        </div>
        {barNote.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${n.x * 100}%`,
              top: -34,
              transform: "translateX(-50%)",
              fontFamily: fonts.mono,
              fontSize: 16,
              color: C.orange,
              opacity: barProgress > n.x ? 1 : 0,
              whiteSpace: "nowrap",
            }}
          >
            ⏸ {n.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export const S8Phases: React.FC = () => {
  const frame = useCurrentFrame();

  // Render bar fills with two pauses — interruptible.
  const renderBar = interpolate(
    frame,
    [70, 105, 122, 150, 168, 205],
    [0, 0.34, 0.34, 0.68, 0.68, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Commit bar fills in one fast, solid burst.
  const commitBar = interpolate(frame, [218, 248], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const handoffP = ez(frame, 205, 16);

  return (
    <SceneShell index="07" kicker="TWO PHASES" title="Render, then commit" seed={8}>
      <PhasePanel
        x={96}
        w={830}
        at={25}
        title="RENDER"
        tag="interruptible · async"
        color={C.accent}
        bullets={[
          "Calls your components",
          "Builds the work-in-progress tree",
          "Can pause, resume, or restart",
          "Touches zero DOM",
        ]}
        bulletsAt={50}
        barProgress={renderBar}
        barNote={[
          { x: 0.34, text: "paused" },
          { x: 0.68, text: "paused" },
        ]}
      />
      <PhasePanel
        x={994}
        w={830}
        at={40}
        title="COMMIT"
        tag="synchronous · atomic"
        color={C.green}
        bullets={[
          "Applies the computed diff to the DOM",
          "Never interrupted — one clean burst",
          "Swaps current ↔ work-in-progress",
          "Runs refs & effects",
        ]}
        bulletsAt={140}
        barProgress={commitBar}
      />

      {/* handoff arrow between panels */}
      <svg
        width={90}
        height={60}
        style={{ position: "absolute", left: 915, top: 760, opacity: handoffP }}
      >
        <line x1={6} y1={30} x2={64} y2={30} stroke={C.text} strokeWidth={3} strokeLinecap="round" />
        <path d="M 52 16 L 70 30 L 52 44" fill="none" stroke={C.text} strokeWidth={3}
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <Caption at={268}>
        Render can be thrown away and redone. Commit happens exactly once — and fast.
      </Caption>
    </SceneShell>
  );
};
