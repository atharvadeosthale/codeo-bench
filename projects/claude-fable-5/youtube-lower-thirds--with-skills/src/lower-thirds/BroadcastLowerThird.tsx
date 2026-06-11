import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, OVERSHOOT, ramp } from "../easing";
import { mono, oswald } from "../fonts";

const TICKER_ITEMS = [
  "MARKETS RALLY AS TECH STOCKS SURGE 4.2%",
  "GLOBAL CLIMATE SUMMIT REACHES HISTORIC ACCORD",
  "SPACE AGENCY CONFIRMS CREWED LUNAR MISSION FOR 2028",
  "CHAMPIONSHIP FINAL DRAWS RECORD 90M VIEWERS",
];

// 03 — Broadcast news stack: skewed slabs, LIVE badge, scrolling ticker.
export const BroadcastLowerThird: React.FC<{
  name?: string;
  role?: string;
  network?: string;
}> = ({ name = "MAYA OKAFOR", role = "SENIOR CORRESPONDENT — LAGOS", network = "WORLD NEWS" }) => {
  const frame = useCurrentFrame();

  const mainIn = ramp(frame, 0, 18, OVERSHOOT);
  const roleIn = ramp(frame, 8, 18, OVERSHOOT);
  const badgeIn = ramp(frame, 16, 12);
  const tickerIn = ramp(frame, 24, 16, EASE_OUT);

  const livePulse = 0.75 + 0.25 * Math.sin(frame / 4);
  const tickerText = TICKER_ITEMS.map((t) => `${t}   •   `).join("").repeat(4);
  const tickerX = -((Math.max(frame - 24, 0)) * 2.6);

  const slab: React.CSSProperties = {
    transform: "skewX(-10deg)",
    display: "flex",
    alignItems: "center",
  };
  const unskew: React.CSSProperties = { transform: "skewX(10deg)" };

  return (
    <div style={{ position: "absolute", left: 110, bottom: 120 }}>
      {/* LIVE badge row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 10,
          marginLeft: 8,
          opacity: badgeIn,
          transform: `translateY(${(1 - badgeIn) * -16}px)`,
        }}
      >
        <div
          style={{
            ...slab,
            backgroundColor: "#e11d48",
            padding: "8px 22px",
            gap: 12,
            boxShadow: "0 6px 18px rgba(225,29,72,0.45)",
          }}
        >
          <div
            style={{
              ...unskew,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity: livePulse,
              transform: `skewX(10deg) scale(${0.85 + livePulse * 0.25})`,
            }}
          />
          <span
            style={{
              ...unskew,
              fontFamily: oswald,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "0.18em",
              color: "#fff",
            }}
          >
            LIVE
          </span>
        </div>
        <div
          style={{
            ...slab,
            backgroundColor: "rgba(255,255,255,0.92)",
            padding: "8px 22px",
          }}
        >
          <span
            style={{
              ...unskew,
              fontFamily: oswald,
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: "0.18em",
              color: "#0a1430",
            }}
          >
            {network}
          </span>
        </div>
      </div>

      {/* name slab */}
      <div
        style={{
          opacity: mainIn === 0 ? 0 : 1,
          transform: `translateX(${(1 - mainIn) * -640}px)`,
        }}
      >
        <div
          style={{
            ...slab,
            background: "linear-gradient(135deg, #101d45 0%, #1a2c63 100%)",
            borderLeft: "10px solid #e11d48",
            padding: "16px 60px 16px 30px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            width: "fit-content",
          }}
        >
          <span
            style={{
              ...unskew,
              fontFamily: oswald,
              fontWeight: 700,
              fontSize: 56,
              letterSpacing: "0.06em",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        </div>
      </div>

      {/* role slab */}
      <div
        style={{
          opacity: roleIn === 0 ? 0 : 1,
          transform: `translateX(${(1 - roleIn) * -640}px)`,
          marginTop: 6,
          marginLeft: 14,
        }}
      >
        <div
          style={{
            ...slab,
            backgroundColor: "rgba(255,255,255,0.94)",
            padding: "8px 34px 8px 22px",
            width: "fit-content",
          }}
        >
          <span
            style={{
              ...unskew,
              fontFamily: oswald,
              fontWeight: 500,
              fontSize: 27,
              letterSpacing: "0.14em",
              color: "#101d45",
              whiteSpace: "nowrap",
            }}
          >
            {role}
          </span>
        </div>
      </div>

      {/* ticker */}
      <div
        style={{
          marginTop: 12,
          marginLeft: 8,
          width: 880,
          overflow: "hidden",
          backgroundColor: "rgba(4,8,24,0.85)",
          borderTop: "2px solid rgba(225,29,72,0.9)",
          opacity: tickerIn,
          transformOrigin: "left",
          transform: `scaleX(${interpolate(tickerIn, [0, 1], [0.3, 1])})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            transform: `translateX(${tickerX}px)`,
            padding: "8px 0",
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 20,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {tickerText}
          </span>
        </div>
      </div>
    </div>
  );
};
