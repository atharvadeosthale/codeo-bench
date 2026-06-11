import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Avatar } from "../components/Avatar";
import { EASE_OUT, ramp } from "../easing";
import { sora } from "../fonts";

// 01 — Frosted glass card with gradient accent spine, avatar and shine sweep.
export const GlassLowerThird: React.FC<{
  name?: string;
  role?: string;
  handle?: string;
}> = ({ name = "AVA CHEN", role = "Product Designer", handle = "@avadesigns" }) => {
  const frame = useCurrentFrame();

  const barIn = ramp(frame, 0, 14);
  const cardIn = ramp(frame, 6, 24);
  const avatarIn = ramp(frame, 16, 14);
  const nameIn = ramp(frame, 20, 16);
  const roleIn = ramp(frame, 26, 16);
  const chipIn = ramp(frame, 32, 16);

  const clipRight = interpolate(cardIn, [0, 1], [100, 0]);
  const shine = ramp(frame, 55, 32, EASE_OUT);
  const float = Math.sin(frame / 26) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        bottom: 130,
        display: "flex",
        alignItems: "stretch",
        gap: 18,
        transform: `translateY(${float}px)`,
      }}
    >
      <div
        style={{
          width: 7,
          borderRadius: 4,
          background: "linear-gradient(180deg, #22d3ee, #8b5cf6, #ec4899)",
          transformOrigin: "bottom",
          transform: `scaleY(${barIn})`,
          boxShadow: "0 0 18px rgba(139,92,246,0.6)",
        }}
      />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "24px 40px 24px 26px",
          borderRadius: 22,
          backgroundColor: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(26px) saturate(160%)",
          WebkitBackdropFilter: "blur(26px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
          clipPath: `inset(0 ${clipRight}% 0 0 round 22px)`,
          opacity: cardIn === 0 ? 0 : 1,
          transform: `translateY(${(1 - cardIn) * 50}px)`,
        }}
      >
        <div
          style={{
            opacity: avatarIn,
            transform: `scale(${0.6 + avatarIn * 0.4})`,
          }}
        >
          <Avatar
            initials="AC"
            size={86}
            colors={["#8b5cf6", "#ec4899"]}
            ring="rgba(255,255,255,0.35)"
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: sora,
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: "0.02em",
              color: "#ffffff",
              opacity: nameIn,
              transform: `translateY(${(1 - nameIn) * 22}px)`,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 8,
              opacity: roleIn,
              transform: `translateY(${(1 - roleIn) * 16}px)`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
              }}
            />
            <span
              style={{
                fontFamily: sora,
                fontWeight: 400,
                fontSize: 24,
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {role}
            </span>
            <span
              style={{
                fontFamily: sora,
                fontSize: 19,
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                padding: "4px 14px",
                opacity: chipIn,
                transform: `translateX(${(1 - chipIn) * -12}px)`,
              }}
            >
              {handle}
            </span>
          </div>
        </div>

        {/* shine sweep */}
        <div
          style={{
            position: "absolute",
            top: -40,
            bottom: -40,
            width: 120,
            left: interpolate(shine, [0, 1], [-180, 720]),
            background:
              "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)",
            transform: "rotate(8deg)",
          }}
        />
      </div>
    </div>
  );
};
