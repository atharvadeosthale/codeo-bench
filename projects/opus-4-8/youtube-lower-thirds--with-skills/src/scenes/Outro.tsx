import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette } from "../theme";
import { track, pop, EASE } from "../lib/anim";
import { LOWER_THIRDS } from "../lowerthirds";

const MiniCard: React.FC<{ entry: (typeof LOWER_THIRDS)[number]; delay: number }> =
  ({ entry, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = pop(frame, fps, delay, 14);
    const o = track(frame, [delay, delay + 12], [0, 1]);
    return (
      <div
        style={{
          width: 220,
          opacity: o,
          transform: `translateY(${(1 - s) * 30}px) scale(${s})`,
          padding: 18,
          borderRadius: 16,
          background: "rgba(14,17,25,0.8)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px ${entry.accent.a}1f`,
        }}
      >
        <div
          style={{
            height: 6,
            width: 54,
            borderRadius: 6,
            background: `linear-gradient(90deg, ${entry.accent.a}, ${entry.accent.b})`,
            boxShadow: `0 0 14px ${entry.accent.a}`,
            marginBottom: 16,
          }}
        />
        <div
          style={{
            fontFamily: fonts.head,
            fontWeight: 800,
            fontSize: 26,
            color: palette.white,
            letterSpacing: 0.5,
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 13,
            letterSpacing: 2,
            color: palette.mute,
            marginTop: 6,
          }}
        >
          {entry.kind.toUpperCase()}
        </div>
        {/* mock content skeleton */}
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ height: 6, width: "85%", borderRadius: 4, background: "rgba(255,255,255,0.14)" }} />
          <div style={{ height: 6, width: "60%", borderRadius: 4, background: "rgba(255,255,255,0.08)" }} />
        </div>
      </div>
    );
  };

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const blobT = frame * 0.02;
  const headY = track(frame, [4, 28], [60, 0], EASE);
  const headO = track(frame, [4, 24], [0, 1]);
  const lockO = track(frame, [78, 100], [0, 1]);
  const lockY = track(frame, [78, 104], [40, 0], EASE);
  const cardLift = track(frame, [80, 110], [0, -30]);
  const cardFade = track(frame, [84, 112], [1, 0.55]);
  const sheen = ((frame - 80) * 2.6) % 280;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(130% 120% at 50% 40%, #0E1424 0%, #070A12 55%, #04060A 100%)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: "#7DF9FF",
          filter: "blur(150px)",
          opacity: 0.16,
          transform: `translate(${Math.sin(blobT) * 60}px, ${Math.cos(blobT) * 50}px)`,
        }}
      />

      {/* headline */}
      <div
        style={{
          position: "absolute",
          top: 150,
          textAlign: "center",
          transform: `translateY(${headY}px)`,
          opacity: headO,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 18,
            letterSpacing: 8,
            color: "#7DF9FF",
            marginBottom: 16,
          }}
        >
          THE FULL SET
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 96,
            color: palette.white,
            letterSpacing: 1,
            lineHeight: 0.9,
          }}
        >
          SEVEN WAYS TO LOWER-THIRD
        </div>
      </div>

      {/* card row */}
      <div
        style={{
          display: "flex",
          gap: 18,
          transform: `translateY(${cardLift}px)`,
          opacity: cardFade,
          marginTop: 40,
        }}
      >
        {LOWER_THIRDS.map((e, i) => (
          <MiniCard key={e.id} entry={e} delay={16 + i * 5} />
        ))}
      </div>

      {/* final lockup */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          textAlign: "center",
          opacity: lockO,
          transform: `translateY(${lockY}px)`,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: 80,
              letterSpacing: 3,
              background: "linear-gradient(100deg, #7DF9FF, #A98BFF)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            LOWER THIRDS
          </span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sheen - 30}%`,
              width: 120,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              transform: "skewX(-16deg)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: fonts.ui,
            fontSize: 22,
            letterSpacing: 3,
            color: palette.mute,
          }}
        >
          <span>7 COMPONENTS</span>
          <span style={{ color: "#7DF9FF" }}>·</span>
          <span>ONE TOOLKIT</span>
          <span style={{ color: "#7DF9FF" }}>·</span>
          <span>BUILT WITH REMOTION</span>
        </div>
      </div>

      {/* corner CTA echo */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 64,
          opacity: lockO * (0.7 + 0.3 * pulse),
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 22px",
          borderRadius: 999,
          background: "#FF0033",
          fontFamily: fonts.head,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 2,
          color: "#fff",
          boxShadow: `0 0 ${20 + pulse * 18}px rgba(255,0,51,0.6)`,
        }}
      >
        ▶ SUBSCRIBE
      </div>
    </AbsoluteFill>
  );
};
