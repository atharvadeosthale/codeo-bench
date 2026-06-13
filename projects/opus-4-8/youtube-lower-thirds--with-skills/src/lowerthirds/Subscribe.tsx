import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, pop, EASE } from "../lib/anim";
import { BellGlyph, VerifiedGlyph, PlayGlyph } from "../components/icons";

/** YouTube subscribe call-to-action with cursor click + counting subs. */
export const Subscribe: React.FC<{
  channel?: string;
  baseSubs?: number;
  enterAt?: number;
}> = ({ channel = "PIXEL FORGE", baseSubs = 1_284_000, enterAt = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - enterAt;
  const card = pop(frame, fps, enterAt, 13);
  const slide = track(f, [0, 22], [40, 0]);

  // cursor travels in, presses at frame ~46, releases ~54
  const clickAt = 46;
  const cursorX = track(f, [14, clickAt], [220, 8], EASE);
  const cursorY = track(f, [14, clickAt], [120, 8], EASE);
  const press = f > clickAt && f < clickAt + 8 ? 0.94 : 1;
  const subscribed = f > clickAt + 3;

  // subs count up after the click
  const subs = Math.round(
    interpolate(f, [clickAt + 3, clickAt + 30], [baseSubs, baseSubs + 4120], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const ringP = track(f, [clickAt + 2, clickAt + 22], [0, 1]);
  const { a } = accents.subscribe;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 120,
        transform: `translateY(${slide}px) scale(${card})`,
        transformOrigin: "bottom left",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "18px 22px",
          borderRadius: 18,
          background: "rgba(12,14,20,0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
        }}
      >
        {/* channel avatar */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "linear-gradient(150deg, #FF0033, #7A0019)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px rgba(255,0,51,0.45)",
            flexShrink: 0,
          }}
        >
          <PlayGlyph size={34} color="#fff" />
        </div>
        {/* channel meta */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: fonts.head,
                fontWeight: 800,
                fontSize: 36,
                color: palette.white,
                letterSpacing: 0.5,
              }}
            >
              {channel}
            </span>
            <VerifiedGlyph size={22} color="#FF3B5C" />
          </div>
          <div
            style={{
              fontFamily: fonts.ui,
              fontSize: 19,
              color: palette.mute,
              marginTop: 3,
            }}
          >
            {(subs / 1_000_000).toFixed(2)}M subscribers
          </div>
        </div>
        {/* subscribe button */}
        <div
          style={{
            position: "relative",
            marginLeft: 6,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 26px",
            borderRadius: 999,
            background: subscribed ? "rgba(255,255,255,0.10)" : a,
            color: subscribed ? palette.mute : "#fff",
            fontFamily: fonts.head,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 2,
            transform: `scale(${press})`,
            boxShadow: subscribed ? "none" : `0 0 28px ${a}88`,
          }}
        >
          <BellGlyph size={22} color={subscribed ? palette.mute : "#fff"} />
          {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
          {/* click ripple */}
          {ringP > 0 && ringP < 1 && (
            <span
              style={{
                position: "absolute",
                left: 28,
                top: 22,
                width: 12 + ringP * 120,
                height: 12 + ringP * 120,
                marginLeft: -(6 + ringP * 60),
                marginTop: -(6 + ringP * 60),
                borderRadius: "50%",
                border: `2px solid ${a}`,
                opacity: 1 - ringP,
              }}
            />
          )}
        </div>
      </div>
      {/* cursor */}
      {f > 12 && f < clickAt + 40 && (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            right: cursorX,
            bottom: cursorY,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
            transform: `scale(${press === 1 ? 1 : 0.85})`,
          }}
        >
          <path
            d="M4 2l16 7-6.5 2.5L11 18 4 2z"
            fill="#fff"
            stroke="#0A0C12"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  );
};
