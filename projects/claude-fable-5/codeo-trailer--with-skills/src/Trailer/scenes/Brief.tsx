import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, EASE_OUT, MONO } from "../theme";
import { FadeUp, kickerStyle, MaskRise, SceneBg } from "../ui";

const PROMPT_TEXT =
  "Create a trailer for the website. Highly animate it — this is a real trailer, and I want your best work.";

const TYPE_START = 22;
const TYPE_SPEED = 1.45; // chars per frame

// The brief: the canonical task prompt typing itself into a slate-style
// card, then stamped as dispatched — verbatim, no retries.
export const Brief: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.03]);

  const chars = Math.max(
    0,
    Math.min(PROMPT_TEXT.length, Math.floor((frame - TYPE_START) * TYPE_SPEED)),
  );
  const typed = PROMPT_TEXT.slice(0, chars);
  const doneAt = TYPE_START + PROMPT_TEXT.length / TYPE_SPEED;
  const typingDone = frame >= doneAt;
  const cursorOn = !typingDone || frame % 18 < 10;

  const cardIn = interpolate(frame, [0, 20], [0, 1], {
    easing: EASE_OUT,
    ...CLAMP,
  });

  return (
    <AbsoluteFill>
      <SceneBg glowX={30} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
        }}
      >
        <MaskRise at={2} dur={16}>
          <span style={kickerStyle}>THE BRIEF</span>
        </MaskRise>
        <div style={{ height: 40 }} />
        <div
          style={{
            width: 1180,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 42}px) rotate(${(1 - cardIn) * -1.5}deg)`,
            border: `1px solid ${C.lineStrong}`,
            borderRadius: 10,
            overflow: "hidden",
            background: C.bgRaised,
            boxShadow: "0 36px 90px rgba(0, 0, 0, 0.55)",
          }}
        >
          {/* clapper stripe, straight off the site's slate card */}
          <div
            style={{
              height: 16,
              background: `repeating-linear-gradient(-45deg, ${C.accent} 0 16px, ${C.bg} 16px 32px)`,
              borderBottom: "1px solid #2a2d20",
            }}
          />
          <div style={{ padding: "30px 42px 38px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingBottom: 22,
                marginBottom: 26,
                borderBottom: `1px solid ${C.line}`,
                fontFamily: MONO,
                fontSize: 17,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.inkFaint,
              }}
            >
              <span>tasks/codeo-trailer.json</span>
              <span>ONE PROMPT · EVERY MODEL</span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 33,
                lineHeight: 1.65,
                color: C.ink,
                minHeight: 168,
                borderLeft: `4px solid ${C.accent}`,
                paddingLeft: 30,
              }}
            >
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: 17,
                  height: 36,
                  marginLeft: 6,
                  transform: "translateY(6px)",
                  background: C.accent,
                  opacity: cursorOn ? 1 : 0,
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ height: 42 }} />
        <FadeUp at={doneAt + 8} dur={16}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: MONO,
              fontSize: 21,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.ink,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: C.ok,
              }}
            />
            DISPATCHED TO EVERY MODEL — VERBATIM
          </div>
        </FadeUp>
        <div style={{ height: 18 }} />
        <FadeUp at={doneAt + 20} dur={16}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.inkDim,
            }}
          >
            NO HINTS · NO RETRIES · NO SECOND CHANCES
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
