import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";
import { SceneBg } from "../ui";

const PANEL_W = 420;
const PANEL_H = 236;
const PANEL_COUNT = 12;
// Radius so 12 panels close into a ring: w / (2 · tan(15°))
const RADIUS = Math.round(PANEL_W / (2 * Math.tan(Math.PI / PANEL_COUNT)));

const PANELS = [
  { name: "GPT-5.2", chip: "BASE" },
  { name: "CLAUDE", chip: "WITH-SKILLS" },
  { name: "GEMINI", chip: "BASE" },
  { name: "GROK", chip: "WITH-SKILLS" },
  { name: "LLAMA", chip: "BASE" },
  { name: "MISTRAL", chip: "WITH-SKILLS" },
  { name: "QWEN", chip: "BASE" },
  { name: "DEEPSEEK", chip: "WITH-SKILLS" },
  { name: "KIMI", chip: "BASE" },
  { name: "NOVA", chip: "WITH-SKILLS" },
  { name: "COMMAND", chip: "BASE" },
  { name: "— AWAITING —", chip: "", blank: true },
];

const Panel: React.FC<{ index: number; rot: number }> = ({ index, rot }) => {
  const p = PANELS[index];
  const facing = index * 30 + rot;
  const depth = Math.cos((facing * Math.PI) / 180); // 1 front, -1 back
  const norm = (depth + 1) / 2;
  const brightness = 0.42 + 0.68 * norm;
  const blur = (1 - norm) * 2.2;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `rotateY(${index * 30}deg) translateZ(${RADIUS}px)`,
        border: "1px solid rgba(238, 240, 226, 0.14)",
        borderRadius: 10,
        overflow: "hidden",
        background: "linear-gradient(160deg, #171a10, #0b0c08)",
        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.55), inset 0 0 26px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `brightness(${brightness}) blur(${blur.toFixed(2)}px)`,
          background:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(238, 240, 226, 0.02) 3px 4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* sprocket strips */}
        {([10, undefined] as const).map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 12,
              bottom: 12,
              left,
              right: left === undefined ? 10 : undefined,
              width: 6,
              opacity: 0.5,
              backgroundImage: `repeating-linear-gradient(180deg, ${C.inkFaint} 0 8px, transparent 8px 18px)`,
            }}
          />
        ))}
        {/* lime sheen + bottom falloff */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(212, 255, 63, 0.09), transparent 36%), linear-gradient(0deg, rgba(5, 6, 3, 0.55), transparent 45%)",
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: p.blank ? 19 : 29,
            letterSpacing: "0.22em",
            color: p.blank ? "rgba(238, 240, 226, 0.25)" : C.ink,
            position: "relative",
          }}
        >
          {p.name}
        </span>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 26px",
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: "0.16em",
            color: C.inkDim,
          }}
        >
          <span>TAKE {String(index + 1).padStart(2, "0")}</span>
          <span style={{ color: p.chip === "WITH-SKILLS" ? C.accent : C.inkDim }}>
            {p.chip}
          </span>
        </div>
      </div>
    </div>
  );
};

const Bracket: React.FC<{
  corner: "tl" | "tr" | "bl" | "br";
  at: number;
}> = ({ corner, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], {
    easing: EASE_OUT,
    ...CLAMP,
  });
  const inset = 92;
  const off = (1 - p) * 10;
  const pos: React.CSSProperties = {
    tl: { top: inset, left: inset, borderTop: `2px solid ${C.accent}`, borderLeft: `2px solid ${C.accent}`, transform: `translate(${off}px, ${off}px)` },
    tr: { top: inset, right: inset, borderTop: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}`, transform: `translate(${-off}px, ${off}px)` },
    bl: { bottom: inset, left: inset, borderBottom: `2px solid ${C.accent}`, borderLeft: `2px solid ${C.accent}`, transform: `translate(${off}px, ${-off}px)` },
    br: { bottom: inset, right: inset, borderBottom: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}`, transform: `translate(${-off}px, ${-off}px)` },
  }[corner];
  return (
    <div
      style={{
        position: "absolute",
        width: 30,
        height: 30,
        opacity: p,
        ...pos,
      }}
    />
  );
};

const Caption: React.FC<{
  text: string;
  at: number;
  until: number;
}> = ({ text, at, until }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) {
    return null;
  }
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 130,
        display: "flex",
        justifyContent: "center",
        gap: "0.28em",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 66,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color: C.ink,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame, [at + i * 3, at + i * 3 + 16], [0, 1], {
          easing: EASE_OUT,
          ...CLAMP,
        });
        const trailingDot = w.endsWith(".");
        return (
          <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 112}%)`,
              }}
            >
              {trailingDot ? w.slice(0, -1) : w}
              {trailingDot ? <span style={{ color: C.accent }}>.</span> : null}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// The zoetrope: the site's hero reel rebuilt full-bleed — twelve takes
// of the same brief spinning past the lens.
export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const rot = interpolate(frame, [0, durationInFrames], [10, -200]);
  const scale = interpolate(frame, [0, durationInFrames], [0.62, 0.74]);
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EASE_OUT,
    ...CLAMP,
  });
  const capFlash = interpolate(frame, [112, 113, 116], [0, 0.4, 0], CLAMP);
  const recOn = frame % 22 < 13;

  return (
    <AbsoluteFill>
      <SceneBg glowX={50} />
      {/* lime core glow behind the ring */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(640px 360px at 50% 46%, rgba(212, 255, 63, 0.07), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 50 - 40}px) scale(${scale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ perspective: 1500, width: PANEL_W, height: PANEL_H }}>
          <div
            style={{
              width: PANEL_W,
              height: PANEL_H,
              transformStyle: "preserve-3d",
              transform: "rotateX(-12deg)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transform: `rotateY(${rot}deg)`,
              }}
            >
              {PANELS.map((_, i) => (
                <Panel key={i} index={i} rot={rot} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* floor reflection */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 150,
          width: 880,
          height: 90,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(212, 255, 63, 0.09), transparent 70%)",
          filter: "blur(10px)",
          opacity: enter,
        }}
      />
      {/* legibility scrim for captions */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, transparent 56%, rgba(5, 6, 3, 0.82) 86%)",
        }}
      />
      <Caption text="EVERY FRAME WRITTEN BY A MODEL." at={24} until={113} />
      <Caption text="RENDERED UNTOUCHED." at={116} until={9999} />
      {/* viewfinder furniture */}
      <Bracket corner="tl" at={10} />
      <Bracket corner="tr" at={13} />
      <Bracket corner="bl" at={16} />
      <Bracket corner="br" at={19} />
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 140,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: "0.2em",
          color: "rgba(255, 255, 255, 0.88)",
          opacity: enter,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: 999,
            background: C.rec,
            opacity: recOn ? 1 : 0.25,
          }}
        />
        REC · A-CAM 01
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: capFlash }} />
    </AbsoluteFill>
  );
};
