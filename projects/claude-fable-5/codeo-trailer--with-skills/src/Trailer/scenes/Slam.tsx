import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_IMPACT, MONO, SANS } from "../theme";
import { FadeUp, SceneBg } from "../ui";

// Protocol slam: one phrase hits the screen with impact scale-down,
// a 2-frame flash and a decaying camera shake. Pure hard-cut energy.
export const Slam: React.FC<{
  text: string;
  accent?: boolean;
  sub?: string;
  seed: string;
  glowX?: number;
}> = ({ text, accent, sub, seed, glowX = 50 }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 7], [1.16, 1], {
    easing: EASE_IMPACT,
    ...CLAMP,
  });
  const amp = interpolate(frame, [0, 9], [9, 0], CLAMP);
  const dx = (random(`${seed}-x-${frame}`) - 0.5) * 2 * amp;
  const dy = (random(`${seed}-y-${frame}`) - 0.5) * 2 * amp;
  const flash = interpolate(frame, [0, 3], [0.16, 0], CLAMP);

  const trailingDot = text.endsWith(".");
  const body = trailingDot ? text.slice(0, -1) : text;

  return (
    <AbsoluteFill>
      <SceneBg glowX={glowX} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 196,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: accent ? C.accent : C.ink,
            textShadow: accent ? "0 0 50px rgba(212, 255, 63, 0.3)" : undefined,
          }}
        >
          {body}
          <span style={{ color: accent ? C.ink : C.accent }}>
            {trailingDot ? "." : ""}
          </span>
        </div>
        {sub ? (
          <FadeUp at={20} dur={16} style={{ marginTop: 46 }}>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: C.inkDim,
              }}
            >
              {sub}
            </span>
          </FadeUp>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
