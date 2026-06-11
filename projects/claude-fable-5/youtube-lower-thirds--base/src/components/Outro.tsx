import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GROTESK, INTER, MONO } from "../fonts";
import { GlassLowerThird } from "../lowerthirds/Glass";
import { NeonLowerThird } from "../lowerthirds/Neon";
import { EditorialLowerThird } from "../lowerthirds/Editorial";
import { StreamLowerThird } from "../lowerthirds/Stream";
import { BroadcastLowerThird } from "../lowerthirds/Broadcast";
import { CutFlash } from "./Overlays";

const SubscribeButton: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - (clickAt - 26),
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const clicked = frame >= clickAt;
  const press = interpolate(
    frame,
    [clickAt - 3, clickAt, clickAt + 5],
    [1, 0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const ripple = interpolate(frame, [clickAt, clickAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellPop = spring({
    frame: frame - clickAt - 4,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const bellWiggle = clicked
    ? Math.sin((frame - clickAt) * 0.7) *
      14 *
      Math.max(0, 1 - (frame - clickAt) / 30)
    : 0;

  // Cursor glides in along a gentle arc, then dips on the click.
  const cursorT = interpolate(frame, [clickAt - 22, clickAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(cursorT, [0, 1], [340, 150]);
  const cursorY = interpolate(cursorT, [0, 1], [200, 56]) - Math.sin(cursorT * Math.PI) * 40;
  const cursorFade = interpolate(frame, [clickAt + 8, clickAt + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        transform: `scale(${appear * press})`,
        opacity: appear,
        display: "flex",
        alignItems: "center",
        gap: 26,
      }}
    >
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 100,
            top: "50%",
            width: 60,
            height: 60,
            marginTop: -30,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.8)",
            transform: `scale(${1 + ripple * 4})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 1,
          padding: "22px 54px",
          borderRadius: 999,
          background: clicked ? "rgba(255,255,255,0.14)" : "#ff0033",
          border: clicked
            ? "2px solid rgba(255,255,255,0.35)"
            : "2px solid transparent",
          color: "#fff",
          boxShadow: clicked ? "none" : "0 12px 44px rgba(255,0,51,0.45)",
        }}
      >
        {clicked ? "SUBSCRIBED" : "SUBSCRIBE"}
      </div>
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${clicked ? 0.7 + bellPop * 0.3 : 1}) rotate(${bellWiggle}deg)`,
          opacity: clicked ? 1 : 0.5,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorT > 0 ? cursorFade : 0,
          zIndex: 5,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24">
          <path
            d="M4 2 L20 12 L12.5 13.5 L16 21 L13 22.4 L9.5 14.8 L4 19 Z"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </div>
  );
};

// `height` reserves the scaled footprint — scale() alone doesn't shrink
// the layout box, so without it the stack overflows the frame.
const MINIS: { node: React.ReactNode; scale: number; height: number }[] = [
  { node: <GlassLowerThird delay={6} />, scale: 0.42, height: 80 },
  { node: <NeonLowerThird delay={12} />, scale: 0.4, height: 100 },
  { node: <EditorialLowerThird delay={18} />, scale: 0.36, height: 112 },
  { node: <StreamLowerThird delay={24} />, scale: 0.36, height: 118 },
  { node: <BroadcastLowerThird delay={30} />, scale: 0.42, height: 118 },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const endDim = interpolate(frame, [128, 144], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#07070d", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 28% 50%, rgba(120,110,255,0.14), transparent 70%), radial-gradient(ellipse 40% 40% at 78% 60%, rgba(255,0,51,0.1), transparent 70%)",
        }}
      />
      <AbsoluteFill style={{ opacity: endDim }}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 120,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          {MINIS.map((m, i) => {
            const p = spring({
              frame: frame - 4 - i * 6,
              fps,
              config: { damping: 22, stiffness: 150 },
            });
            return (
              <div key={i} style={{ height: m.height }}>
                <div
                  style={{
                    transform: `scale(${m.scale}) translateX(${(1 - p) * -200}px)`,
                    transformOrigin: "left top",
                    opacity: p,
                  }}
                >
                  {m.node}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            right: 140,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 36,
            width: 700,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 8,
              color: "rgba(255,255,255,0.55)",
              opacity: interpolate(frame, [26, 40], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            FIVE DOWN · INFINITE REMIXES
          </div>
          <div style={{ overflow: "hidden", paddingBottom: 18 }}>
            <div
              style={{
                fontFamily: GROTESK,
                fontWeight: 700,
                fontSize: 124,
                lineHeight: 1.08,
                letterSpacing: -3,
                color: "#fff",
                transform: `translateY(${(1 - spring({ frame: frame - 32, fps, config: { damping: 26, stiffness: 140 } })) * 110}%)`,
              }}
            >
              Build
              <br />
              yours.
            </div>
          </div>
          <SubscribeButton clickAt={86} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - endDim,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 10,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          LOWER THIRDS — MMXXVI
        </div>
      </AbsoluteFill>
      <CutFlash color="#0a0a14" />
    </AbsoluteFill>
  );
};
