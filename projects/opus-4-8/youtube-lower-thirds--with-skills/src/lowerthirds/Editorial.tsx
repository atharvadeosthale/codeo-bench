import React from "react";
import { useCurrentFrame } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, EASE_SOFT } from "../lib/anim";

/** Minimal editorial / documentary name plate with a drawing rule. */
export const Editorial: React.FC<{
  name?: string;
  role?: string;
  location?: string;
  enterAt?: number;
}> = ({
  name = "JONAS REIN",
  role = "Cinematographer",
  location = "REYKJAVÍK, IS",
  enterAt = 6,
}) => {
  const frame = useCurrentFrame();
  const f = frame - enterAt;
  const rule = track(f, [0, 36], [0, 1], EASE_SOFT);
  const nameY = track(f, [6, 30], [26, 0]);
  const nameO = track(f, [6, 28], [0, 1]);
  const roleO = track(f, [16, 40], [0, 1]);
  const tick = track(f, [2, 20], [0, 1]);
  const { a } = accents.editorial;

  return (
    <div
      style={{
        position: "absolute",
        left: 84,
        bottom: 132,
        width: 720,
      }}
    >
      {/* top hairline that draws out from the left */}
      <div
        style={{
          height: 1.5,
          width: `${rule * 100}%`,
          background: `linear-gradient(90deg, ${a}, rgba(232,195,122,0.1))`,
          marginBottom: 18,
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
        <div
          style={{
            fontFamily: fonts.mono,
            color: a,
            fontSize: 18,
            letterSpacing: 4,
            opacity: tick,
            transform: `translateY(${nameY * 0.6}px)`,
            paddingBottom: 8,
          }}
        >
          01
        </div>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: fonts.head,
              fontWeight: 700,
              fontSize: 60,
              lineHeight: 1,
              color: palette.white,
              letterSpacing: 6,
              transform: `translateY(${nameY}px)`,
              opacity: nameO,
            }}
          >
            {name}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          marginLeft: 40,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: roleO,
        }}
      >
        <span
          style={{
            fontFamily: fonts.ui,
            fontSize: 22,
            color: palette.white,
            letterSpacing: 1,
          }}
        >
          {role}
        </span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: a }} />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 16,
            color: palette.mute,
            letterSpacing: 3,
          }}
        >
          {location}
        </span>
      </div>
    </div>
  );
};
