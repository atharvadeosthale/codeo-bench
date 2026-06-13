import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts, palette } from "../theme";
import { track } from "../lib/anim";

const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

/** Film grain that subtly drifts each frame so it shimmers like real grain. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const x = (frame * 13) % 160;
  const y = (frame * 7) % 160;
  return (
    <AbsoluteFill
      style={{
        // Inline, synchronous data-URI grain — safe to render every frame.
        // eslint-disable-next-line @remotion/no-background-image
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "160px 160px",
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Faint horizontal scanlines for a broadcast-monitor texture. */
export const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
      mixBlendMode: "overlay",
      opacity: 0.5,
      pointerEvents: "none",
    }}
  />
);

/** Combined cinematic finishing layer. */
export const FilmChrome: React.FC = () => (
  <>
    <Scanlines />
    <Grain />
    <Vignette />
  </>
);

/** Bottom progress line with ticks. */
export const ProgressBar: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      left: 64,
      right: 64,
      bottom: 44,
      height: 2,
      background: "rgba(255,255,255,0.12)",
      borderRadius: 2,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: `${progress * 100}%`,
        background: color,
        borderRadius: 2,
        boxShadow: `0 0 14px ${color}`,
      }}
    />
  </div>
);

/** Trailer corner HUD: brand mark, live tag and timecode. */
export const HUD: React.FC<{
  index: number;
  total: number;
  label: string;
  timecode: string;
  color: string;
}> = ({ index, total, label, timecode, color }) => {
  const frame = useCurrentFrame();
  const blink = Math.sin(frame * 0.45) > -0.2 ? 1 : 0.25;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 64,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: fonts.ui,
          color: palette.white,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
        <span style={{ fontWeight: 700, letterSpacing: 3, fontSize: 18 }}>
          LOWER THIRDS
        </span>
        <span style={{ color: palette.mute, letterSpacing: 2, fontSize: 14 }}>
          / SHOWCASE
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 48,
          right: 64,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: fonts.mono,
          color: palette.white,
          fontSize: 15,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: "#FF3B5C",
            opacity: blink,
            letterSpacing: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FF3B5C",
            }}
          />
          REC
        </span>
        <span style={{ color: palette.mute, letterSpacing: 1 }}>{timecode}</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 82,
          fontFamily: fonts.mono,
          color: palette.mute,
          fontSize: 14,
          letterSpacing: 2,
          display: "flex",
          gap: 10,
          alignItems: "baseline",
        }}
      >
        <span style={{ color, fontWeight: 700 }}>
          {String(index).padStart(2, "0")}
        </span>
        <span>/ {String(total).padStart(2, "0")}</span>
        <span style={{ color: palette.white, letterSpacing: 3 }}>{label}</span>
      </div>
    </>
  );
};

/** Big animated component name that slides up at scene start. */
export const SceneTitle: React.FC<{
  kicker: string;
  title: string;
  color: string;
}> = ({ kicker, title, color }) => {
  const frame = useCurrentFrame();
  const y = track(frame, [4, 26], [40, 0]);
  const o = track(frame, [4, 22], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        right: 64,
        bottom: 150,
        textAlign: "right",
        transform: `translateY(${y}px)`,
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          color,
          letterSpacing: 6,
          fontSize: 16,
          marginBottom: 6,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          color: palette.white,
          fontSize: 84,
          lineHeight: 0.9,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>
    </div>
  );
};
