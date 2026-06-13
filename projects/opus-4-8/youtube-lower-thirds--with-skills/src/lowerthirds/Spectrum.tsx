import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, pop } from "../lib/anim";

/** Music "now playing" lower third with live equalizer + scrubber. */
export const Spectrum: React.FC<{
  track_?: string;
  artist?: string;
  enterAt?: number;
}> = ({ track_ = "NEON HORIZON", artist = "LUMEN COLLECTIVE", enterAt = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - enterAt;
  const card = pop(frame, fps, enterAt, 13);
  const slide = track(f, [0, 22], [-50, 0]);
  const scrub = track(f, [10, 130], [0.12, 0.74]);
  const { a, b } = accents.spectrum;

  const bars = 28;
  const cur = Math.floor(160 * scrub);
  const total = "3:42";
  const mm = Math.floor(cur / 60);
  const ss = String(cur % 60).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 120,
        transform: `translateX(${slide}px) scale(${card})`,
        transformOrigin: "bottom left",
        width: 560,
        padding: "20px 26px",
        borderRadius: 20,
        background:
          "linear-gradient(120deg, rgba(28,12,46,0.86), rgba(12,7,22,0.82))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(177,75,255,0.28)",
        boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 40px ${a}22`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* album art */}
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 14,
            background: `linear-gradient(140deg, ${a}, ${b})`,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: `0 0 26px ${a}55`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 12,
          }}
        >
          {/* live equalizer inside art */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 46 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const h =
                18 + (Math.sin(frame * 0.4 + i * 1.3) * 0.5 + 0.5) * 28;
              return (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: h,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.92)",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              letterSpacing: 5,
              color: b,
              marginBottom: 6,
            }}
          >
            ♫ NOW PLAYING
          </div>
          <div
            style={{
              fontFamily: fonts.head,
              fontWeight: 800,
              fontSize: 34,
              color: palette.white,
              lineHeight: 1,
              letterSpacing: 0.5,
            }}
          >
            {track_}
          </div>
          <div
            style={{
              fontFamily: fonts.ui,
              fontSize: 19,
              color: palette.mute,
              marginTop: 5,
              letterSpacing: 2,
            }}
          >
            {artist}
          </div>
        </div>
      </div>

      {/* full-width spectrum */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: 40,
          margin: "16px 0 12px",
        }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const wave =
            Math.sin(frame * 0.3 + i * 0.55) * 0.5 +
            Math.sin(frame * 0.17 + i * 0.9) * 0.5;
          const h = 6 + (wave * 0.5 + 0.5) * 34;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                borderRadius: 2,
                background: `linear-gradient(${a}, ${b})`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      {/* scrubber */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 14, color: palette.mute }}>
          {mm}:{ss}
        </span>
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.14)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${scrub * 100}%`,
              background: `linear-gradient(90deg, ${a}, ${b})`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${scrub * 100}%`,
              top: "50%",
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: `0 0 10px ${a}`,
            }}
          />
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 14, color: palette.mute }}>
          {total}
        </span>
      </div>
    </div>
  );
};
