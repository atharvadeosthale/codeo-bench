import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { accents, fonts, palette } from "../theme";
import { track, wipe, pop } from "../lib/anim";

export const Aurora: React.FC<{
  name?: string;
  role?: string;
  initials?: string;
  enterAt?: number;
}> = ({
  name = "ELENA VOSS",
  role = "Senior Product Designer",
  initials = "EV",
  enterAt = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - enterAt;
  const slide = track(f, [0, 24], [-70, 0]);
  const reveal = track(f, [0, 26], [0, 1]);
  const sheen = ((frame * 1.4) % 220) - 40;
  const ring = (frame * 1.6) % 360;
  const av = pop(frame, fps, enterAt + 6, 12);
  const barH = track(f, [10, 34], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 120,
        transform: `translateX(${slide}px)`,
        clipPath: wipe(reveal, "left"),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "20px 34px 20px 22px",
          borderRadius: 22,
          background:
            "linear-gradient(135deg, rgba(22,26,38,0.78), rgba(12,15,24,0.66))",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
          overflow: "hidden",
        }}
      >
        {/* aurora accent bar */}
        <div
          style={{
            width: 6,
            height: 88 * barH,
            borderRadius: 6,
            background: `linear-gradient(${ring}deg, ${accents.aurora.a}, ${accents.aurora.b})`,
            boxShadow: `0 0 22px ${accents.aurora.a}`,
            alignSelf: "center",
          }}
        />
        {/* avatar */}
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: "50%",
            padding: 3,
            background: `conic-gradient(from ${ring}deg, ${accents.aurora.a}, ${accents.aurora.b}, ${accents.aurora.a})`,
            transform: `scale(${av})`,
            boxShadow: `0 0 26px ${accents.aurora.a}66`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(160deg, #1b2030, #0c0f18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.head,
              fontWeight: 700,
              fontSize: 32,
              color: palette.white,
              letterSpacing: 1,
            }}
          >
            {initials}
          </div>
        </div>
        {/* text */}
        <div style={{ paddingRight: 8 }}>
          <div
            style={{
              fontFamily: fonts.head,
              fontWeight: 700,
              fontSize: 46,
              color: palette.white,
              lineHeight: 1,
              letterSpacing: 0.5,
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 16,
                height: 2,
                background: accents.aurora.a,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: fonts.ui,
                fontSize: 20,
                letterSpacing: 4,
                color: palette.mute,
                textTransform: "uppercase",
              }}
            >
              {role}
            </span>
          </div>
        </div>
        {/* sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sheen}%`,
            width: 80,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            transform: "skewX(-14deg)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
