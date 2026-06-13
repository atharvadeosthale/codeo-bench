import React from "react";
import { useCurrentFrame } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, wipe } from "../lib/anim";

const TICKER =
  "RENDER FARM HITS 4K/120 IN REALTIME   ◆   CREATORS REPORT 38% FASTER EDITS   ◆   NEW MOTION PRESETS SHIP TODAY   ◆   STUDIO UPDATE 4.0 NOW LIVE   ◆   ";

/** Broadcast breaking-news lower band with scrolling ticker. */
export const Breaking: React.FC<{
  flag?: string;
  headline?: string;
  location?: string;
  enterAt?: number;
}> = ({
  flag = "BREAKING",
  headline = "STUDIO 4.0 REWRITES THE RENDER PIPELINE",
  location = "GLOBAL DESK",
  enterAt = 6,
}) => {
  const frame = useCurrentFrame();
  const f = frame - enterAt;
  const barY = track(f, [0, 22], [140, 0]);
  const flagW = track(f, [2, 20], [0, 1]);
  const headReveal = track(f, [14, 40], [0, 1]);
  const tickerX = -((frame * 4) % 1600);
  const clock = 11 * 3600 + 42 * 60 + (frame % 60);
  const hh = String(Math.floor(clock / 3600)).padStart(2, "0");
  const mm = String(Math.floor((clock % 3600) / 60)).padStart(2, "0");
  const ss = String(clock % 60).padStart(2, "0");
  const { a, b } = accents.breaking;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 64,
        transform: `translateY(${barY}px)`,
      }}
    >
      {/* main band */}
      <div
        style={{
          margin: "0 56px",
          height: 92,
          display: "flex",
          alignItems: "stretch",
          background:
            "linear-gradient(90deg, rgba(10,14,24,0.96), rgba(8,11,20,0.9))",
          borderRadius: "6px 6px 0 0",
          overflow: "hidden",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
          borderTop: `3px solid ${a}`,
        }}
      >
        {/* flag */}
        <div
          style={{
            background: `linear-gradient(135deg, ${a}, ${b})`,
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            clipPath: wipe(flagW, "left"),
          }}
        >
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: 44,
              color: "#fff",
              letterSpacing: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {flag}
          </span>
        </div>
        {/* headline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: fonts.head,
              fontWeight: 700,
              fontSize: 36,
              color: palette.white,
              letterSpacing: 0.5,
              clipPath: wipe(headReveal, "left"),
              whiteSpace: "nowrap",
            }}
          >
            {headline}
          </span>
        </div>
        {/* live + clock */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 26px",
            borderLeft: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: fonts.head,
              fontWeight: 700,
              fontSize: 22,
              color: a,
              letterSpacing: 2,
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: a,
                boxShadow: `0 0 12px ${a}`,
                opacity: Math.sin(frame * 0.5) > -0.3 ? 1 : 0.3,
              }}
            />
            LIVE
          </span>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 22,
              color: palette.white,
              letterSpacing: 1,
            }}
          >
            {hh}:{mm}:{ss}
          </span>
        </div>
      </div>
      {/* ticker strip */}
      <div
        style={{
          margin: "0 56px",
          height: 34,
          background: "#0A0C12",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            background: a,
            color: "#fff",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            fontFamily: fonts.head,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 2,
            flexShrink: 0,
          }}
        >
          {location}
        </div>
        <div
          style={{
            whiteSpace: "nowrap",
            transform: `translateX(${tickerX}px)`,
            fontFamily: fonts.mono,
            fontSize: 16,
            color: palette.mute,
            letterSpacing: 1,
            paddingLeft: 20,
          }}
        >
          {TICKER + TICKER}
        </div>
      </div>
    </div>
  );
};
