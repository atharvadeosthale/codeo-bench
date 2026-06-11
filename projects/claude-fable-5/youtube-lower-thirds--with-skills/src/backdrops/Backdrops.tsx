import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Grain } from "../components/Grain";

const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

// 01 — Aurora: drifting chromatic blobs on a deep violet base (frosted glass scene)
export const AuroraBackdrop: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const blob = (
    color: string,
    size: number,
    cx: number,
    cy: number,
    speed: number,
    phase: number,
  ): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
    left: cx + Math.sin(t * speed + phase) * 120 - size / 2,
    top: cy + Math.cos(t * speed * 0.8 + phase) * 90 - size / 2,
    filter: "blur(40px)",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0718", overflow: "hidden" }}>
      <div style={blob("rgba(124,58,237,0.55)", 1100, 480, 380, 0.5, 0)} />
      <div style={blob("rgba(236,72,153,0.40)", 950, 1450, 250, 0.4, 2.1)} />
      <div style={blob("rgba(34,211,238,0.35)", 1000, 1250, 850, 0.45, 4.2)} />
      <div style={blob("rgba(99,102,241,0.40)", 800, 350, 950, 0.35, 1.3)} />
      <Vignette />
      {dim > 0 ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(5,3,12,${dim})` }} />
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};

// 02 — Cyber grid: perspective floor scrolling toward camera, neon horizon
export const GridBackdrop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 45% at 50% 52%, rgba(34,211,238,0.16) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-40%",
          right: "-40%",
          top: "52%",
          height: "85%",
          transform: "perspective(680px) rotateX(63deg)",
          transformOrigin: "top center",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(34,211,238,0.16) 2px, transparent 2px)",
          backgroundSize: "96px 96px",
          backgroundPosition: `0px ${(frame * 1.6) % 96}px`,
        }}
      />
      {/* fade the grid into the horizon */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "22%",
          background: "linear-gradient(#04060c, transparent)",
        }}
      />
      {/* scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 5px)",
          opacity: 0.5,
        }}
      />
      <Vignette strength={0.7} />
      <Grain />
    </AbsoluteFill>
  );
};

// 03 — Newsroom: navy gradient, sweeping diagonal stripes, red undertone
export const StripesBackdrop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a1430 0%, #12204d 55%, #0a1028 100%)",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 50px, transparent 50px, transparent 170px)",
          backgroundPosition: `${frame * 1.2}px 0px`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -450,
          bottom: -650,
          background: "radial-gradient(circle, rgba(225,29,72,0.22) 0%, transparent 60%)",
          filter: "blur(30px)",
        }}
      />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};

// 04 — Paper: warm light studio with drifting geometric line-art
export const PaperBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f6f2e9 0%, #efe9dc 60%, #e7dfcf 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: "50%",
          border: "1.5px solid rgba(26,23,20,0.10)",
          left: 1280 + Math.sin(t * 0.4) * 30,
          top: 80 + Math.cos(t * 0.3) * 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          border: "1.5px solid rgba(26,23,20,0.08)",
          left: 180 + Math.cos(t * 0.35) * 25,
          top: 520,
          transform: `rotate(${12 + t * 2}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 1.5,
          background: "rgba(26,23,20,0.10)",
          left: 700,
          top: 780,
          transform: `rotate(-18deg) translateX(${Math.sin(t * 0.5) * 20}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 35% 40%, rgba(255,255,255,0.5) 0%, transparent 60%)",
        }}
      />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

// 05 — Ember: near-black with a breathing gold glow and rising sparks
export const EmberBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 0.7 + 0.3 * Math.sin(frame / 28);

  const sparks = Array.from({ length: 26 }, (_, i) => {
    const seedX = random(`ember-x-${i}`);
    const seedY = random(`ember-y-${i}`);
    const speed = 0.4 + random(`ember-s-${i}`) * 0.9;
    const size = 2 + random(`ember-r-${i}`) * 3.5;
    const x = seedX * 1920 + Math.sin(frame / 40 + i) * 30;
    const y = (((seedY * 1080 - frame * speed) % 1080) + 1080) % 1080;
    const twinkle = 0.25 + 0.55 * Math.abs(Math.sin(frame / 16 + i * 1.7));
    return { x, y, size, twinkle, key: i };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#070503", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1200,
          left: -200,
          top: 100,
          background:
            "radial-gradient(circle, rgba(202,164,94,0.20) 0%, rgba(120,84,40,0.08) 40%, transparent 65%)",
          filter: "blur(20px)",
          opacity: breathe,
        }}
      />
      {sparks.map((s) => (
        <div
          key={s.key}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: "#e9c989",
            opacity: s.twinkle,
            boxShadow: "0 0 8px rgba(233,201,137,0.8)",
          }}
        />
      ))}
      <Vignette strength={0.75} />
      <Grain />
    </AbsoluteFill>
  );
};
