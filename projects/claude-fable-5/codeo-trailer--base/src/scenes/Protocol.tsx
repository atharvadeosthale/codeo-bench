import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { C, EASE_OUT, EASE_SNAP, FONT_MONO } from "../theme";
import { DashRule, Kicker, RisingLine } from "../ui/Type";

export const BEAT = 70;

const PROMPT_TEXT =
  "$ cat tasks/codeo-trailer.json\n> one canonical prompt per task.\n> every model receives it verbatim.\n> no hints. no retries. no second chances.";

const TEMPLATE_LINES = [
  "templates/base/",
  "├─ remotion        4.0.475   [PINNED]",
  "├─ tailwind        v4        [PINNED]",
  "└─ src/            ← the model writes here",
];

const Mono: React.FC<{ children: React.ReactNode; dim?: boolean }> = ({
  children,
  dim,
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontSize: 26,
      lineHeight: 1.75,
      color: dim ? C.inkDim : C.ink,
      whiteSpace: "pre-wrap",
    }}
  >
    {children}
  </div>
);

/** Shared beat scaffold: giant step number left, content right. */
const Beat: React.FC<{
  num: string;
  title: React.ReactNode;
  children: React.ReactNode;
}> = ({ num, title, children }) => {
  const frame = useCurrentFrame();
  const numIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const ruleIn = interpolate(frame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SNAP,
  });
  return (
    <AbsoluteFill
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        style={{
          width: 1520,
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          columnGap: 90,
          alignItems: "start",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 230,
            fontWeight: 500,
            lineHeight: 1,
            color: C.inkFaint,
            opacity: numIn,
            transform: `translateX(${((1 - numIn) * -50).toFixed(1)}px)`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {num}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <Kicker text="the protocol" delay={2} color={C.inkDim} />
          <div style={{ margin: "-10px 0 0 -8px" }}>{title}</div>
          <DashRule grow={ruleIn} />
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Typed: React.FC<{ text: string; delay: number; cps?: number }> = ({
  text,
  delay,
  cps = 1.6,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - delay) * cps));
  const shown = text.slice(0, n);
  return (
    <Mono dim>
      {shown}
      {n < text.length && frame >= delay ? (
        <span style={{ color: C.accent }}>▌</span>
      ) : null}
    </Mono>
  );
};

const PromptBeat: React.FC = () => (
  <Beat
    num="01"
    title={<RisingLine fontSize={128} delay={4}>Same prompt</RisingLine>}
  >
    <div
      style={{
        borderLeft: `4px solid ${C.accent}`,
        background: C.bgRaised,
        outline: `1px solid ${C.line}`,
        borderRadius: 8,
        padding: "26px 34px",
        minHeight: 230,
      }}
    >
      <Typed text={PROMPT_TEXT} delay={16} cps={2.4} />
    </div>
  </Beat>
);

const TemplateBeat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Beat
      num="02"
      title={<RisingLine fontSize={128} delay={4}>Same template</RisingLine>}
    >
      <div
        style={{
          background: C.bgRaised,
          outline: `1px solid ${C.line}`,
          borderRadius: 8,
          padding: "26px 34px",
          minHeight: 230,
        }}
      >
        {TEMPLATE_LINES.map((line, i) => {
          const t = interpolate(frame, [14 + i * 7, 24 + i * 7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_OUT,
          });
          const pinned = line.includes("[PINNED]");
          return (
            <div
              key={line}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 26,
                lineHeight: 1.75,
                whiteSpace: "pre",
                color: i === 0 ? C.ink : C.inkDim,
                opacity: t,
                transform: `translateY(${((1 - t) * 14).toFixed(1)}px)`,
              }}
            >
              {pinned ? (
                <>
                  {line.replace("[PINNED]", "")}
                  <span style={{ color: C.accent }}>[PINNED]</span>
                </>
              ) : (
                line
              )}
            </div>
          );
        })}
      </div>
    </Beat>
  );
};

const RenderBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [12, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SNAP,
  });
  const done = progress >= 1;
  const pct = Math.floor(progress * 100);
  return (
    <Beat
      num="03"
      title={
        <RisingLine fontSize={98} delay={4}>
          Rendered untouched
        </RisingLine>
      }
    >
      <div
        style={{
          background: C.bgRaised,
          outline: `1px solid ${C.line}`,
          borderRadius: 8,
          padding: "30px 34px",
          minHeight: 230,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          fontFamily: FONT_MONO,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.14em",
            color: C.inkDim,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>$ remotion render HelloWorld out/video.mp4</span>
          <span style={{ color: done ? C.ok : C.accent }}>{pct}%</span>
        </div>
        <div style={{ height: 14, background: "rgba(238,240,226,0.07)" }}>
          <div
            style={{
              height: "100%",
              width: `${(progress * 100).toFixed(2)}%`,
              background: done ? C.ok : C.accent,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.1em",
            color: done ? C.ok : C.inkFaint,
          }}
        >
          {done
            ? "✓ DONE — PUBLISHED VERBATIM"
            : `frame ${String(Math.floor(progress * 1020)).padStart(4, "0")} / 1020`}
        </div>
        <div style={{ fontSize: 22, letterSpacing: "0.16em", color: C.inkDim }}>
          NO HUMAN FIXES&nbsp;&nbsp;·&nbsp;&nbsp;BROKEN CODE IS A RESULT TOO
        </div>
      </div>
    </Beat>
  );
};

/** Lime line wipe at each internal cut. */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 7, at + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SNAP,
  });
  if (t <= 0 || t >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: `${(t * 112 - 6).toFixed(2)}%`,
        width: 5,
        background: C.accent,
        boxShadow: `0 0 34px rgba(212,255,63,0.55)`,
      }}
    />
  );
};

export const Protocol: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={BEAT} layout="none">
        <PromptBeat />
      </Sequence>
      <Sequence from={BEAT} durationInFrames={BEAT} layout="none">
        <TemplateBeat />
      </Sequence>
      <Sequence from={BEAT * 2} durationInFrames={BEAT} layout="none">
        <RenderBeat />
      </Sequence>
      <Wipe at={BEAT} />
      <Wipe at={BEAT * 2} />
    </AbsoluteFill>
  );
};
